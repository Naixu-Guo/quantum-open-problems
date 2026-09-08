/** Operator-only first-editor provisioning. Never exposed by the HTTP API. */
import type { Service } from "./write.ts";
import { reindex } from "./write.ts";
import { newId, nowIso } from "./ids.ts";
import { githubActor, linkGitHubIdentity } from "./github-identity.ts";

export function bootstrapEditor(service: Service, githubId: string, name: string): string {
  if (!/^[1-9][0-9]*$/.test(githubId) || !name.trim()) throw new Error("Provide a numeric GitHub user ID and the person's name.");
  service.repo.refreshIfMoved();
  const actors = service.repo.current().currentOf("Actor");
  // Recover after a previous run committed the actor but could not update the
  // local auth store. Numeric IDs survive GitHub username changes.
  const actor = githubActor(service, githubId);
  if (actor && actor.fields["kind"] !== "human") throw new Error("An editor must be a human; this identity belongs to a non-human actor.");
  const editors = actors.filter((item) => item.fields["kind"] === "human" && (item.fields["roles"] as string[]).includes("editor"));
  if (editors.length && !editors.some((item) => item.id === actor?.id)) throw new Error("A human editor already exists. Further role grants use the editor workflow.");
  const id = actor?.id ?? newId();
  if (!editors.some((item) => item.id === id)) {
    const fields = actor ? { ...actor.fields, revision: Number(actor.fields["revision"]) + 1, createdBy: service.systemActorId, createdAt: nowIso(), roles: [...new Set([...(actor.fields["roles"] as string[]), "editor"])], externalIdentity: `github-id:${githubId}` } : {
      id, type: "Actor", schemaVersion: "1.0", revision: 1, createdBy: service.systemActorId, createdAt: nowIso(),
      name: name.trim(), kind: "human", roles: ["contributor", "editor"], externalIdentity: `github-id:${githubId}`,
      operatorId: null, modelFamily: null, modelVersion: null, harness: null,
    };
    const result = service.repo.write([{ fields, body: `${actor?.body ? `${actor.body}\n\n` : ""}First editor provisioned by the operator using bootstrap-editor for GitHub user ID ${githubId}.` }], `Provision first editor for GitHub user ${githubId}`, { name: "quantum-open-problems-operator", email: "operator@quantum-open-problems.invalid" });
    if (!result.ok) throw new Error(result.issues.map((issue) => issue.message).join("; "));
    reindex(service);
  }
  linkGitHubIdentity(service, githubId, id);
  return id;
}
