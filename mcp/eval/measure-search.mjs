/** Compare equivalent complete reads through individual and research-search MCP calls. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { performance } from 'node:perf_hooks';
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';

const { values } = parseArgs({ options: { output: { type: 'string' }, area: { type: 'string', default: 'quantum-algorithm' }, 'max-bytes': { type: 'string', default: '65536' } } });
if (!values.output) throw new Error('Pass --output /tmp/search-latency.json');
const requestedMaxBytes = Number(values['max-bytes']);
if (!Number.isInteger(requestedMaxBytes) || requestedMaxBytes < 16384 || requestedMaxBytes > 1048576) throw new Error('max-bytes must be an integer from 16384 to 1048576');
const root = fileURLToPath(new URL('../../', import.meta.url));
const filters = { area: values.area, status: 'Unsolved', sort: 'title', limit: 200 };
const bytes = value => Buffer.byteLength(JSON.stringify(value));
const round = value => Math.round(value * 100) / 100;
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const started = performance.now();
const child = spawn(process.execPath, ['--experimental-strip-types', '--no-warnings', path.join(root, 'mcp/eval/serve-catalog.ts')], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
const lines = createInterface({ input: child.stdout });
let stderr = '', client;
child.stderr.on('data', chunk => { stderr += chunk; });
try {
  const metadata = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Server startup timed out')), 30000);
    lines.once('line', line => { clearTimeout(timer); try { resolve(JSON.parse(line)); } catch (error) { reject(error); } });
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited ${code}: ${stderr}`)); });
  });
  const startupMs = round(performance.now() - started);
  client = new Client({ name: 'research-search-measurement', version: '1' }, { versionNegotiation: { mode: { pin: '2026-07-28' } } });
  await client.connect(new StreamableHTTPClientTransport(new URL(metadata.endpoint)));
  const measurements = [];
  async function run(mode) {
    const began = performance.now();
    let calls = 0, resultBytes = 0, dataBytes = 0, nextCursor, expectedTotal, catalogVersion;
    let maxBytes = requestedMaxBytes;
    const problems = [], pages = [], budgetRaises = [];
    const call = async (name, args) => {
      calls++;
      const result = await client.callTool({ name, arguments: args });
      resultBytes += bytes(result);
      const data = result.structuredContent;
      assert.ok(data && typeof data === 'object', 'Tool returned structured data');
      dataBytes += bytes(data);
      return { data, error: result.isError };
    };
    while (true) {
      const result = await call('search_problems', { ...filters, ...(nextCursor ? { cursor: nextCursor } : {}),
        ...(mode === 'research' ? { view: 'research', maxBytes } : {}) });
      if (result.error) {
        const { code, minimumRequiredBytes } = result.data;
        if (mode === 'research' && code === 'response_budget_too_small' && Number.isInteger(minimumRequiredBytes)
          && minimumRequiredBytes > maxBytes && minimumRequiredBytes <= 1048576) {
          budgetRaises.push({ from: maxBytes, to: minimumRequiredBytes });
          maxBytes = minimumRequiredBytes;
          continue;
        }
        throw new Error(JSON.stringify(result.data));
      }
      const page = result.data;
      expectedTotal ??= page.total;
      catalogVersion ??= page.catalogVersion;
      assert.equal(page.total, expectedTotal);
      assert.equal(page.catalogVersion, catalogVersion);
      assert.equal(page.count, page.problems.length);
      assert.ok(page.count > 0 || (page.total === 0 && page.nextCursor === null));
      pages.push({ count: page.count, offset: page.offset, responseBytes: page.responseBytes ?? null, maxBytes: page.maxBytes ?? null });
      if (mode === 'research') {
        assert.equal(page.schemaVersion, 'qop-search-research/1');
        assert.equal(bytes(page), page.responseBytes);
        assert.ok(page.responseBytes <= page.maxBytes);
        problems.push(...page.problems);
      } else {
        // Eight concurrent single reads reproduce a reasonable existing-client baseline.
        for (let index = 0; index < page.problems.length; index += 8) {
          const group = await Promise.all(page.problems.slice(index, index + 8).map(async row => {
            const detail = await call('get_problem', { id: row.id, view: 'research' });
            assert.equal(detail.error, false);
            return detail.data;
          }));
          problems.push(...group);
        }
      }
      nextCursor = page.nextCursor;
      if (!nextCursor) break;
    }
    assert.ok(expectedTotal > 0, 'Benchmark requires a nonempty matching catalog');
    assert.equal(problems.length, expectedTotal);
    assert.equal(new Set(problems.map(problem => problem.id)).size, expectedTotal);
    return { mode, elapsedMs: round(performance.now() - began), calls, count: problems.length,
      catalogVersion, resultBytes, dataBytes, pages, budgetRaises, problems };
  }
  for (let repeat = 0; repeat < 3; repeat++) {
    const before = await run('individual');
    const after = await run('research');
    assert.equal(before.catalogVersion, after.catalogVersion);
    assert.deepEqual(after.problems, before.problems, 'Every research-search problem equals the single-read response');
    for (const { problems, ...measurement } of [before, after]) measurements.push({ repeat: repeat + 1, ...measurement });
  }
  const summary = ['individual', 'research'].map(mode => ({ mode,
    medianMs: round(median(measurements.filter(item => item.mode === mode).map(item => item.elapsedMs))),
    calls: measurements.find(item => item.mode === mode).calls,
    count: measurements.find(item => item.mode === mode).count,
    resultBytes: measurements.find(item => item.mode === mode).resultBytes,
  }));
  const report = { metadata, gitHead: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    node: process.version, startupMs, filters, requestedMaxBytes, summary, measurements,
    validation: 'All complete problem responses compared deeply, with unique complete coverage and equal catalog versions in every pair.',
    limits: ['Local read-only in-memory service, no external model calls.', 'JSON-serialized SDK result bytes include text and structuredContent, excluding JSON-RPC and HTTP wire framing; model token ingestion depends on the client.', 'Three repetitions per path; not an end-to-end model speed benchmark.', 'Same server and client; individual reads run first in every pair, without randomized order.'] };
  fs.writeFileSync(path.resolve(values.output), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ output: path.resolve(values.output), summary }, null, 2));
} finally {
  await client?.close().catch(() => {});
  lines.close();
  if (child.exitCode === null && child.signalCode === null) await new Promise(resolve => {
    const timer = setTimeout(() => child.kill('SIGKILL'), 5000);
    child.once('exit', () => { clearTimeout(timer); resolve(); });
    child.kill('SIGTERM');
  });
}
