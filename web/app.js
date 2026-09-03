import { loadSession } from "./lib/session.js";
import { renderTopbar } from "./views/topbar.js";
import { start } from "./router.js";
import { toast } from "./lib/dom.js";

// A failure nobody caught still gets a message on screen instead of a silent blank page.
window.addEventListener("error", (event) => toast(`Something broke: ${event.message}`, "error"));
window.addEventListener("unhandledrejection", (event) => toast(`Something broke: ${event.reason?.message ?? event.reason}`, "error"));

await loadSession();
renderTopbar();
start();
