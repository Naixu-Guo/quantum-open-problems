/**
 * Who is using the page. The service answers `/auth/session` from the session cookie; the
 * actor list gives names for the ids that records carry.
 */
import { get, post, cached, forget } from "./api.js";

const nobody = { authenticated: false, actor: null, login: null, via: null };
let current = nobody;

export async function loadSession() {
  try { current = await get("/auth/session"); } catch { current = nobody; }
  return current;
}

export const session = () => current;
export const actor = () => current.actor;
export const signedIn = () => Boolean(current.authenticated && current.actor);
export const hasRole = (role) => Boolean(current.actor?.roles?.includes(role));

export function loginUrl(returnTo = location.pathname + location.search + location.hash) {
  return `/auth/login?return_to=${encodeURIComponent(returnTo)}`;
}

/** Ends the session on the service; throws when the service refused, so the caller does not claim success. */
export async function logout() {
  await post("/auth/logout", {});
  current = nobody;
  forget();
}

/** Actor summaries by id, for showing who wrote a record. */
export async function actorsById() {
  const list = await cached("/api/v1/actors");
  return new Map(list.actors.map((entry) => [entry.id, entry]));
}
