/** The bar on every page: wordmark, navigation, search, theme, and who is signed in. */
import { html, mount, $, toast } from "../lib/dom.js";
import { session, signedIn, loginUrl, logout } from "../lib/session.js";
import { navigate } from "../router.js";

const THEME_KEY = "qop-theme";

function currentTheme() {
  const explicit = document.documentElement.dataset.theme;
  if (explicit) return explicit;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(THEME_KEY, theme); } catch {}
}

export function renderTopbar() {
  const bar = document.getElementById("topbar");
  const me = session();
  const q = new URL(location.href).searchParams.get("q") ?? "";
  mount(bar, html`
    <div class="topbar-inner">
      <a class="wordmark" href="/">Quantum Open Problems</a>
      <nav class="topnav" aria-label="Primary">
        <a href="/problems">Problems</a>
        <a href="/review">Review</a>
        <a href="/propose">Propose</a>
        <a href="/about">About</a>
      </nav>
      <form class="search" role="search" action="/problems">
        <input type="search" name="q" placeholder="Search problems" aria-label="Search problems" value="${q}" autocomplete="off">
      </form>
      <button class="icon-button" id="theme-toggle" type="button" aria-label="Switch theme" title="Switch theme"></button>
      <div class="whoami" id="whoami">
        ${signedIn()
          ? html`<details class="menu">
              <summary><span class="avatar" aria-hidden="true">${(me.actor.name || "?").slice(0, 1).toUpperCase()}</span><span class="menu-name">${me.actor.name}</span></summary>
              <div class="menu-panel">
                <div class="menu-meta">${me.actor.roles.join(", ") || "no roles"}<br><span class="muted">${me.actor.externalIdentity ?? ""}</span></div>
                <button type="button" class="menu-item" id="sign-out">Sign out</button>
              </div>
            </details>`
          : me.login
            ? html`<a class="button" href="${loginUrl()}" data-native>Sign in with GitHub</a>`
            : html`<span class="muted small">Login not configured</span>`}
      </div>
    </div>`);

  const toggle = $("#theme-toggle", bar);
  const paint = () => { toggle.textContent = currentTheme() === "dark" ? "☾" : "☀"; };
  paint();
  toggle.addEventListener("click", () => { setTheme(currentTheme() === "dark" ? "light" : "dark"); paint(); });

  $("form.search", bar).addEventListener("submit", (event) => {
    event.preventDefault();
    const value = $("input", event.currentTarget).value.trim();
    navigate(value ? `/problems?q=${encodeURIComponent(value)}` : "/problems");
  });

  $("#sign-out", bar)?.addEventListener("click", async () => {
    await logout();
    toast("Signed out");
    renderTopbar();
    navigate(location.pathname + location.search, { replace: true });
  });

  highlightCurrent();
}

/** Mark the navigation link of the section we are in. Called by the router after each render. */
export function highlightCurrent() {
  const section = location.pathname.split("/")[1];
  for (const link of document.querySelectorAll(".topnav a")) {
    const own = link.getAttribute("href").split("/")[1];
    if (own === section) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  }
}
