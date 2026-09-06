/**
 * Policy files: a YAML header of thresholds and constants, then Markdown definitions.
 * The header is the only part code reads; the body is for people.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseRecordText } from "./record.ts";

export const DEFAULT_POLICY_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "policy");

export interface ReviewThreshold {
  independentAiReviews?: number;
  orHumanReviews?: number;
  orMachineCheck?: boolean;
  anyReviews?: number;
  humanDecision?: boolean;
  plusOneOf?: string[];
}

export interface Policy {
  policyVersion: string;
  thresholds: Record<string, ReviewThreshold>;
  independence: { differentOperator: boolean; differentModelFamily: boolean; noSharedReads: boolean };
  mechanicalMethods: string[];
  rateLimits: Record<string, number>;
  bodyLimits: Record<string, number>;
  retention: Record<string, number>;
  licenses: { textDefault: string; codeDefault: string };
  maintenanceIntervalDays: number;
  body: string;
}

export function loadPolicy(version: string, policyDir: string = DEFAULT_POLICY_DIR): Policy {
  const file = path.join(policyDir, `v${version}.md`);
  if (!fs.existsSync(file)) throw new Error(`policy version ${version} is not published (${file})`);
  const parsed = parseRecordText(file, fs.readFileSync(file, "utf8"));
  const header = parsed.fields;
  if (String(header["policyVersion"]) !== version) throw new Error(`${file}: header names policy ${String(header["policyVersion"])}`);
  return {
    policyVersion: version,
    thresholds: (header["thresholds"] as Record<string, ReviewThreshold>) ?? {},
    independence: (header["independence"] as Policy["independence"]) ?? { differentOperator: true, differentModelFamily: true, noSharedReads: true },
    mechanicalMethods: (header["mechanicalMethods"] as string[]) ?? [],
    rateLimits: (header["rateLimits"] as Record<string, number>) ?? {},
    bodyLimits: (header["bodyLimits"] as Record<string, number>) ?? {},
    retention: (header["retention"] as Record<string, number>) ?? {},
    licenses: (header["licenses"] as Policy["licenses"]) ?? { textDefault: "CC-BY-4.0", codeDefault: "MIT" },
    maintenanceIntervalDays: Number(header["maintenanceIntervalDays"] ?? 30),
    body: parsed.body,
  };
}

/** The highest published policy version. */
export function currentPolicyVersion(policyDir: string = DEFAULT_POLICY_DIR): string {
  const versions = fs.readdirSync(policyDir)
    .map((name) => name.match(/^v(\d+)\.md$/u)?.[1])
    .filter((v): v is string => Boolean(v))
    .map(Number)
    .sort((a, b) => a - b);
  const latest = versions[versions.length - 1];
  if (latest === undefined) throw new Error(`no policy files in ${policyDir}`);
  return String(latest);
}
