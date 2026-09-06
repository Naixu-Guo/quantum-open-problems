# Ledger

This ledger is generated from the authoritative records in `database/problems_json` by `scripts/export-ledger.mjs`. Each Problem retains the full source JSON in `authoredCatalog.record`, including extra keys and the original TeX. The catalog has exactly two authored statuses: Solved and Unsolved. Publication reflects the existing authored catalog; it does not assert a review or a verification result.

Problem ULIDs, original `op_` IDs, and existing aliases remain usable. The first alias is the stable folder slug. Fields and topics retain independent membership. Bibliographic metadata is partial; full bibliography text is preserved. No scientific reviews, decisions, claims, or trajectories are generated.

Run `npm run export-ledger` after changing JSON records, and `npm run check-ledger` to check for drift. Normal exports preserve records not owned by the export manifest and validate the combined ledger before writing. `--replace-authoritative` explicitly replaces the ledger and activity roots; use it only when intentionally resetting those derived databases.
