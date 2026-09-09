#!/usr/bin/env node
/** Notify the repository owner through one bot-owned issue; never fetch proposal content. */
import { pathToFileURL } from "node:url";

const MARKER = "<!-- qop-inbox-capacity:v1 ";
const TITLE = "[Operations] Proposal inbox capacity";
function metadata(body) {
  const match = String(body ?? "").match(/<!-- qop-inbox-capacity:v1 (\{[^\n]*\}) -->/u);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

export async function checkInboxCapacity({ monitorKey, githubToken, repository, assignee = repository.split("/")[0], fetchImpl = fetch }) {
  if (!monitorKey || !githubToken) throw new Error("Both monitoring and GitHub credentials are required");
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u.test(repository) || !/^[A-Za-z0-9-]+$/u.test(assignee)) throw new Error("Invalid repository or notification recipient");
  const response = await fetchImpl("https://api.qiqc-op.com/inbox/capacity", {
    headers: { Authorization: `Bearer ${monitorKey}` }, redirect: "error", signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Inbox capacity check failed (HTTP ${response.status})`);
  const capacity = await response.json();
  if (!["ok", "warning", "full"].includes(capacity.state) || !capacity.hour || !capacity.rows || !capacity.storage) throw new Error("Invalid capacity response");
  const alert = capacity.lastAlert;
  if (alert && (!/^[0-9A-HJKMNP-TV-Z]{26}$/u.test(alert.id) || !["warning", "full"].includes(alert.level) || !Array.isArray(alert.resources) || alert.resources.some(r => !["hour", "rows", "storage"].includes(r)) || !Number.isFinite(Date.parse(alert.at)))) throw new Error("Invalid capacity alert");
  if (!alert) return { action: "none", state: capacity.state };
  const github = async (route, method = "GET", body) => {
    const reply = await fetchImpl(`https://api.github.com/repos/${repository}${route}`, {
      method, headers: { Authorization: `Bearer ${githubToken}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), redirect: "error", signal: AbortSignal.timeout(20_000),
    });
    if (!reply.ok) throw new Error(`GitHub capacity notification failed (HTTP ${reply.status})`);
    return reply.json();
  };
  let issue;
  for (let page = 1; ; page++) {
    const issues = await github(`/issues?state=all&creator=github-actions%5Bbot%5D&sort=updated&direction=desc&per_page=100&page=${page}`);
    issue = issues.find(candidate => !candidate.pull_request && candidate.user?.login === "github-actions[bot]" && metadata(candidate.body));
    if (issue || issues.length < 100) break;
    if (page >= 10) throw new Error("Too many bot issues to locate the capacity notification safely");
  }
  const previous = issue ? metadata(issue.body) : null;
  const seen = { alertId: alert.id, state: capacity.state };
  if (previous?.alertId === seen.alertId && previous?.state === seen.state) return { action: "none", state: capacity.state, issue: issue.number };
  const resourceNames = { hour: "hourly submissions", rows: "stored proposal count", storage: "inbox storage" };
  const names = alert.resources.map(r => resourceNames[r]).join(", ");
  const time = new Date(alert.at).toISOString();
  const status = capacity.state === "ok" ? "The inbox currently has capacity again."
    : capacity.state === "full" ? "New submissions are paused by an inbox limit. Existing proposals are preserved."
    : "The inbox is approaching a limit (80% or more used).";
  const number = value => { if (!Number.isSafeInteger(value) || value < 0) throw new Error("Invalid capacity count"); return value.toLocaleString("en-US"); };
  const body = `@${assignee} — ${status}\n\n`
    + `Last alert: **${alert.level === "full" ? "limit reached" : "80% warning"}** for ${names} at ${time}.\n\n`
    + `- Attempts this hour: ${number(capacity.hour.used)} / ${number(capacity.hour.limit)}\n`
    + `- Stored proposals: ${number(capacity.rows.used)} / ${number(capacity.rows.limit)}\n`
    + `- Inbox storage: ${number(capacity.storage.usedBytes)} / ${number(capacity.storage.limitBytes)} bytes\n\n`
    + `Open the [private project inbox](https://api.qiqc-op.com/inbox/) to review. Hourly limits reset automatically. For persistent capacity limits, ask the server maintainer to archive old entries or increase the configured limit. Marking a proposal spam does not free storage.\n\n`
    + `This notice contains aggregate capacity only, with no proposal text or contact details.\n\n${MARKER}${JSON.stringify(seen)} -->`;
  if (!issue) {
    issue = await github("/issues", "POST", { title: TITLE, body, assignees: [assignee] });
    if (capacity.state === "ok") await github(`/issues/${issue.number}`, "PATCH", { state: "closed", state_reason: "completed" });
    return { action: "created", state: capacity.state, issue: issue.number };
  }
  if (previous?.alertId !== alert.id) {
    const commentMarker = `<!-- qop-inbox-capacity-alert:${alert.id} -->`;
    // Check the last comment page for a retry after a successful comment but failed issue update.
    const comments = await github(`/issues/${issue.number}/comments?per_page=100&page=${Math.max(1, Math.ceil((issue.comments || 0) / 100))}`);
    if (!comments.some(comment => comment.user?.login === "github-actions[bot]" && String(comment.body).includes(commentMarker))) {
      await github(`/issues/${issue.number}/comments`, "POST", { body: `@${assignee} — ${alert.level === "full" ? "Inbox limit reached" : "Inbox capacity warning"}: ${names}, ${time}. ${status}\n\n${commentMarker}` });
    }
  }
  await github(`/issues/${issue.number}`, "PATCH", { title: TITLE, body, state: capacity.state === "ok" ? "closed" : "open", ...(capacity.state === "ok" ? { state_reason: "completed" } : {}) });
  return { action: "updated", state: capacity.state, issue: issue.number };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await checkInboxCapacity({ monitorKey: process.env.QOP_INBOX_MONITOR_KEY, githubToken: process.env.GITHUB_TOKEN, repository: process.env.GITHUB_REPOSITORY, assignee: process.env.QOP_INBOX_ALERT_ASSIGNEE || undefined });
    console.log(JSON.stringify(result));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
