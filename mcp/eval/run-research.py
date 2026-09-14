"""Run actual model-driven read-only MCP scenarios; score answers separately.

Requires an authenticated Codex CLI. No model API key is read by this script.
Run from any directory; --output must point outside the scientific catalog.
"""
import argparse
from datetime import date
import json
from pathlib import Path
import queue
import signal
import subprocess
import tempfile
import threading
import time


def observe_codex(command, prompt, prefix, timeout=900, allow_web=False):
    """Timestamp arrival of stdout events at this host, not API execution time."""
    started = time.monotonic()
    observed = queue.Queue()
    events, contaminated, tool_timings = [], [], []
    active_tools = {}
    first_tool_started = last_tool_completed = None
    tool_kinds = {'mcp_tool_call', 'command_execution', 'web_search', 'file_change'}
    with prefix.with_suffix('.stderr.log').open('w') as error_log, \
            prefix.with_suffix('.events.jsonl').open('w') as event_log, \
            prefix.with_suffix('.timings.jsonl').open('w') as timing_log:
        run = subprocess.Popen(command, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                               stderr=error_log, text=True, bufsize=1)

        def read_events():
            try:
                for line in run.stdout:
                    observed.put((time.monotonic(), line))
            finally:
                observed.put((time.monotonic(), None))

        def write_prompt():
            try:
                run.stdin.write(prompt)
                run.stdin.flush()
            except (BrokenPipeError, OSError):
                pass  # The exit code remains the source of process failure.
            finally:
                try:
                    run.stdin.close()
                except OSError:
                    pass

        reader = threading.Thread(target=read_events, daemon=True)
        writer = threading.Thread(target=write_prompt, daemon=True)
        reader.start()
        writer.start()
        try:
            while True:
                remaining = started + timeout - time.monotonic()
                if remaining <= 0:
                    raise subprocess.TimeoutExpired(command, timeout)
                try:
                    observed_at, line = observed.get(timeout=remaining)
                except queue.Empty:
                    raise subprocess.TimeoutExpired(command, timeout) from None
                if line is None:
                    break
                try:
                    event = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if not isinstance(event, dict):
                    continue
                item = event.get('item')
                item = item if isinstance(item, dict) else {}
                kind = item.get('type', '')
                elapsed = round(observed_at - started, 6)
                # Every JSON event has a timing entry. This allowlist excludes
                # reasoning text, tool arguments, results and answer contents.
                timing = {'eventType': event.get('type'), 'itemType': kind or None,
                          'itemId': item.get('id'),
                          'observedMonotonicSeconds': observed_at,
                          'secondsSinceStart': elapsed}
                timing_log.write(json.dumps(timing, ensure_ascii=False) + '\n')
                timing_log.flush()
                if kind in ('reasoning', 'reasoning_summary'):
                    continue
                event['_qopObservation'] = {'monotonicSeconds': observed_at,
                                            'secondsSinceStart': elapsed}
                events.append(event)
                event_log.write(json.dumps(event, ensure_ascii=False) + '\n')
                event_log.flush()
                if kind in ('command_execution', 'file_change') or (kind == 'web_search' and not allow_web):
                    contaminated.append(kind)
                if kind == 'mcp_tool_call' and item.get('server') != 'qop':
                    contaminated.append('foreign_mcp')
                if kind not in tool_kinds or event.get('type') not in ('item.started', 'item.completed'):
                    continue
                item_id = item.get('id')
                key = (kind, item_id) if isinstance(item_id, (str, int)) else None
                if event['type'] == 'item.started':
                    tool = {'itemId': item_id, 'kind': kind, 'server': item.get('server'),
                            'tool': item.get('tool'), 'startedAtSeconds': elapsed,
                            'completedAtSeconds': None, 'observedSeconds': None}
                    tool_timings.append(tool)
                    if key is not None:
                        active_tools[key] = tool
                    if first_tool_started is None:
                        first_tool_started = elapsed
                else:
                    tool = active_tools.pop(key, None) if key is not None else None
                    if tool is None:
                        tool = {'itemId': item_id, 'kind': kind, 'server': item.get('server'),
                                'tool': item.get('tool'), 'startedAtSeconds': None,
                                'completedAtSeconds': None, 'observedSeconds': None}
                        tool_timings.append(tool)
                    tool['completedAtSeconds'] = elapsed
                    if tool['startedAtSeconds'] is not None:
                        tool['observedSeconds'] = round(elapsed - tool['startedAtSeconds'], 6)
                    last_tool_completed = elapsed
            remaining = started + timeout - time.monotonic()
            if remaining <= 0:
                raise subprocess.TimeoutExpired(command, timeout)
            run.wait(timeout=remaining)
        except BaseException:
            run.kill()
            run.wait()
            raise
        finally:
            reader.join(timeout=1)
            writer.join(timeout=1)
            run.stdout.close()
    total = round(time.monotonic() - started, 6)
    return {
        'exitCode': run.returncode, 'seconds': round(total, 2),
        'contamination': contaminated,
        'toolCalls': sum(e.get('type') == 'item.completed' and e.get('item', {}).get('type') == 'mcp_tool_call' for e in events),
        'usage': [e.get('usage') for e in events if e.get('type') == 'turn.completed'],
        'timing': {'basis': 'Host-observed Codex stdout event arrival and process lifetime; includes CLI scheduling, buffering and transport overhead, not pure API latency.',
                   'clock': 'time.monotonic', 'startedMonotonicSeconds': started,
                   'offsetUnit': 'seconds since process observation started; missing start/completion events remain null',
                   'firstToolStarted': first_tool_started, 'lastToolCompleted': last_tool_completed,
                   'totalSeconds': total, 'tools': tool_timings},
    }


