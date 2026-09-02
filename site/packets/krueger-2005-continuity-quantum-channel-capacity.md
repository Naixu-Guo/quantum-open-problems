# AI research brief: Continuity of the quantum channel capacity

- Record ID: krueger-2005-continuity-quantum-channel-capacity
- Record revision (SHA-256): 88ef450e9838bb6ca46261387ccee5981864c7cdc1f2bc37054474c482d589e2
- Formal statement digest (SHA-256): 1c8fd68f12ddde56f3dbea794668581a10f85ccf5b1b51b0bdaab7fee860b50d
- Status: Solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-continuity-quantum-channel-capacity/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-continuity-quantum-channel-capacity.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Continuity+of+the+quantum+channel+capacity

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 41 (Problem 11)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Continuity means that a noise model known only up to a small cb-norm uncertainty still determines the available transmission rate up to a vanishing error, which matters for capacity analysis and fault-tolerant design; only lower semi-continuity was known, and the regularisation over unboundedly many channel uses made upper semi-continuity delicate.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}, \mathcal{K}$ | Finite-dimensional complex Hilbert spaces |
| $T, T'$ | Quantum channels (completely positive trace-preserving maps) |
| $Q(T)$ | Quantum (coherent) capacity of channel $T$ |
| $\lVert T - T'\rVert_{\mathrm{cb}}$ | Completely-bounded (cb) norm distance between channels |
| $\lVert\cdot\rVert_{\diamond}$ | Diamond norm (equivalent to cb-norm on quantum channels) |
| $\mathcal{C}$ | Convex set of all quantum channels with fixed input and output dimensions |
| $\varepsilon$ | Small positive parameter (distance threshold) |
| $\delta$ | Small positive parameter (capacity-gap threshold) |

## Formal statement

Let $\mathcal{C}$ denote the convex set of all quantum channels between fixed finite-dimensional input and output Hilbert spaces, equipped with the cb-norm distance.

**Problem.** Is the quantum (coherent) capacity
$$Q\colon \mathcal{C} \longrightarrow [0,\infty), \qquad T \mapsto Q(T)$$
a continuous function?

Equivalently: for every $\varepsilon > 0$ does there exist $\delta > 0$ such that, for all channels $T, T' \in \mathcal{C}$,
$$\|T - T'\|_{\mathrm{cb}} \;<\; \delta \;\;\Longrightarrow\;\; |Q(T) - Q(T')| \;<\; \varepsilon\,?$$

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2009: Leung and Smith prove uniform continuity of quantum capacity

- Evidence: Peer reviewed; Exact theorem
- Finding: Leung and Smith prove uniform continuity of the ordinary unassisted quantum capacity for channels with fixed finite output dimension, bounding the change in Q for two channels at diamond distance at most epsilon by an explicit function of epsilon and the output dimension that tends to zero with epsilon. Their entropy-telescoping proof applies on the entire channel set, including channels of zero capacity, so the archived question is answered affirmatively.
- Source: https://arxiv.org/abs/0810.4931

## Scope and cautions

- Scope: The interior-of-positive-capacity qualification in the same paper concerns quantum capacities assisted by free backward or two-way public classical communication; it does not qualify the theorem for the unassisted capacity Q asked about here.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
