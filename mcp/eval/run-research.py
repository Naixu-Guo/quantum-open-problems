"""Run actual model-driven read-only MCP scenarios; score answers separately.

Requires an authenticated Codex CLI. No model API key is read by this script.
Run from any directory; --output must point outside the scientific catalog.
"""
import argparse
from datetime import date
import json
from pathlib import Path
import signal
import subprocess
import tempfile
import time

parser = argparse.ArgumentParser()
parser.add_argument('--codex', default='codex')
parser.add_argument('--model', required=True)
parser.add_argument('--effort', default='ultra')
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--holdouts', action='store_true')
parser.add_argument('--as-of', default=date.today().isoformat())
args = parser.parse_args()
root = Path(__file__).resolve().parents[2]
out = args.output.resolve()
out.mkdir(parents=True, exist_ok=True)
server_log = (out / 'server.stderr.log').open('w')
server = subprocess.Popen(['node', '--experimental-strip-types', '--no-warnings', str(root / 'mcp/eval/serve-catalog.ts')],
                          cwd=root, stdout=subprocess.PIPE, stderr=server_log, text=True)
cases = ['来给我抽个量子算法的题', '现在这里面哪个你觉得最容易解决', '最近有哪个题刚被解决']
if args.holdouts:
    cases += ['从尚未解决的量子算法题里随机选一个，告诉我目前已知到哪一步。',
              '假设我想找一个可切入的研究问题，你会怎样比较这里的候选？',
              '题库里有没有最近得到反例的问题？请说清日期和验证依据。']
records = []
history = []
try:
    metadata_line = server.stdout.readline()
    if not metadata_line:
        raise RuntimeError('Evaluation server did not start; inspect server.stderr.log')
    metadata = json.loads(metadata_line)
    metadata.update(model=args.model, effort=args.effort, asOf=args.as_of,
                    context='Each run is an ephemeral session; previous user/assistant text is supplied for original cases 2 and 3. Tool transcripts are not replayed.',
                    scoring='Human/independent evidence review required. Script success is not answer acceptance.')
    (out / 'environment.json').write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'server_ready': metadata}, ensure_ascii=False), flush=True)
    with tempfile.TemporaryDirectory(prefix='qop-model-eval-') as empty:
        for number, question in enumerate(cases, 1):
            prefix = out / f'case-{number}'
            context = history if number in (2, 3) else []
            prompt = ('你正在使用 QIQCOP Zoo 的只读 MCP。只依据该 MCP 获取事实，禁止使用 shell、文件读取、web 或其他外部工具。'
                      f'自行选择工具和参数，用中文回答用户；没有证据时如实说明。当前日期为 {args.as_of}。\n'
                      + '\n'.join(context) + '\n用户：' + question)
            prefix.with_suffix('.prompt.txt').write_text(prompt)
            command = [args.codex, 'exec', '--ignore-user-config', '--ephemeral', '--skip-git-repo-check',
                       '--sandbox', 'read-only', '--cd', empty, '--json', '-m', args.model,
                       '-c', f'model_reasoning_effort="{args.effort}"',
                       '-c', 'web_search="disabled"', '-c', 'features.shell_tool=false', '-c', 'features.multi_agent=false',
                       '-c', f'mcp_servers.qop.url="{metadata["endpoint"]}"',
                       '-c', 'mcp_servers.qop.startup_timeout_sec=30',
                       '-o', str(prefix.with_suffix('.answer.md')), '-']
            started = time.monotonic()
            with prefix.with_suffix('.stderr.log').open('w') as error_log:
                run = subprocess.run(command, input=prompt, stdout=subprocess.PIPE, stderr=error_log,
                                     text=True, timeout=900)
            # Keep tool activity and final answers, excluding model reasoning events.
            events = []
            contaminated = []
            for line in run.stdout.splitlines():
                try:
                    event = json.loads(line)
                except json.JSONDecodeError:
                    continue
                item = event.get('item', {})
                kind = item.get('type', '')
                if kind in ('reasoning', 'reasoning_summary'):
                    continue
                events.append(event)
                if kind in ('command_execution', 'web_search', 'file_change'):
                    contaminated.append(kind)
                if kind == 'mcp_tool_call' and item.get('server') != 'qop':
                    contaminated.append('foreign_mcp')
            prefix.with_suffix('.events.jsonl').write_text(''.join(json.dumps(e, ensure_ascii=False) + '\n' for e in events))
            answer_path = prefix.with_suffix('.answer.md')
            answer = answer_path.read_text() if answer_path.exists() else ''
            result = {'case': number, 'question': question, 'exitCode': run.returncode,
                      'seconds': round(time.monotonic() - started, 2), 'contamination': contaminated,
                      'answerPresent': bool(answer), 'toolCalls': sum(e.get('type') == 'item.completed' and e.get('item', {}).get('type') == 'mcp_tool_call' for e in events),
                      'usage': [e.get('usage') for e in events if e.get('type') == 'turn.completed'],
                      'accepted': None}
            records.append(result)
            (out / 'runs.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
            print(json.dumps(result, ensure_ascii=False), flush=True)
            if run.returncode:
                raise RuntimeError(f'Codex failed on case {number}; stop and inspect logs')
            if not answer or contaminated:
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
