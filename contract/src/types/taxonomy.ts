import type { RevisableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, type Ref } from "../targets.ts";

export const TYPE = "Taxonomy" as const;

export interface Area {
  id: string;
  label: string;
  description: string;
}

export interface Topic {
  id: string;
  label: string;
  areaId: string;
}

/** The single registry of research areas and topics that problems may name. Revisable; one per ledger. */
export interface Taxonomy extends RevisableBase {
  type: typeof TYPE;
  areas: Area[];
  topics: Topic[];
}

export function references(taxonomy: Taxonomy): Ref[] {
  return ref("createdBy", "Actor", taxonomy.createdBy);
}

export function rules(taxonomy: Taxonomy, _ledger: Ledger): string[] {
  const errors: string[] = [];
  const areaIds = new Set<string>();
  for (const area of taxonomy.areas) {
    if (areaIds.has(area.id)) errors.push(`duplicate area ${area.id}`);
    areaIds.add(area.id);
  }
  const topicIds = new Set<string>();
  for (const topic of taxonomy.topics) {
    if (topicIds.has(topic.id)) errors.push(`duplicate topic ${topic.id}`);
    topicIds.add(topic.id);
    if (!areaIds.has(topic.areaId)) errors.push(`topic ${topic.id} names unknown area ${topic.areaId}`);
  }
  return errors;
}
