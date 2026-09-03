/** One entry per record type: its schema file, outgoing references, and rules. */
import type { Ledger } from "../ledger.ts";
import type { Ref, RecordType } from "../targets.ts";
import * as problem from "./problem.ts";
import * as statement from "./statement.ts";
import * as claim from "./claim.ts";
import * as source from "./source.ts";
import * as reference from "./reference.ts";
import * as actor from "./actor.ts";
import * as trajectory from "./trajectory.ts";
import * as contribution from "./contribution.ts";
import * as artifact from "./artifact.ts";
import * as review from "./review.ts";
import * as comment from "./comment.ts";
import * as decision from "./decision.ts";

export interface TypeModule {
  schemaFile: string;
  references: (record: never) => Ref[];
  rules: (record: never, ledger: Ledger) => string[];
}

export const TYPE_MODULES: Readonly<Record<RecordType, TypeModule>> = {
  Problem: { schemaFile: "problem.schema.json", references: problem.references, rules: problem.rules },
  Statement: { schemaFile: "statement.schema.json", references: statement.references, rules: statement.rules },
  Claim: { schemaFile: "claim.schema.json", references: claim.references, rules: claim.rules },
  Source: { schemaFile: "source.schema.json", references: source.references, rules: source.rules },
  Reference: { schemaFile: "reference.schema.json", references: reference.references, rules: reference.rules },
  Actor: { schemaFile: "actor.schema.json", references: actor.references, rules: actor.rules },
  Trajectory: { schemaFile: "trajectory.schema.json", references: trajectory.references, rules: trajectory.rules },
  Contribution: { schemaFile: "contribution.schema.json", references: contribution.references, rules: contribution.rules },
  Artifact: { schemaFile: "artifact.schema.json", references: artifact.references, rules: artifact.rules },
  Review: { schemaFile: "review.schema.json", references: review.references, rules: review.rules },
  Comment: { schemaFile: "comment.schema.json", references: comment.references, rules: comment.rules },
  Decision: { schemaFile: "decision.schema.json", references: decision.references, rules: decision.rules },
};
