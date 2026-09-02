# AI research brief: Additivity of Entanglement of Formation

- Record ID: krueger-2005-additivity-entanglement-formation
- Record revision (SHA-256): f9bfeafcbc7c336929cdfbef889bd54eee643568e2edf3588e538369ae60a98c
- Formal statement digest (SHA-256): 071a97760e86096f0fcb4640ce9746ed20ece65c40741bc1083f08d5ea416c04
- Status: Solved
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-additivity-entanglement-formation/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-additivity-entanglement-formation.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Additivity+of+Entanglement+of+Formation

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 28-29 (Problem 7)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Any operationally meaningful resource measure should cost exactly the sum on independently prepared copies, and the easy inequality is one-directional, so the status of equality was the non-trivial part and was tied by Shor to the additivity conjectures for minimum output entropy and Holevo capacity.

## Notation

| Symbol | Meaning |
|---|---|
| $\rho$ | A density operator on a bipartite Hilbert space $\mathcal{H}_A \otimes \mathcal{H}_B$ |
| $\rho_i$ | Pure-state (or general) constituents in a convex decomposition of $\rho$ |
| $r_i$ | Non-negative weights summing to $1$ in a convex decomposition |
| $\rho\vert A$ | Restriction of $\rho$ to Alice's subsystem (partial trace over Bob) |
| $S(\sigma)$ | Von Neumann entropy $-\mathrm{tr}(\sigma \log \sigma)$ |
| $E_F(\rho)$ | Entanglement of formation, $\inf\bigl\{\sum_i r_i S(\rho_i\vert A) \mid \sum_i r_i \rho_i = \rho\bigr\}$ |
| $\rho^{(1)}, \rho^{(2)}$ | Two bipartite density operators on possibly different Hilbert spaces |
| $\rho^{(1)} \otimes \rho^{(2)}$ | Their tensor product, regarded as a bipartite state on the combined Alice and Bob spaces |
| $\Phi$ | A quantum channel (completely positive trace preserving map) |
| $S_{\min}(\Phi)$ | Minimal output entropy of $\Phi$, $\inf_\rho S(\Phi(\rho))$ |
| $\chi^*(\Phi)$ | Holevo capacity of $\Phi$ |
| LOCC | Local operations and classical communication |

## Formal statement

Show that for any pair of bipartite density operators $\rho^{(1)}$ and $\rho^{(2)}$ (defined on possibly different bipartite Hilbert spaces) one has

$$E_F\bigl(\rho^{(1)} \otimes \rho^{(2)}\bigr) \;=\; E_F\!\bigl(\rho^{(1)}\bigr) + E_F\!\bigl(\rho^{(2)}\bigr).$$

The inequality $E_F(\rho^{(1)} \otimes \rho^{(2)}) \le E_F(\rho^{(1)}) + E_F(\rho^{(2)})$ is elementary (by tensoring the optimal pure-state decompositions); the open problem asks whether equality always holds.

The source records this problem as *equivalent to Problem 10* of the same collection.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2009: Hastings counterexample refutes additivity of entanglement of formation

- Evidence: Peer reviewed; Exact counterexample
- Finding: Shor proved that additivity of the minimum output entropy, additivity of the Holevo capacity, additivity of the entanglement of formation and strong superadditivity of the entanglement of formation are all equivalent. Hastings then constructed channels violating additivity of the minimum output entropy, so by Shor's equivalences there exist bipartite states with E_F(rho1 tensor rho2) strictly less than E_F(rho1) + E_F(rho2) and the archived conjecture is false.
- Source: https://arxiv.org/abs/0809.3972

### 2004: Hastings counterexample refutes additivity of entanglement of formation

- Evidence: Peer reviewed; Exact theorem
- Finding: Shor proved that additivity of the minimum output entropy, additivity of the Holevo capacity, additivity of the entanglement of formation and strong superadditivity of the entanglement of formation are all equivalent. Hastings then constructed channels violating additivity of the minimum output entropy, so by Shor's equivalences there exist bipartite states with E_F(rho1 tensor rho2) strictly less than E_F(rho1) + E_F(rho2) and the archived conjecture is false.
- Source: https://arxiv.org/abs/quant-ph/0305035

## Scope and cautions

- Scope: Additivity remains valid for restricted families such as the Vidal-Dur-Cirac state families, Werner and isotropic states, and products with a separable factor; the counterexamples are not low-dimensional.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