parser = argparse.ArgumentParser()
parser.add_argument('--codex', default='codex')
parser.add_argument('--model', required=True)
parser.add_argument('--effort', default='ultra')
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--holdouts', action='store_true')
parser.add_argument('--as-of', default=date.today().isoformat())
parser.add_argument('--question', help='Run one custom read-only question instead of the original scenarios.')
parser.add_argument('--allow-web', action='store_true', help='Allow live web tools for literature-handoff verification; shell and writes remain disabled.')
parser.add_argument('--case', type=int, choices=(1, 2, 3),
                    help='Run only this original case; cases 2/3 require --history-from.')
parser.add_argument('--history-from', type=Path,
                    help='Reuse preceding case-N.answer.md files from this baseline directory.')
args = parser.parse_args()
cases = ['来给我抽个量子算法的题', '现在这里面哪个你觉得最容易解决', '最近有哪个题刚被解决']
history = []
if args.question is not None:
    if not args.question.strip():
        parser.error('--question must be nonempty')
    if args.case is not None or args.holdouts or args.history_from is not None:
        parser.error('--question cannot be combined with original-case selection or history')
    cases = [args.question]
if args.case is not None and args.holdouts:
    parser.error('--case selects an original case and cannot be combined with --holdouts')
if args.case in (2, 3) and args.history_from is None:
    parser.error('--case 2/3 requires --history-from to replay the original preceding answers')
if args.history_from is not None:
    if args.case not in (2, 3):
        parser.error('--history-from is only used with --case 2 or --case 3')
    for previous in range(1, args.case):
        answer_path = args.history_from.resolve() / f'case-{previous}.answer.md'
        try:
            answer = answer_path.read_text()
        except OSError as error:
            parser.error(f'Cannot reconstruct original history from {answer_path}: {error}')
        if not answer.strip():
            parser.error(f'Cannot reconstruct original history: {answer_path} is empty')
        history.extend(['用户：' + cases[previous - 1], '助手：' + answer])
