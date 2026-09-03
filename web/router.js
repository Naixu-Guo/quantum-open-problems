/**
 * Path-based routing inside one page. The service serves `index.html` for any path that is not
 * a file, an API route, or an auth route, so links stay ordinary anchors: the router intercepts
 * same-origin clicks and renders the matching view into `main`.
 */
import { view as home } from "./views/home.js";
import { view as problems } from "./views/problems.js";
import { view as problem } from "./views/problem.js";
import { view as contribution } from "./views/contribution.js";
import { view as review } from "./views/review.js";
import { view as propose } from "./views/propose.js";
import { view as about } from "./views/about.js";
import { highlightCurrent } from "./views/topbar.js";
import { html, mount } from "./lib/dom.js";
import { ApiError } from "./lib/api.js";
import { resetMath } from "./lib/math.js";

const routes = [
  [/^\/$/, home],
  [/^\/problems\/?$/, problems],
  [/^\/problems\/([^/]+)\/?$/, problem],
  [/^\/contributions\/([^/]+)\/?$/, contribution],
  [/^\/review\/?$/, review],
  [/^\/propose\/?$/, propose],
  [/^\/about\/?$/, about],
];

let generation = 0;

export function setTitle(text) {
  document.title = text ? `${text} · Quantum Open Problems` : "Quantum Open Problems";
}

export function navigate(path, { replace = false } = {}) {
  history[replace ? "replaceState" : "pushState"]({}, "", path);
  return dispatch();
}

/** Re-render the current route, after a write changed what it shows. */
export function refresh() {
  return dispatch({ keepScroll: true });
}

async function dispatch({ keepScroll = false } = {}) {
  const token = ++generation;
  const url = new URL(location.href);
  const main = document.getElementById("main");
  const match = routes.find(([pattern]) => pattern.test(url.pathname));
  document.documentElement.dataset.route = match ? url.pathname.split("/")[1] || "home" : "not-found";
  highlightCurrent();
  resetMath();
  const scrollY = window.scrollY;
  try {
    if (!match) {
      setTitle("Not found");
      mount(main, html`<section class="empty"><h1>Nothing here</h1><p>No page at <code>${url.pathname}</code>. <a href="/problems">Browse the problems</a> instead.</p></section>`);
    } else {
      const params = url.pathname.match(match[0]).slice(1).map(decodeURIComponent);
      await match[1]({ main, params, url });
    }
  } catch (error) {
    if (token !== generation) return;
    renderError(main, error);
  }
  if (token !== generation) return;
  if (keepScroll) window.scrollTo(0, scrollY);
  else if (url.hash) document.getElementById(url.hash.slice(1))?.scrollIntoView();
  else window.scrollTo(0, 0);
}

function renderError(main, error) {
  console.error(error);
  const status = error instanceof ApiError ? error.status : null;
  setTitle(status === 404 ? "Not found" : "Error");
  mount(main, html`<section class="empty">
    <h1>${status === 404 ? "Not found" : "Something went wrong"}</h1>
    <p>${error.message}</p>
    <p><a href="/problems">Browse the problems</a></p>
  </section>`);
}

function isInternalLink(anchor, event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download") || anchor.hasAttribute("data-native")) return false;
  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin) return false;
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/") || /\.[a-z0-9]+$/i.test(url.pathname)) return false;
  return true;
}

export function start() {
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest("a[href]");
    if (!anchor || !isInternalLink(anchor, event)) return;
    event.preventDefault();
    const url = new URL(anchor.href, location.href);
    if (url.pathname === location.pathname && url.search === location.search) {
      if (url.hash) { history.pushState({}, "", url.hash); document.getElementById(url.hash.slice(1))?.scrollIntoView(); }
      else window.scrollTo({ top: 0 });
      return;
    }
    navigate(url.pathname + url.search + url.hash);
  });
  window.addEventListener("popstate", () => dispatch());
  dispatch();
}
