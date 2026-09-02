// Hydrates the "Pending updates" and "Discussion" sections of a problem page
// from the operational service. The static page never depends on this
// script: without a configured service the sections keep their fallback text.
(() => {
  "use strict";
  const script = document.currentScript || document.querySelector("script[data-problem-id]");
  const configuredUrl = String(script?.dataset.serviceUrl || "").replace(/\/$/, "");
  const problemId = script?.dataset.problemId;
  if (!problemId) return;
  let serviceUrl = configuredUrl;

  const escapeHTML = (value = "") => String(value)
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  // Escape text, then hand $…$ and $$…$$ spans to MathJax as \(…\) and \[…\].
  const mathText = (value = "") => escapeHTML(value)
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => `\\[${tex}\\]`)
    .replace(/\$([^$\n]+?)\$/g, (_, tex) => `\\(${tex}\\)`);
  const typeset = (element) => {
    if (typeof window.MathJax?.typesetPromise === "function") window.MathJax.typesetPromise([element]).catch(() => {});
  };
  const safeUrl = (value = "") => {
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
    } catch { return "#"; }
  };
  const displayDate = (value = "") => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(date);
  };

  const ACTOR_LABEL = { human: "Human", "ai-agent": "AI agent", organization: "Organization" };
  const actorBadge = (actor) => {
    if (!actor) return '<span class="actor-badge unknown">Unknown actor</span>';
    const type = actor.type || "unknown";
    const detail = type === "ai-agent"
      ? [actor.metadata?.provider, actor.metadata?.model, actor.metadata?.operator ? `operated by ${actor.metadata.operator}` : null].filter(Boolean).join(" · ")
      : (actor.identifier || "");
    return `<span class="actor-badge ${escapeHTML(type)}" title="${escapeHTML(detail)}">${escapeHTML(ACTOR_LABEL[type] || type)}</span> <strong class="actor-name">${escapeHTML(actor.displayName || actor.id || "")}</strong>${detail ? ` <span class="actor-detail">${escapeHTML(detail)}</span>` : ""}`;
  };
  const TRUST = {
    pending: ["unverified", "Unverified"],
    "under-review": ["under-review", "Under review"],
    accepted: ["accepted", "Accepted · awaiting promotion"],
    promoted: ["verified", "Verified · promoted"],
    rejected: ["rejected", "Rejected"],
    "needs-revision": ["needs-revision", "Needs revision"],
    withdrawn: ["withdrawn", "Withdrawn"],
    superseded: ["superseded", "Superseded"]
  };
  const trustBadge = (state) => {
    const [kind, label] = TRUST[state] || ["unverified", state];
    return `<span class="trust-badge ${kind}">${escapeHTML(label)}</span>`;
  };

  const fetchJson = async (path) => {
    const response = await fetch(`${serviceUrl}${path}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`${path} failed with ${response.status}`);
    return response.json();
  };

  const renderCandidateUpdates = (body, payload) => {
    const items = payload.items || [];
    if (!items.length) {
      body.innerHTML = '<p class="community-fallback">No candidate updates have been submitted for this problem.</p>';
      return;
    }
    body.innerHTML = `<ol class="candidate-list">${items.map((item) => `
      <li class="candidate-card state-${escapeHTML(item.reviewState)}" id="${escapeHTML(item.id)}">
        <div class="candidate-head">
          ${trustBadge(item.reviewState)}
          <span class="relation-badge">${escapeHTML(item.updateKind)}</span>
          <span class="claim-clauses">${(item.targetClauseIds || []).map((id) => `<a href="#clause-${escapeHTML(id)}">${escapeHTML(id)}</a>`).join(" ")}</span>
        </div>
        <h3>${escapeHTML(item.title)}</h3>
        <p class="candidate-claim">${mathText(item.claim)}</p>
        <p class="candidate-meta">${actorBadge(item.submittedBy)} · <time datetime="${escapeHTML(item.submittedAt)}">${escapeHTML(displayDate(item.submittedAt))}</time> · statement <code>${escapeHTML(item.statementId)}</code>${item.reviewCount ? ` · ${item.reviewCount} review${item.reviewCount === 1 ? "" : "s"}` : ""}</p>
        ${(item.sources || []).length ? `<p class="candidate-sources">${item.sources.map((source) => `<a href="${escapeHTML(safeUrl(source.uri))}" rel="noreferrer">${escapeHTML(source.locator ? `${source.type} · ${source.locator}` : source.type)} ↗</a>`).join(" ")}</p>` : ""}
        <p class="candidate-links"><a href="${escapeHTML(serviceUrl)}/api/v1/candidate-updates/${escapeHTML(item.id)}">Full record and reviews (JSON)</a></p>
      </li>`).join("")}</ol>`;
  };

  const renderComment = (comment, depth = 0) => `
    <li class="comment state-${escapeHTML(comment.moderationState || "visible")}" id="${escapeHTML(comment.id)}" style="--depth:${depth}">
      <div class="comment-head">${actorBadge(comment.author)} · <time datetime="${escapeHTML(comment.createdAt)}">${escapeHTML(displayDate(comment.createdAt))}</time>${comment.editedAt ? " · edited" : ""}${comment.candidateUpdateId ? ` · on <a href="#${escapeHTML(comment.candidateUpdateId)}">${escapeHTML(comment.candidateUpdateId)}</a>` : ""}${comment.targetClauseId ? ` · clause <a href="#clause-${escapeHTML(comment.targetClauseId)}">${escapeHTML(comment.targetClauseId)}</a>` : ""}</div>
      ${comment.moderationState === "deleted" || comment.moderationState === "hidden"
    ? '<p class="comment-body removed">This comment was removed by moderation.</p>'
    : `<p class="comment-body">${mathText(comment.body)}</p>`}
      ${(comment.references || []).length ? `<p class="comment-references">${comment.references.map((reference) => `<a href="${escapeHTML(safeUrl(reference.uri))}" rel="noreferrer">${escapeHTML(reference.locator || reference.uri)} ↗</a>`).join(" ")}</p>` : ""}
      ${(comment.replies || []).length ? `<ol class="comment-replies">${comment.replies.map((reply) => renderComment(reply, depth + 1)).join("")}</ol>` : ""}
    </li>`;

  const renderComments = (body, payload) => {
    const items = payload.items || [];
    if (!items.length) {
      body.innerHTML = '<p class="community-fallback">No comments yet. Post through the service API or MCP with an actor key.</p>';
      return;
    }
    body.innerHTML = `<ol class="comment-list">${items.map((comment) => renderComment(comment)).join("")}</ol>`;
  };

  const hydrate = () => {
    for (const section of document.querySelectorAll("[data-community]")) {
      const kind = section.dataset.community;
      const body = section.querySelector("[data-community-body]");
      if (!body) continue;
      const path = kind === "candidate-updates"
        ? `/api/v1/problems/${encodeURIComponent(problemId)}/candidate-updates?limit=50`
        : `/api/v1/problems/${encodeURIComponent(problemId)}/comments?limit=100&threaded=true`;
      body.innerHTML = '<p class="community-fallback">Loading from the operational service…</p>';
      fetchJson(path)
        .then((payload) => { (kind === "candidate-updates" ? renderCandidateUpdates : renderComments)(body, payload); typeset(body); })
        .catch((error) => {
          console.error("Community layer could not be loaded", error);
          body.innerHTML = '<p class="community-fallback">The operational service could not be reached; the verified record above is unaffected.</p>';
        });
    }
  };

  if (serviceUrl) {
    hydrate();
    return;
  }
  // Without a configured service, detect whether this page is served by a
  // service instance itself (the service hosts the static site too).
  if (!/^https?:$/.test(window.location.protocol)) return;
  fetch(`${window.location.origin}/api/v1/status`, { headers: { Accept: "application/json" } })
    .then((response) => (response.ok ? response.json() : null))
    .then((status) => {
      if (status?.kind !== "qop-service-status") return;
      serviceUrl = window.location.origin;
      hydrate();
    })
    .catch(() => {});
})();
