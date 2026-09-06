/**
 * The directory: every indexed problem, filtered in the page. Filters live in the URL so a
 * filtered view can be shared. Search goes to the service, which matches keywords and bodies;
 * everything else is filtered here. Problems outside the index (candidates, auxiliaries not yet
 * promoted) are hidden unless asked for.
 */
import { html, mount, $, $$ } from "../lib/dom.js";
import { get } from "../lib/api.js";
import { taxonomy, problemRow } from "./shared.js";
import { typeset } from "../lib/math.js";

const STATUSES = ["Unsolved", "Solved"];
const SORTS = [["title", "Title"], ["activity", "Recently active"], ["stale", "Longest without human review"]];
const PAGE = 1000;

function readFilters(url) {
  const p = url.searchParams;
  return { q: p.get("q") ?? "", status: p.get("status") ?? "", area: p.get("area") ?? "", topic: p.get("topic") ?? "", difficulty: p.get("difficulty") ?? "", candidates: p.get("candidates") === "1", sort: p.get("sort") ?? "title", state: p.get("state") ?? "" };
}

function writeFilters(filters) {
  const p = new URLSearchParams();
  if (filters.q) p.set("q", filters.q);
  if (filters.status) p.set("status", filters.status);
  if (filters.area) p.set("area", filters.area);
  if (filters.topic) p.set("topic", filters.topic);
  if (filters.difficulty) p.set("difficulty", filters.difficulty);
  if (filters.candidates) p.set("candidates", "1");
  if (filters.state) p.set("state", filters.state);
  if (filters.sort && filters.sort !== "title") p.set("sort", filters.sort);
  const query = p.toString();
  history.replaceState({}, "", `/problems${query ? `?${query}` : ""}`);
}

function matches(problem, filters) {
  if (!filters.candidates && !problem.indexed) return false;
  if (filters.state === "candidate" && problem.catalogState !== "candidate") return false;
  if (filters.status && problem.status !== filters.status) return false;
  if (filters.area && !problem.areaIds.includes(filters.area)) return false;
  if (filters.topic && !problem.topicIds.includes(filters.topic)) return false;
  if (filters.difficulty && problem.difficulty !== filters.difficulty) return false;
  return true;
}

function sortBy(problems, sort) {
  const list = [...problems];
  if (sort === "activity") return list.sort((a, b) => String(b.lastActivity ?? "").localeCompare(String(a.lastActivity ?? "")));
  if (sort === "stale") return list.sort((a, b) => String(a.lastHumanReview ?? "").localeCompare(String(b.lastHumanReview ?? "")));
  return list.sort((a, b) => a.title.localeCompare(b.title));
}

export async function view({ main, url, setTitle, alive }) {
  setTitle("Problems");
  const filters = readFilters(url);
  if (filters.state === "candidate") filters.candidates = true;
  const query = `limit=${PAGE}&includeCandidates=true${filters.q ? `&text=${encodeURIComponent(filters.q)}` : ""}`;
  const [list, tax] = await Promise.all([get(`/api/v1/problems?${query}`), taxonomy()]);
  if (!alive()) return;
  const pressed = (value) => String(filters.status === value);

  mount(main, html`
    <div class="directory">
      <aside class="filters" aria-label="Filters">
        <fieldset><legend>Status</legend><div class="choice" id="status-choice">
          <button type="button" data-status="" aria-pressed="${pressed("")}">All</button>
          ${STATUSES.map((s) => html`<button type="button" data-status="${s}" aria-pressed="${pressed(s)}">${s}</button>`)}
        </div></fieldset>
        <fieldset><legend>Area</legend>
          <select name="area" id="area"><option value="">Any area</option>${tax.areas.map((a) => html`<option value="${a.id}" ${filters.area === a.id ? "selected" : ""}>${a.label}</option>`)}</select>
        </fieldset>
        <fieldset><legend>Topic</legend>
          <select name="topic" id="topic"><option value="">Any topic</option>${tax.topics.filter((t) => tax.independentTopics === true || !filters.area || t.areaId === filters.area).map((t) => html`<option value="${t.id}" ${filters.topic === t.id ? "selected" : ""}>${t.label}</option>`)}</select>
        </fieldset>
        <fieldset><legend>Difficulty</legend>
          <select name="difficulty" id="difficulty"><option value="">Any</option>${["accessible", "hard", "very-hard", "unrated"].map((d) => html`<option value="${d}" ${filters.difficulty === d ? "selected" : ""}>${d.replace("-", " ")}</option>`)}</select>
        </fieldset>
        <fieldset><legend>Sort</legend>
          <select name="sort" id="sort">${SORTS.map(([value, text]) => html`<option value="${value}" ${filters.sort === value ? "selected" : ""}>${text}</option>`)}</select>
        </fieldset>
        <fieldset><label class="check"><input type="checkbox" id="candidates" ${filters.candidates ? "checked" : ""}> Include candidates and unpromoted auxiliaries</label></fieldset>
      </aside>
      <section>
        <p class="result-count" id="count"></p>
        <ul class="list" id="results"></ul>
      </section>
    </div>
  `);

  const apply = async () => {
    if (!alive()) return;
    const shown = sortBy(list.problems.filter((p) => matches(p, filters)), filters.sort);
    const scope = filters.q ? `matching “${filters.q}”` : "";
    $("#count", main).textContent = `${shown.length} of ${list.problems.length} problems ${scope}${list.problems.length >= PAGE ? " (first page only)" : ""}`.trim();
    mount($("#results", main), shown.length ? shown.map((p) => problemRow(p, tax)) : html`<li><p class="muted" style="padding:16px 0">Nothing matches. <a href="/problems">Clear the filters</a> or <a href="/propose">propose a problem</a>.</p></li>`);
    writeFilters(filters);
    await typeset($("#results", main));
  };

  $("#status-choice", main).addEventListener("click", (event) => {
    const button = event.target.closest("button[data-status]");
    if (!button) return;
    filters.status = button.dataset.status;
    for (const b of $$("button[data-status]", main)) b.setAttribute("aria-pressed", String(b === button));
    apply();
  });
  $("#area", main).addEventListener("change", (event) => {
    filters.area = event.target.value;
    filters.topic = "";
    mount($("#topic", main), html`<option value="">Any topic</option>${tax.topics.filter((t) => tax.independentTopics === true || !filters.area || t.areaId === filters.area).map((t) => html`<option value="${t.id}">${t.label}</option>`)}`);
    apply();
  });
  $("#topic", main).addEventListener("change", (event) => { filters.topic = event.target.value; apply(); });
  $("#difficulty", main).addEventListener("change", (event) => { filters.difficulty = event.target.value; apply(); });
  $("#sort", main).addEventListener("change", (event) => { filters.sort = event.target.value; apply(); });
  $("#candidates", main).addEventListener("change", (event) => { filters.candidates = event.target.checked; if (!filters.candidates) filters.state = ""; apply(); });
  await apply();
}
