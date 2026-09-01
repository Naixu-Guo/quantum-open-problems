# AI research brief: Asymptotic metrology with quantum-controlled causal order

- Record ID: mothe-2023-indefinite-causal-order-asymptotic-metrology
- Record revision (SHA-256): aea78889e43c659d042db391de7bd4e894429d328a08e494c738c552deeb6ba2
- Formal statement digest (SHA-256): a0e8ee5cff5fd71bc038762cac0840a2955516d5e39bafa653504b867e7e4310
- Status: Open
- Field: Quantum sensing
- Topic: Quantum metrology
- Collection: GaugeForge
- Verified: 2026-08-31
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/mothe-2023-indefinite-causal-order-asymptotic-metrology/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/mothe-2023-indefinite-causal-order-asymptotic-metrology.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Asymptotic+metrology+with+quantum-controlled+causal+order

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Reassessing the advantage of indefinite causal orders for quantum metrology
- Authors: Raphaël Mothe, Cyril Branciard, Alastair A. Abbott
- Venue: Phys. Rev. A 109, 062435 (2024); arXiv:2312.12172 [quant-ph]
- Statement locator: Sec. VII, discussion of possible asymptotic advantages from QC-QC strategies
- Read source: https://doi.org/10.1103/PhysRevA.109.062435

## Why it matters

Finite-use gains from quantum-controlled order matter only if they survive as resources grow. The answer determines whether causal control changes asymptotic sensing limits or only small-instance performance.

## Formal statement

For a smooth finite-dimensional channel family $\Lambda_\theta$, let $\mathcal F_{\mathrm{PAR}}^{(N)}(\theta)$ and $\mathcal F_{\mathrm{QCQC}}^{(N)}(\theta)$ denote the optimal quantum Fisher information from $N$ uses under parallel and QC-QC strategies. Work at a regular parameter value where the denominator is positive for large $N$.

Decide whether every such channel family satisfies
$$
\limsup_{N\to\infty}
\frac{\mathcal F_{\mathrm{QCQC}}^{(N)}(\theta)}
     {\mathcal F_{\mathrm{PAR}}^{(N)}(\theta)}
=1.
$$

An affirmative solution must extend the known asymptotic channel-estimation bounds to QC-QC strategies. A negative solution must construct a channel family and QC-QC protocols with a persistent constant-factor advantage or a larger scaling exponent.

A mathematical extension replaces QC-QC by the full set of valid process matrices. That set supplies an outer bound but includes processes without a known physical realization under the usual closed-laboratory assumptions.

## Exact unresolved remainder

Prove that QC-QC strategies become asymptotically equivalent to parallel strategies for every smooth finite-dimensional channel family, or give a noisy family with a persistent advantage.

## Checked progress

### 2026-05-08: A spacetime theorem identifies QC-QC as the physical target class

- Evidence: Preprint; Physical-scope theorem
- Finding: Salzger and Vilasini show that protocols satisfying their classical-spacetime and closed-laboratory assumptions are behaviorally equivalent to QC-QC. The theorem narrows the physical scope but gives no asymptotic metrology bound.
- Source: https://arxiv.org/abs/2605.08351

### 2024-06-25: QC-QC has a strict advantage at three channel uses

- Evidence: Peer reviewed; Finite-use separation
- Finding: Mothe, Branciard and Abbott find noisy channel families for which QC-QC outperforms causal superpositions and fixed-order circuits at finite N. Their discussion leaves the large-N behavior open.
- Source: https://doi.org/10.1103/PhysRevA.109.062435

### 2023-08-30: Parallel, adaptive and causal-superposition strategies coincide asymptotically

- Evidence: Peer reviewed; Exact lower-class theorem
- Finding: Kurdziałek and coauthors prove asymptotic equivalence through causal superpositions. Their proof does not cover dynamical quantum control of causal order.
- Source: https://doi.org/10.1103/PhysRevLett.131.090801

## Scope and cautions

- Finite versus asymptotic: The strict three-use separation proves a finite-resource advantage only. It does not determine the scaling exponent or leading asymptotic coefficient.
- Provenance: Mothe, Branciard and Abbott explicitly ask whether QC-QC strategies can provide an asymptotic advantage after proving strict finite-use advantages.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
