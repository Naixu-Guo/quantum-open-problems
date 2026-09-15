"""Local regressions for the paged marker grader; no provider or server calls."""
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('paged_visibility', Path(__file__).with_name('run-problem-read-visibility.py'))
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


class PagedReadVisibilityTest(unittest.TestCase):
    def test_grading_keeps_omitted_and_duplicate_pages_in_denominator(self):
        rows = [{'pageIndex': i, **{key: f'{i}_{key}' for key in runner.MARKERS}} for i in range(3)]
        expected = {'pages': rows}
        raw = json.dumps(rows)
        complete = runner.grade(raw, expected, raw)
        self.assertTrue(complete['allMarkersMatched'])
        self.assertEqual(complete['matchedMarkers'], 9)
        incomplete = runner.grade(json.dumps(rows[:1]), expected, raw)
        self.assertEqual((incomplete['matchedMarkers'], incomplete['expectedMarkers']), (3, 9))
        self.assertFalse(incomplete['allMarkersMatched'])
        duplicated = runner.grade(json.dumps(rows + [rows[1]]), expected, raw)
        self.assertFalse(duplicated['allMarkersMatched'])
        self.assertEqual(duplicated['matchedMarkers'], 6)
        self.assertTrue(duplicated['issues'])
        for answer in ['{}', '[{"pageIndex":true}]', 'not JSON']:
            self.assertFalse(runner.grade(answer, expected, raw)['allMarkersMatched'])

    def test_observer_allows_only_the_explicit_expected_mcp_tool(self):
        events = [{'type': f'item.{phase}', 'item': {'id': 'one', 'type': 'mcp_tool_call', 'server': 'qop', 'tool': 'read_problem'}}
                  for phase in ('started', 'completed')]
        code = 'import sys;sys.stdin.read();print(' + repr('\n'.join(map(json.dumps, events))) + ')'
        with tempfile.TemporaryDirectory() as directory:
            accepted, _ = runner.visibility.observe([sys.executable, '-c', code], '', Path(directory), expected_tool='read_problem')
        self.assertEqual(accepted['contamination'], [])
        self.assertEqual(accepted['toolCallsStarted'], 1)
        self.assertEqual(accepted['toolCalls'], 1)
        with tempfile.TemporaryDirectory() as directory:
            rejected, _ = runner.visibility.observe([sys.executable, '-c', code], '', Path(directory))
        self.assertIn('unexpected_mcp_tool', rejected['contamination'])


if __name__ == '__main__':
    unittest.main()
