import type { RevisableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, type Ref } from "../targets.ts";

export const TYPE = "Source" as const;

export interface Source extends RevisableBase {
  type: typeof TYPE;
  title: string;
  kind: "paper" | "preprint" | "book" | "problem-list" | "dataset" | "thesis" | "web-record";
  authors: string[];
  venue: string;
  date: string | null;
  doi: string | null;
  arxivId: string | null;
  url: string | null;
  version: string | null;
}

export function references(source: Source): Ref[] {
  return ref("createdBy", "Actor", source.createdBy);
}

/** The key a source is unique by: DOI, else arXiv id and version, else normalized URL, else title, first author, and date. */
export function uniquenessKey(source: Source): string {
  if (source.doi) return `doi:${source.doi.toLowerCase()}`;
  if (source.arxivId) return `arxiv:${source.arxivId.toLowerCase()}${source.version ? `v${source.version}` : ""}`;
  if (source.url) return `url:${source.url.replace(/\/+$/u, "").toLowerCase()}`;
  const author = (source.authors[0] ?? "").toLowerCase().replace(/[^a-z]/gu, "");
  return `text:${source.title.toLowerCase().replace(/[^a-z0-9]/gu, "")}|${author}|${source.date ?? ""}`;
}

export function rules(source: Source, _ledger: Ledger): string[] {
  const errors: string[] = [];
  if (source.doi && !/^10\.\d{4,}\//u.test(source.doi)) errors.push(`doi ${source.doi} is not a bare DOI`);
  return errors;
}
