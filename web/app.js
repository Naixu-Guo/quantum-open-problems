import { loadSession } from "./lib/session.js";
import { renderTopbar } from "./views/topbar.js";
import { start } from "./router.js";

await loadSession();
renderTopbar();
start();
