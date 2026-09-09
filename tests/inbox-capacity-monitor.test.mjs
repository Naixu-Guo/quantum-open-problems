import { test } from "node:test";
import assert from "node:assert/strict";
import { checkInboxCapacity } from "../scripts/check-inbox-capacity.mjs";

const first = "01M21QDQ001YZRAP1WAQDRPF57", second = "01M21QDQ00SN72F1AKT6X4BZW6";
const sample = (state = "warning", id = first) => ({ state, hour: { used: state === "full" ? 100 : state === "warning" ? 80 : 0, limit: 100, resetsAt: null }, rows: { used: 12, limit: 10000 }, storage: { usedBytes: 65536, limitBytes: 268435456, reserveBytes: 1048576 }, lastAlert: id ? { id, at: "2026-09-09T00:00:00Z", level: state === "full" ? "full" : "warning", resources: ["hour"], storedBytes: 65536, maxBytes: 268435456 } : null });
function fixture(initial = sample()) {
  const state = { capacity: initial, issues: [], comments: [], calls: [], failPatchOnce: false, monitorStatus: 200 };
  const run = () => checkInboxCapacity({ monitorKey: "monitor-secret", githubToken: "github-secret", repository: "owner/repo", assignee: "owner", fetchImpl: async (url, init) => {
    state.calls.push({ url, method: init.method ?? "GET", body: init.body ? JSON.parse(init.body) : undefined });
    assert.equal(init.redirect, "error");
    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status });
    if (url === "https://api.qiqc-op.com/inbox/capacity") { assert.equal(init.headers.Authorization, "Bearer monitor-secret"); return reply(state.capacity, state.monitorStatus); }
    assert.ok(url.startsWith("https://api.github.com/repos/owner/repo/"));
    assert.equal(init.headers.Authorization, "Bearer github-secret");
    const body = init.body ? JSON.parse(init.body) : null;
    if (url.includes("/comments")) {
      if (init.method === "POST") { state.comments.push({ body: body.body, user: { login: "github-actions[bot]" } }); state.issues[0].comments++; return reply(state.comments.at(-1), 201); }
      return reply(state.comments);
    }
    if (init.method === "POST") { const issue = { number: state.issues.length + 1, state: "open", comments: 0, user: { login: "github-actions[bot]" }, ...body }; state.issues.unshift(issue); return reply(issue, 201); }
    if (init.method === "PATCH") {
      if (state.failPatchOnce) { state.failPatchOnce = false; return reply({}, 500); }
      const issue = state.issues.find(i => String(i.number) === url.split("/").at(-1)); Object.assign(issue, body); return reply(issue);
    }
    return reply(state.issues);
  } });
  return { state, run, writes: () => state.calls.filter(x => x.method !== "GET") };
}

test("healthy inbox sends no notification; the first alert assigns only the owner", async () => {
  const { state, run, writes } = fixture(sample("ok", null));
  assert.equal((await run()).action, "none"); assert.equal(writes().length, 0);
  state.capacity = sample();
  assert.equal((await run()).action, "created"); assert.equal(writes().length, 1);
  assert.deepEqual(writes()[0].body.assignees, ["owner"]); assert.match(writes()[0].body.body, /80% warning/);
  assert.ok(!JSON.stringify(writes()).includes("secret"));
});

test("repeated checks deduplicate; escalation notifies once and recovery closes the issue", async () => {
  const { state, run, writes } = fixture();
  await run(); const before = writes().length;
  await run(); await run(); assert.equal(writes().length, before);
  state.capacity = sample("full", second); await run();
  assert.equal(state.comments.length, 1); assert.match(state.comments[0].body, /@owner — Inbox limit reached/);
  await run(); assert.equal(state.comments.length, 1);
  state.capacity.state = "ok"; state.capacity.hour.used = 0;
  await run(); assert.equal(state.issues[0].state, "closed");
  const recovered = writes().length; await run(); assert.equal(writes().length, recovered);
});

test("an incident that recovered before the scheduled check still sends one notice", async () => {
  const { state, run, writes } = fixture(sample("ok"));
  assert.equal((await run()).action, "created");
  assert.equal(state.issues[0].state, "closed");
  assert.match(state.issues[0].body, /currently has capacity again/);
  const before = writes().length; await run(); assert.equal(writes().length, before);
});

test("a retry after a partial GitHub failure does not duplicate the alert comment", async () => {
  const { state, run } = fixture(); await run();
  state.capacity = sample("full", second); state.failPatchOnce = true;
  await assert.rejects(run(), /HTTP 500/); assert.equal(state.comments.length, 1);
  await run(); assert.equal(state.comments.length, 1);
});

test("the notifier never overwrites a human-created issue with a copied marker", async () => {
  const { state, run, writes } = fixture();
  state.issues.push({ number: 42, state: "open", user: { login: "some-user" }, body: '<!-- qop-inbox-capacity:v1 {"alertId":"old","state":"warning"} -->' });
  await run(); assert.equal(writes()[0].method, "POST");
  assert.equal(state.issues.find(x => x.number === 42).state, "open");
});

test("monitor failures and malformed alert content cannot create misleading GitHub issues", async () => {
  const { state, run, writes } = fixture();
  state.monitorStatus = 401; await assert.rejects(run(), /HTTP 401/);
  state.monitorStatus = 200; state.capacity.lastAlert.resources = ["@everyone"];
  await assert.rejects(run(), /Invalid capacity alert/); assert.equal(writes().length, 0);
});
