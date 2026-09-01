# AI research brief: Bell inequalities for long-range vacuum correlations

- Record ID: krueger-2005-bell-vacuum-correlations
- Record revision (SHA-256): 2c26769804f73ebe810db146018c4216f92241018dd906d0711c9f4df0a6b176
- Formal statement digest (SHA-256): 085edb7f4f40b21def10f9c412f8caf73709eaa3f2a8a8bd153a4104e7a79c87
- Status: Open
- Field: Quantum information
- Topic: Bell nonlocality
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/krueger-2005-bell-vacuum-correlations/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/krueger-2005-bell-vacuum-correlations.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Bell+inequalities+for+long-range+vacuum+correlations

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 42 (Problem 12)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

The problem separates long-range vacuum entanglement from Bell nonlocality that localized observers can test. It probes the operational content of correlations in algebraic quantum field theory.

## Notation

| Symbol | Meaning |
|---|---|
| $\Omega$ | The vacuum state of a relativistic quantum field |
| $\phi(x)$ | Massive scalar free Bose field at spacetime point $x$ |
| $m$ | Mass parameter of the scalar field, $m > 0$ |
| $\mathcal{O}_A, \mathcal{O}_B$ | Bounded open spacetime regions (typically spacelike separated) |
| $\mathcal{A}(\mathcal{O})$ | Local von Neumann algebra of observables associated with region $\mathcal{O}$ |
| $d(\mathcal{O}_A, \mathcal{O}_B)$ | Minimum spatial distance between $\mathcal{O}_A$ and $\mathcal{O}_B$ |
| CHSH | Clauser–Horne–Shimony–Holt inequality |
| $\beta(\mathcal{O}_A, \mathcal{O}_B; \Omega)$ | Maximal CHSH value attainable using observables from $\mathcal{A}(\mathcal{O}_A)$ and $\mathcal{A}(\mathcal{O}_B)$ in the vacuum |
| PPT | Positive partial transpose |

## Formal statement

Consider a massive scalar free relativistic Bose field of mass $m > 0$, and its vacuum state $\Omega$.

For bounded open spacelike-separated regions $\mathcal{O}_A, \mathcal{O}_B$, let
$$\beta(\mathcal{O}_A, \mathcal{O}_B;\,\Omega) \;=\; \sup\Bigl\{\, \bigl|\langle A_1 (B_1 + B_2) + A_2 (B_1 - B_2)\rangle_{\Omega}\bigr| \,:\, A_i \in \mathcal{A}(\mathcal{O}_A),\; B_j \in \mathcal{A}(\mathcal{O}_B),\; \|A_i\|, \|B_j\| \leq 1,\; A_i = A_i^*,\; B_j = B_j^* \Bigr\}$$
be the maximal CHSH value attainable with observables drawn from the two regions in the vacuum.

**Problem.** Decide whether some (necessarily small) CHSH violation is possible for regions arbitrarily far apart, i.e. whether
$$\beta(\mathcal{O}_A, \mathcal{O}_B;\,\Omega) \;>\; 2$$
can hold for spacelike-separated regions with $d(\mathcal{O}_A, \mathcal{O}_B)$ arbitrarily large; or, conversely, show that beyond some distance the vacuum restriction admits a local hidden-variable model.

## Exact unresolved remainder

Prove a direct CHSH violation at arbitrarily large distance, or prove Bell locality beyond a finite separation.

## Checked progress

### 2004-12-14: Arbitrary-distance harvesting reveals hidden nonlocality

- Evidence: Peer reviewed; Exact restricted protocol
- Finding: Reznik, Retzker and Silman obtain entanglement at arbitrary separation. Their detector state violates CHSH only after local filtering and postselection, not directly.
- Source: https://arxiv.org/abs/quant-ph/0310058

## Scope and cautions

- Interpretation: Entanglement, failure of a PPT analogue and postselected hidden nonlocality are weaker than the direct bounded-region CHSH statement in the archived problem.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
