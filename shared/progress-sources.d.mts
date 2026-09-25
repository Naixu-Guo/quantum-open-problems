export type ArchivalSourceType = "arxiv" | "zenodo" | "preprint" | "publication" | "doi";
export interface ArchivalSource { url: string; type: ArchivalSourceType }
export const SOURCE_GUIDANCE: string;
export const SUPPORTED_SOURCE_NAMES: readonly string[];
export function normalizeArchivalLink(value: unknown): ArchivalSource;
export function normalizeHistoricalLink(value: unknown): string;
