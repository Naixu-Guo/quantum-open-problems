"""Local visibility-harness regressions; no MCP listeners or model calls.

Run: python3 -m unittest discover -s mcp/eval -p 'test_visibility.py' -v
"""
import importlib.util
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import tempfile
import unittest

sys.dont_write_bytecode = True
RUNNER = Path(__file__).with_name('run-visibility.py').resolve()
spec = importlib.util.spec_from_file_location('visibility', RUNNER)
visibility = importlib.util.module_from_spec(spec)
spec.loader.exec_module(visibility)


class VisibilityHarnessTest(unittest.TestCase):
    def event(self, phase, item_id):
        return {'type': f'item.{phase}', 'item': {'id': item_id, 'type': 'mcp_tool_call',
                                               'server': 'qop', 'tool': 'search_problems'}}

    def observe(self, events):
        code = 'import sys;sys.stdin.read();print(' + repr('\n'.join(map(json.dumps, events))) + ')'
        with tempfile.TemporaryDirectory() as directory:
            observed, _ = visibility.observe([sys.executable, '-c', code], '', Path(directory), timeout=3)
        self.assertEqual(observed['exitCode'], 0)
        return observed

    def test_one_call_requires_one_matching_start_and_completion(self):
        observed = self.observe([self.event('started', 'one'), self.event('completed', 'one')])
        self.assertEqual(observed['toolCallsStarted'], 1)
        self.assertEqual(observed['toolCalls'], 1)
        self.assertEqual(observed['activeCallIds'], [])
        self.assertTrue(visibility.exactly_one_prompted_call(observed, [{'exact': True}]))
        self.assertFalse(visibility.exactly_one_prompted_call(observed, [{'exact': False}]))
        self.assertFalse(visibility.exactly_one_prompted_call(observed, [{'exact': True}] * 2))

    def test_extra_unfinished_or_unmatched_call_events_are_ineligible(self):
        cases = {
            'extra-unfinished': [('started', 'one'), ('completed', 'one'), ('started', 'extra')],
            'duplicate-start': [('started', 'one'), ('started', 'one'), ('completed', 'one')],
            'completion-without-start': [('completed', 'one')],
            'mismatched-id': [('started', 'one'), ('completed', 'other')],
            'duplicate-completion': [('started', 'one'), ('completed', 'one'), ('completed', 'one')],
        }
        for name, phases in cases.items():
            with self.subTest(name=name):
                observed = self.observe([self.event(*phase) for phase in phases])
                self.assertFalse(visibility.exactly_one_prompted_call(observed, [{'exact': True}]))
                if name == 'extra-unfinished':
                    self.assertEqual(observed['toolCallsStarted'], 2)
                    self.assertEqual(observed['toolCalls'], 1)
                    self.assertEqual(observed['activeCallIds'], ['extra'])

    def test_timeout_kills_child_holding_stdout_after_leader_exit(self):
        # Run observe itself in a bounded supervisor so this regression fails
        # promptly even if a future change reintroduces a blocking reader.close.
        with tempfile.TemporaryDirectory(prefix='qop-visibility-cleanup-') as directory:
            folder = Path(directory)
            pidfile = folder / 'processes.json'
            ready = folder / 'child-ready'
            child = ('import signal,time;from pathlib import Path;'
                     'signal.signal(signal.SIGTERM,signal.SIG_IGN);'
                     f'Path({str(ready)!r}).touch();time.sleep(30)')
            leader = ('import os,subprocess,sys,json,time;from pathlib import Path;'
                      f'child=subprocess.Popen([sys.executable,"-c",{child!r}]);'
                      f'Path({str(pidfile)!r}).write_text(json.dumps({{"group":os.getpid(),"child":child.pid}}));'
                      f'\nwhile not Path({str(ready)!r}).exists(): time.sleep(.005)')
            supervisor = ('import importlib.util,json,sys;from pathlib import Path;'
                          f's=importlib.util.spec_from_file_location("visibility",{str(RUNNER)!r});'
                          'v=importlib.util.module_from_spec(s);s.loader.exec_module(v);'
                          f'print(json.dumps(v.observe([sys.executable,"-c",{leader!r}],"",Path({str(folder)!r}),timeout=.5)[0]),flush=True)')
            process = subprocess.Popen([sys.executable, '-u', '-c', supervisor], stdout=subprocess.PIPE,
                                       stderr=subprocess.PIPE, text=True, start_new_session=True)
            try:
                output, errors = process.communicate(timeout=6)
                self.assertEqual(process.returncode, 0, errors)
                result = json.loads(output)
                self.assertIn('Host timeout', result['failure'])
                self.assertEqual(result['exitCode'], 0, 'The leader exited normally before the child was cleaned up')
                self.assertLess(result['timing']['totalSeconds'], 4)
                self.assertTrue(ready.exists(), 'The inherited-stdout child was running and ignored SIGTERM')
            finally:
                # Test cleanup also covers the broken implementation case.
                if pidfile.exists():
                    try:
                        os.killpg(json.loads(pidfile.read_text())['group'], signal.SIGKILL)
                    except ProcessLookupError:
                        pass
                if process.poll() is None:
                    process.kill()
                process.communicate(timeout=3)


if __name__ == '__main__':
    unittest.main()
