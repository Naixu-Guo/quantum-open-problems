/** The two base shapes from DESIGN.md section 3.2. */
export interface ImmutableBase {
  id: string;
  type: string;
  schemaVersion: "1.0";
  createdBy: string;
  createdAt: string;
  supersedes: string | null;
  body: string;
}

export interface RevisableBase {
  id: string;
  type: string;
  schemaVersion: "1.0";
  revision: number;
  createdBy: string;
  createdAt: string;
  body: string;
}