root = Path(__file__).resolve().parents[2]
out = args.output.resolve()
out.mkdir(parents=True, exist_ok=True)
server_log = (out / 'server.stderr.log').open('w')
server = subprocess.Popen(['node', '--experimental-strip-types', '--no-warnings', str(root / 'mcp/eval/serve-catalog.ts')],
                          cwd=root, stdout=subprocess.PIPE, stderr=server_log, text=True)
if args.holdouts:
    cases += ['从尚未解决的量子算法题里随机选一个，告诉我目前已知到哪一步。',
              '假设我想找一个可切入的研究问题，你会怎样比较这里的候选？',
              '题库里有没有最近得到反例的问题？请说清日期和验证依据。']
records = []
try:
    metadata_line = server.stdout.readline()
    if not metadata_line:
        raise RuntimeError('Evaluation server did not start; inspect server.stderr.log')
    metadata = json.loads(metadata_line)
    metadata.update(model=args.model, effort=args.effort, asOf=args.as_of,
                    customQuestion=args.question, webMode='live' if args.allow_web else 'disabled',
                    selectedCase=args.case, historyFrom=str(args.history_from.resolve()) if args.history_from else None,
                    context='Each run is an ephemeral session; previous user/assistant text is supplied for original cases 2 and 3. Tool transcripts are not replayed.',
                    scoring='Human/independent evidence review required. Script success is not answer acceptance.')
    (out / 'environment.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'server_ready': metadata}, ensure_ascii=False), flush=True)
    with tempfile.TemporaryDirectory(prefix='qop-model-eval-') as empty:
        for number, question in enumerate(cases, 1):
            if args.case is not None and number != args.case:
                continue
            prefix = out / f'case-{number}'
            context = history if number in (2, 3) else []
            tool_policy = ('请从该 MCP 获取题库事实；允许使用 web 查阅外部原始文献，区分目录记录与外部核查。禁止使用 shell、文件读取、写入或其他外部工具。'
                           if args.allow_web else '只依据该 MCP 获取事实，禁止使用 shell、文件读取、web 或其他外部工具。')
            prompt = ('你正在使用 QIQCOP Zoo 的只读 MCP。' + tool_policy
                      + f'自行选择工具和参数，用中文回答用户；没有证据时如实说明。当前日期为 {args.as_of}。\n'
                      + '\n'.join(context) + '\n用户：' + question)
            prefix.with_suffix('.prompt.txt').write_text(prompt)
            command = [args.codex, 'exec', '--ignore-user-config', '--ephemeral', '--skip-git-repo-check',
                       '--sandbox', 'read-only', '--cd', empty, '--json', '-m', args.model,
                       '-c', f'model_reasoning_effort="{args.effort}"',
                       '-c', 'web_search="live"' if args.allow_web else 'web_search="disabled"', '-c', 'features.shell_tool=false', '-c', 'features.multi_agent=false',
                       '-c', f'mcp_servers.qop.url="{metadata["endpoint"]}"',
                       '-c', 'mcp_servers.qop.startup_timeout_sec=30',
                       '-o', str(prefix.with_suffix('.answer.md')), '-']
            observed_run = observe_codex(command, prompt, prefix, timeout=900, allow_web=args.allow_web)
            answer_path = prefix.with_suffix('.answer.md')
            answer = answer_path.read_text() if answer_path.exists() else ''
            result = {'case': number, 'question': question, **observed_run,
                      'answerPresent': bool(answer),
                      'accepted': None}
            records.append(result)
            (out / 'runs.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
            print(json.dumps(result, ensure_ascii=False), flush=True)
            if observed_run['exitCode']:
                raise RuntimeError(f'Codex failed on case {number}; stop and inspect logs')
            if not answer or observed_run['contamination']:
                raise RuntimeError(f'Case {number} has no usable uncontaminated answer')
            if number <= 3:
                history.extend(['用户：' + question, '助手：' + answer])
finally:
    server.send_signal(signal.SIGTERM)
    try:
        server.wait(timeout=10)
    except subprocess.TimeoutExpired:
        server.kill()
        server.wait()
    server_log.close()
