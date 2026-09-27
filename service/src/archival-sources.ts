/** Source identity checks for intake, not an assessment of a manuscript's claims. */
import { normalizeArchivalLink } from "../../shared/progress-sources.mjs";
import { HttpError } from "./errors.ts";

export function parseArchivalLinks(raw: unknown, required: boolean): string[] {
  if (raw === undefined && !required) return [];
  if (Array.isArray(raw) && raw.length === 0 && !required) return [];
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 10) throw new HttpError(422, "archivalLinks must contain between one and ten archival manuscript or paper links");
  const links: string[] = [];
  for (const value of raw) {
    if (typeof value !== "string" || value.length > 2048) throw new HttpError(422, "each archival link must be a URL or identifier of at most 2048 characters");
    try { links.push(normalizeArchivalLink(value).url); }
    catch (error) { throw new HttpError(422, error instanceof Error ? error.message : "supply an eligible archival manuscript or paper link"); }
  }
  return [...new Set(links)];
}

type Metadata = Record<string, any>;
const manuscriptTypes = new Set(["journal-article", "posted-content", "proceedings-article", "report", "dissertation", "monograph", "book", "book-chapter", "journal_article", "journalarticle", "bookchapter", "conferencepaper", "preprint", "article", "thesis", "publication", "text"]);

async function metadata(url: string, fetcher: typeof fetch): Promise<Metadata | null> {
  // URLs are built below from fixed registry origins. Never follow a user URL or registry redirect.
  let response: Response;
  try { response = await fetcher(url, { headers: { Accept: "application/json" }, redirect: "error", signal: AbortSignal.timeout(8_000) }); }
  catch { throw new HttpError(502, "the archival source registry could not be reached; keep your draft and retry"); }
  if (response.status === 404) return null;
  if (!response.ok) throw new HttpError(502, "the archival source registry is temporarily unavailable; keep your draft and retry");
  const reader = response.body?.getReader();
  if (!reader) throw new HttpError(502, "the archival source registry returned no metadata; retry later");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1_048_576) { await reader.cancel(); throw new Error("oversized metadata"); }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid metadata");
    return parsed as Metadata;
  } catch { throw new HttpError(502, "the archival source registry returned unusable metadata; keep your draft and retry"); }
}

/** Reject known code/data-only deposits; registry failure never becomes a successful receipt. */
export async function verifyArchivalDocuments(links: string[], fetcher: typeof fetch = fetch): Promise<void> {
  for (const link of links) {
    const source = normalizeArchivalLink(link);
    const url = new URL(source.url);
    const doi = url.hostname === "doi.org" ? decodeURIComponent(url.pathname.slice(1)) : "";
    const zenodoId = url.hostname === "zenodo.org" ? url.pathname.match(/^\/records?\/(\d+)/u)?.[1] : doi.match(/^10\.5281\/zenodo\.(\d+)$/iu)?.[1];
    if (zenodoId) {
      const record = await metadata(`https://zenodo.org/api/records/${zenodoId}`, fetcher);
      if (!record) throw new HttpError(422, "the Zenodo manuscript record was not found");
      const type = record.metadata?.resource_type;
      if (type?.type !== "publication" || (type.subtype && !manuscriptTypes.has(String(type.subtype).toLowerCase()))) throw new HttpError(422, "a Zenodo source must identify a manuscript or paper; dataset and software deposits alone do not qualify");
    } else if (doi) {
      const crossref = await metadata(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, fetcher);
      if (crossref) {
        if (!manuscriptTypes.has(String(crossref.message?.type).toLowerCase())) throw new HttpError(422, "the DOI must identify a manuscript or paper, not a dataset, software, or other object");
      } else {
        const datacite = await metadata(`https://api.datacite.org/dois/${encodeURIComponent(doi)}`, fetcher);
        if (!datacite) throw new HttpError(422, "the DOI could not be identified as a manuscript or paper; use its supported manuscript or publisher link");
        const types = datacite.data?.attributes?.types;
        const general = String(types?.resourceTypeGeneral ?? "").toLowerCase();
        const specific = String(types?.resourceType ?? "").toLowerCase();
        if (!manuscriptTypes.has(general) || /dataset|software|code|poster|presentation|slides/u.test(specific)) throw new HttpError(422, "the DOI must identify a manuscript or paper, not a dataset, software, or other object");
      }
    }
  }
}
