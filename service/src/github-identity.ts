/** Durable numeric GitHub identities, shared by login and operator commands. */
import type { Service } from "./write.ts";
import { reindex } from "./write.ts";
import { nowIso } from "./ids.ts";

export function githubActor(service: Service, subject: string, login?: string) {
  if (!/^[1-9][0-9]*$/.test(subject)) throw new Error("Provide a numeric GitHub user ID.");
  const actors = service.repo.current().currentOf("Actor");
  const linked = service.auth.actorForIdentity("github", subject);
  const matches = actors.filter((actor) => actor.fields["externalIdentity"] === `github-id:${subject}`);
  if (matches.length > 1 || (linked && matches.some((actor) => actor.id !== linked))) throw new Error("Conflicting GitHub identities; repair the operator identity links first.");
  const actor = linked ? actors.find((actor) => actor.id === linked) : matches[0];
  if (linked && !actor) throw new Error("The GitHub identity points at a missing actor; repair that link first.");
  if (actor && actor.fields["kind"] !== "human") throw new Error("A GitHub identity must belong to a human actor.");
  if (!actor && login && actors.some((actor) => String(actor.fields["externalIdentity"]).toLowerCase() === `github:${login.toLowerCase()}`)) {
    throw new Error("A legacy GitHub actor has this login but no verified numeric link. Use identity link github <numeric-id> <actor-id> after verifying ownership; a login name cannot safely recover an identity.");
  }
  return actor;
}

/** Persist an explicitly verified link before updating the disposable auth store. */
export function linkGitHubIdentity(service: Service, subject: string, actorId: string, login = ""): void {
  if (!/^[1-9][0-9]*$/.test(subject)) throw new Error("Provide a numeric GitHub user ID.");
  const ledger = service.repo.current();
  const actor = ledger.find("Actor", actorId);
  if (!actor || actor.fields["kind"] !== "human") throw new Error("A GitHub identity must belong to an existing human actor.");
  const identity = `github-id:${subject}`;
  if (ledger.currentOf("Actor").some((other) => other.id !== actorId && other.fields["externalIdentity"] === identity)) throw new Error("The numeric GitHub identity already belongs to another actor.");
  const current = String(actor.fields["externalIdentity"] ?? "");
  if (current.startsWith("github-id:") && current !== identity) throw new Error("This actor already has a different numeric GitHub identity.");
  const linked = service.auth.actorForIdentity("github", subject);
  if (linked && linked !== actorId) throw new Error("The auth store links this GitHub identity to another actor.");
  if (current !== identity) {
    const result = service.repo.write([{ fields: { ...actor.fields, revision: Number(actor.fields["revision"]) + 1,
      createdBy: service.systemActorId, createdAt: nowIso(), externalIdentity: identity }, body: actor.body }],
    `Persist numeric GitHub identity for actor ${actorId}`, { name: "quantum-open-problems-operator", email: "operator@quantum-open-problems.invalid" });
    if (!result.ok) throw new Error(result.issues.map((issue) => issue.message).join("; "));
    reindex(service);
  }
  service.auth.linkIdentity("github", subject, actorId, login);
}
