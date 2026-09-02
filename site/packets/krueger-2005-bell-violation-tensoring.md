# AI research brief: Bell violation by tensoring

- Record ID: krueger-2005-bell-violation-tensoring
- Record revision (SHA-256): 99af25264c4c5f839576b4bb93b865b01b32df94f798e06b8904f1a60401ff58
- Formal statement digest (SHA-256): e6e5c85ead377415ab0a5d1cfcd998d715c4b02c50dfec64a579231234dcd6a3
- Status: Solved
- Field: Quantum information
- Topic: Bell nonlocality
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-bell-violation-tensoring/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-bell-violation-tensoring.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Bell+violation+by+tensoring

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 57 (Problem 21)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Bell nonlocality can be activated by tensoring even though entanglement itself is preserved under tensor products, so this is the cleanest CHSH form of an activation pattern shared by nonlocality, distillation and steering.

## Notation

| Symbol | Meaning |
|---|---|
| $\rho_1,\rho_2$ | Bipartite density operators on $\mathcal{H}_A\otimes\mathcal{H}_B$ and $\mathcal{H}_{A'}\otimes\mathcal{H}_{B'}$ respectively |
| $\rho_1\otimes\rho_2$ | The bipartite state on $(\mathcal{H}_A\otimes\mathcal{H}_{A'})\otimes(\mathcal{H}_B\otimes\mathcal{H}_{B'})$ with Alice holding $A,A'$ and Bob holding $B,B'$ |
| CHSH | Clauser–Horne–Shimony–Holt Bell inequality, the canonical two-input two-output bipartite Bell inequality |
| "$\rho$ violates CHSH" | There exist binary local measurements on $\rho$ producing correlations that violate some CHSH inequality, i.e. $\rho$ is CHSH-non-local |
| "$\rho$ satisfies all CHSH" | $\rho$ admits a local hidden variable model for every choice of two binary measurements per side, equivalently $\rho$ is CHSH-local |
| $\mathbb{1}$ | Identity operator |
| $T_\rho$ | The "$T$-matrix" of a two-qubit state, $T_{\rho;ij} = \operatorname{tr}(\rho\,\sigma_i\otimes\sigma_j)$ |

## Formal statement

Find bipartite density operators $\rho_1$ and $\rho_2$ (on possibly different bipartite Hilbert spaces) such that:

1. $\rho_1$ does *not* violate any CHSH Bell inequality (i.e. for every choice of two binary projective or POVM measurements per side on $\rho_1$, the resulting correlations admit a local hidden variable model satisfying CHSH).
2. $\rho_2$ does *not* violate any CHSH Bell inequality.
3. The tensor product state $\rho_1\otimes\rho_2$ (with Alice holding both $A$-subsystems and Bob holding both $B$-subsystems) *does* violate some CHSH Bell inequality.

Either exhibit such a pair $(\rho_1,\rho_2)$ explicitly, or prove that no such pair exists.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2011: Navascues and Vertesi construct CHSH activation by tensoring

- Evidence: Peer reviewed; Explicit construction
- Finding: Navascues and Vertesi construct two two-qubit states whose arbitrary tensor powers each admit local hidden-variable models but whose product violates CHSH, reaching about 2.023, and also a single CHSH-local state whose two copies violate CHSH. Both constructions use no filtering, only direct measurements on the joint state, giving the explicit affirmative answer that the archived statement requests.
- Source: https://arxiv.org/abs/1010.5191

## Scope and cautions

- Scope: The settling constructions use no filtering; the earlier hidden-nonlocality results of Popescu and Peres rely on local filtering or many copies and therefore do not answer the archived question.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
