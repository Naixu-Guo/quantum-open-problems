/** Private documentary reports. Receipt or inbox handling never writes a catalog status. */
import { normalizeHistoricalLink } from "../../shared/progress-sources.mjs";
import { HttpError } from "./errors.ts";
import { parseArchivalLinks } from "./archival-sources.ts";
import { parseSubmission, type ParsedSubmission } from "./submissions.ts";

export const UPDATE_TYPES = ["resolution", "partial", "computation", "correction", "follow-up"] as const;
export interface ResearchUpdate {
  kind: "research" | "historical";
  problemId: string;
  catalogProblemId?: string;
  updateType: typeof UPDATE_TYPES[number];
  archivalLinks: string[];
  historicalUrl: string;
  summary: string;
  citation: string;
  resultLocator: string;
  relatedReportUrl: string;
  /** Every historical request awaits source/version checking; the requester cannot set this. */
  historicalProvenance?: "pending";
}

const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);

export function parseResearchUpdate(raw: unknown, requireCaptcha = true): ParsedSubmission {
  if (!record(raw)) throw new HttpError(422, "the progress report must be a JSON object");
  const clean = (key: string, max: number, required = false): string => {
    if (raw[key] !== undefined && typeof raw[key] !== "string") throw new HttpError(422, `${key} must be text`);
    const text = String(raw[key] ?? "").replace(/\r\n?/gu, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/gu, "").trim();
    if ((required && !text) || text.length > max) throw new HttpError(422, `${key} ${text.length > max ? `must not exceed ${max} characters` : "is required"}`);
    return text;
  };
  const kind = raw["kind"];
  if (kind !== "research" && kind !== "historical") throw new HttpError(422, "kind must be research or historical");
  const problemId = clean("problemId", 200, true);
  const updateType = raw["updateType"] ?? (kind === "historical" ? "follow-up" : undefined);
  if (!(UPDATE_TYPES as readonly unknown[]).includes(updateType)) throw new HttpError(422, `updateType must be one of ${UPDATE_TYPES.join(", ")}`);
  const summary = clean("summary", 1500, true);
  const archivalLinks = parseArchivalLinks(raw["archivalLinks"], kind === "research");
  let historicalUrl = "";
  if (kind === "historical") {
    try { historicalUrl = normalizeHistoricalLink(clean("historicalUrl", 2048, true)); }
    catch (error) { throw new HttpError(422, error instanceof Error ? error.message : "supply the original project GitHub report URL"); }
  } else if (raw["historicalUrl"]) throw new HttpError(422, "use relatedReportUrl to link an earlier report alongside a new manuscript");
  let relatedReportUrl = clean("relatedReportUrl", 2048);
  if (relatedReportUrl) {
    try { relatedReportUrl = normalizeHistoricalLink(relatedReportUrl); }
    catch { throw new HttpError(422, "relatedReportUrl must be an HTTPS link to the earlier report in this project's GitHub repository"); }
  }
  const update: ResearchUpdate = {
    kind, problemId, updateType: updateType as ResearchUpdate["updateType"], archivalLinks, historicalUrl, summary,
    citation: clean("citation", 2000), resultLocator: clean("resultLocator", 500), relatedReportUrl,
    ...(kind === "historical" ? { historicalProvenance: "pending" as const } : {}),
  };
  // Reuse the same contact, consent, CAPTCHA, license, and honeypot validation as proposals.
  const parsed = parseSubmission({
    title: `Progress on ${problemId}`, statement: "A private research progress report.", fields: ["Progress"], topics: ["Progress"],
    contributor: raw["contributor"], consent: raw["consent"], contentLicense: raw["contentLicense"], captchaToken: raw["captchaToken"], extra: raw["extra"],
  }, requireCaptcha);
  return {
    ...parsed,
    payload: { ...parsed.payload, statement: summary, fields: [], topics: [], source: archivalLinks.join("\n") || historicalUrl,
      archivalLinks, researchUpdate: update },
  };
}
