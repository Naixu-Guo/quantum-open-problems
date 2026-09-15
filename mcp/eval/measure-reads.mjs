/** Local read-only API/MCP latency and response-size probe; no model calls. */
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createInterface } from 'node:readline';
import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: { output: { type: 'string' }, 'model-events': { type: 'string' } } });
if (!values.output) throw new Error('Usage: node --experimental-strip-types mcp/eval/measure-reads.mjs --output /tmp/reads.json [--model-events /tmp/model-eval]');
const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.resolve(values.output);
const modelEvents = values['model-events'];
const require = createRequire(path.join(root, 'mcp/package.json'));
const { Client, StreamableHTTPClientTransport } = await import(require.resolve('@modelcontextprotocol/client'));
const bytes = value => Buffer.byteLength(JSON.stringify(value));
const round = value => Math.round(value * 100) / 100;
const median = values => [...values].sort((a,b)=>a-b)[Math.floor(values.length/2)];
const allFields = new Map();
let label = 'setup';
const network = [];
const reads = [];
const stderr = [];
const serverStarted = performance.now();
const child = spawn(process.execPath, ['--experimental-strip-types', '--no-warnings', path.join(root, 'mcp/eval/serve-catalog.ts')], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
child.stderr.on('data', data => stderr.push(data.toString()));
const lines = createInterface({ input: child.stdout });
let client;
try {
const metadata = await new Promise((resolve,reject) => {
 const timer=setTimeout(()=>reject(new Error('server startup timeout')),30000);
 lines.once('line', line => {clearTimeout(timer);resolve(JSON.parse(line));});
 child.once('error', error=>{clearTimeout(timer);reject(error);});
 child.once('exit', code=>{clearTimeout(timer);reject(new Error(`server exited ${code}: ${stderr.join('')}`));});
});
const startupMs = performance.now()-serverStarted;
client = new Client({name:'local-latency-probe',version:'1'},{versionNegotiation:{mode:{pin:'2026-07-28'}}});
const transport = new StreamableHTTPClientTransport(new URL(metadata.endpoint), {fetch: async (input, init) => {
 const group=label;
 const start=performance.now();
 const response=await fetch(input,init);
 const pending=response.clone().arrayBuffer().then(body=>network.push({group,status:response.status,bodyBytes:body.byteLength,ms:round(performance.now()-start)}));
 reads.push(pending);
 return response;
}});
async function api(route) {
 const start=performance.now();
 const response=await fetch(metadata.api+route);
 const raw=await response.arrayBuffer();
 if(!response.ok)throw new Error(`API ${response.status}: ${Buffer.from(raw).toString()}`);
 return {value:JSON.parse(Buffer.from(raw).toString()),bodyBytes:raw.byteLength,ms:performance.now()-start};
}
async function mcp(id) {
 const start=performance.now();
 const result=await client.callTool({name:'get_problem',arguments:{id,view:'research'}});
 if(result.isError)throw new Error(JSON.stringify(result));
 return {value:result.structuredContent,resultBytes:bytes(result),ms:performance.now()-start};
}
async function pool(ids,concurrency,fn) {
 let next=0;
 const results=new Array(ids.length);
 await Promise.all(Array.from({length:Math.min(concurrency,ids.length)},async()=>{
  while(next<ids.length){const index=next++;results[index]=await fn(ids[index]);}
 }));
 return results;
}
 await client.connect(transport);
 const search=await api('/api/v1/problems?area=quantum-algorithm&status=Unsolved&limit=200&sort=title');
 const ids=search.value.problems.map(problem=>problem.id);
 if (!ids.length || search.value.nextCursor) throw new Error('This benchmark requires a nonempty algorithm catalog fitting in its 200-record discovery page');
 const benchmarks=[];
 const resultValues=[];
 for(const kind of ['api','mcp'])for(const concurrency of [...new Set([1,8,ids.length])]){
  const batchSamples=[];
  for(let repeat=0;repeat<3;repeat++){
   label=`${kind}-c${concurrency}-r${repeat+1}`;
   const start=performance.now();
   const results=await pool(ids,concurrency,kind==='api'?id=>api(`/api/v1/problems/${id}?view=research`):mcp);
   const elapsed=performance.now()-start;
   await Promise.all(reads);
   batchSamples.push({elapsedMs:round(elapsed),requestMedianMs:round(median(results.map(x=>x.ms))),requestMinMs:round(Math.min(...results.map(x=>x.ms))),requestMaxMs:round(Math.max(...results.map(x=>x.ms))),jsonValueBytes:results.reduce((sum,x)=>sum+bytes(x.value),0),...(kind==='api'?{httpBodyBytes:results.reduce((sum,x)=>sum+x.bodyBytes,0)}:{mcpResultBytes:results.reduce((sum,x)=>sum+x.resultBytes,0),httpResponseBodyBytes:network.filter(x=>x.group===label).reduce((sum,x)=>sum+x.bodyBytes,0)})});
   if(kind==='api'&&concurrency===1&&repeat===0)resultValues.push(...results.map(x=>x.value));
  }
  benchmarks.push({kind,concurrency,requestsPerBatch:ids.length,repeats:3,batches:batchSamples,batchMedianMs:round(median(batchSamples.map(x=>x.elapsedMs)))});
 }
 for(const value of resultValues)for(const [key,item]of Object.entries(value))allFields.set(key,(allFields.get(key)||0)+bytes(item));
 const subsets={topLevelProvenance:0,researchProvenance:0,perResearchEntryProvenance:0,sharedEntryProvenanceBytes:0,entryCount:0,statementBody:0,statementClauses:0,ledgerReferences:0,authoredBibliography:0,researchTextOnly:0};
 for(const problem of resultValues){
  subsets.topLevelProvenance+=bytes(problem.provenance);
  subsets.researchProvenance+=bytes(problem.research.provenance);
  subsets.statementBody+=bytes(problem.statement.body);
  subsets.statementClauses+=bytes(problem.statement.clauses);
  subsets.ledgerReferences+=bytes(problem.references);
  subsets.authoredBibliography+=bytes(problem.research.references);
  for(const section of ['source','progress','comment','references'])for(const entry of problem.research[section]){
   subsets.entryCount++;
   subsets.perResearchEntryProvenance+=bytes(entry.provenance);
   const localProvenance = { ...entry.provenance };
   for (const [key, value] of Object.entries(problem.research.provenance)) {
    if (JSON.stringify(localProvenance[key]) === JSON.stringify(value)) delete localProvenance[key];
   }
   subsets.sharedEntryProvenanceBytes += bytes(entry.provenance) - bytes(localProvenance);
   subsets.researchTextOnly+=bytes(entry.text);
  }
 }
 const lifecycle=[];
 if (modelEvents) for(let number=1;number<=3;number++){
  const events=fs.readFileSync(path.join(modelEvents,`case-${number}.events.jsonl`),'utf8').trim().split('\n').map(JSON.parse);
  const active=new Set();let peak=0,current=[];const groups=[];
  const completed=[];
  for(const event of events){
   if(event.item?.type!=='mcp_tool_call')continue;
   if(event.type==='item.started'){active.add(event.item.id);peak=Math.max(peak,active.size);current.push({id:event.item.id,tool:event.item.tool});}
   if(event.type==='item.completed'){completed.push(event.item);active.delete(event.item.id);if(!active.size){groups.push(current);current=[];}}
  }
  lifecycle.push({case:number,peakOutstanding:peak,groups:groups.map(group=>({count:group.length,tools:[...new Set(group.map(x=>x.tool))]})),topLevelKeys:[...new Set(events.flatMap(x=>Object.keys(x)))],itemKeys:[...new Set(events.flatMap(x=>Object.keys(x.item??{})))],resultBytes:completed.reduce((sum,item)=>sum+bytes(item.result),0),structuredValueBytes:completed.reduce((sum,item)=>sum+bytes(item.result?.structured_content),0)});
 }
 const sourceHashes={};
 for(const file of ['service/src/read-models.ts','service/src/research-view.ts','service/src/index.ts','mcp/src/result.ts'])sourceHashes[file]=createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
 const report={metadata,startupMs:round(startupMs),node:process.version,gitHead:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),sourceHashes,search:{elapsedMs:round(search.ms),bodyBytes:search.bodyBytes,count:ids.length},benchmarks,fieldBytes:[...allFields].sort((a,b)=>b[1]-a[1]).map(([field,totalBytes])=>({field,totalBytes})),subsets,originalModelLifecycle:lifecycle,notes:['Fresh local process, same machine, in-memory stores, 111-record catalog; startup is measured separately.','Sequential and pooled request batches repeat three times. Results are local client wall time, not isolated service CPU or remote-host latency.','MCP HTTP body bytes include protocol framing and two content representations; model token ingestion may differ by client.','Original model logs contain lifecycle ordering but no timing fields, so they do not support attributing portions of the 99-second run to specific calls.'],serverStderr:stderr.join('')};
 fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({ output, count: ids.length, startupMs: report.startupMs, benchmarks: benchmarks.map(({kind,concurrency,batchMedianMs})=>({kind,concurrency,batchMedianMs})) },null,2));
}finally{
 await client?.close().catch(() => {});
 lines.close();
 if (child.exitCode === null && child.signalCode === null) {
  await new Promise(resolve => {
   const timer = setTimeout(() => child.kill('SIGKILL'), 5_000);
   child.once('exit', () => { clearTimeout(timer); resolve(); });
   child.kill('SIGTERM');
  });
 }
}
