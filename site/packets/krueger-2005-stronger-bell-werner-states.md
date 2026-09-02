# AI research brief: Stronger Bell inequalities for Werner states?

- Record ID: krueger-2005-stronger-bell-werner-states
- Record revision (SHA-256): 802b9578d03da130191c3bfc48ab34d0c3539335391b4f1bea93370c496f3d3a
- Formal statement digest (SHA-256): c86ef5a060036768b5474a75ce8f431e39ceebbb8faa36f662312589269669dc
- Status: Solved
- Field: Quantum information
- Topic: Bell nonlocality
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-stronger-bell-werner-states/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-stronger-bell-werner-states.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Stronger+Bell+inequalities+for+Werner+states%3F

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 54 (Problem 19)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Werner states can be entangled while admitting local hidden variable models, so they are the canonical testbed separating entanglement from Bell nonlocality; beating the CHSH threshold narrows the gap between known LHV models and the region of established nonlocality.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}$ | A finite-dimensional complex Hilbert space (here typically $\mathbb{C}^d$ for one party) |
| $d$ | Local Hilbert-space dimension |
| $\rho$ | A bipartite density operator on $\mathcal{H}\otimes\mathcal{H}$ |
| $W_p$ | A two-qudit Werner state, $W_p = p\,\rho_{\text{anti}} + (1-p)\,\rho_{\text{sym}}/\dim(\rho_{\text{sym}}) \cdot \dim(\rho_{\text{sym}}) $ — the unique family of $U\otimes U$-invariant states parametrised by $p\in[0,1]$ |
| $F$ | Singlet fraction or noise parameter parametrising a Werner family (depending on convention) |
| CHSH | Clauser–Horne–Shimony–Holt Bell inequality with two binary settings per side |
| $\mathcal{B}$ | A Bell functional: a linear combination $\sum c_{abxy} p(ab\,\vert\,xy)$ of joint probabilities |
| $\mathcal{B}_{\mathrm{LHV}}$ | The local-hidden-variable bound of $\mathcal{B}$ |
| $\mathcal{B}(\rho)$ | The maximal value of $\mathcal{B}$ attainable by quantum measurements on $\rho$ |
| "Werner state violates $\mathcal{B}$" | $\mathcal{B}(\rho) > \mathcal{B}_{\mathrm{LHV}}$ for the given Werner state $\rho$ |

## Formal statement

Find a Bell inequality $\mathcal{B}\le \mathcal{B}_{\mathrm{LHV}}$ that is *stronger than CHSH on Werner states*, in the sense that the set of two-qudit (or higher-party / multi-setting) Werner states for which $\mathcal{B}(\rho) > \mathcal{B}_{\mathrm{LHV}}$ strictly contains the set of Werner states violating CHSH.

Equivalently: exhibit a Bell inequality whose Werner-state violation threshold is strictly smaller (in the appropriate parametrisation) than the CHSH threshold $p_{\mathrm{CHSH}} = 1/\sqrt 2$ for two qubits, or its higher-dimensional analogue.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2008: Vertesi finds Bell inequalities beating CHSH on Werner states

- Evidence: Peer reviewed; Explicit construction
- Finding: Vertesi constructs a family of Bell inequalities with many binary settings whose local bound and Werner-state quantum value give a violation threshold of p above 0.7056, strictly below the CHSH threshold 1/sqrt(2) which is approximately 0.7071. This is exactly the stronger-than-CHSH example requested by the archived statement.
- Source: https://arxiv.org/abs/0806.0096

## Scope and cautions

- Scope: The Collins-Gisin I_3322 inequality cited in the source is inequivalent to CHSH but has a smaller Werner-state range, so it is not such an example; determining the optimal Werner-state nonlocality threshold is a separate question from the existence question settled here.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
