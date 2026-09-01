# AI research brief: Tightness of metrology bounds under correlated noise

- Record ID: kurdzialek-2024-correlated-noise-bound-tightness
- Record revision (SHA-256): 8d52c6f8bd597f59e237caf72931a3c04f17693673c83c1a70f470b432170d03
- Formal statement digest (SHA-256): a6a6956d04d1c3b5c26f2ba92dc49a70273762da53cc3f62372d7edc05e6159b
- Status: Open
- Field: Quantum sensing
- Topic: Quantum metrology
- Collection: GaugeForge
- Verified: 2026-08-31
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/kurdzialek-2024-correlated-noise-bound-tightness/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/kurdzialek-2024-correlated-noise-bound-tightness.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Tightness+of+metrology+bounds+under+correlated+noise

## Problem source

- Relationship: The source documents the gap used to formulate this problem.
- Title: Universal bounds for quantum metrology in the presence of correlated noise
- Authors: Stanisław Kurdziałek, Francesco Albarelli, Rafał Demkowicz-Dobrzański
- Venue: Phys. Rev. Lett. 135, 130801 (2025); arXiv:2410.01881 [quant-ph]
- Statement locator: Eqs. (10)-(11), discussion of block size m, and the statement that the bounds are not generally tight
- Read source: https://doi.org/10.1103/jy3v-wkcb

## Why it matters

Metrology bounds guide claims about attainable precision under memory noise. Tightness would certify that the block semidefinite programs predict a physical protocol rather than an unattainable relaxation.

## Formal statement

Let $\Lambda_\theta^{(N)}$ be a finite-dimensional correlated-noise comb and let
$$
\mathcal F_{\mathrm{AD}}^{(N)}=\max_{C^{(N)}}F\!\left(C^{(N)}\star\Lambda_\theta^{(N)}\right)
$$
denote the optimal quantum Fisher information over physical adaptive controls that cannot act on the inaccessible environment.

For each block size $m$, let $B_m$ denote the asymptotic upper coefficient from Eqs. (10) or (11) of the source paper:
$$
B_m=\frac{4}{m}\min_h a^{(m)}\quad\text{subject to }b^{(m)}=0
$$
in the standard-scaling case, and
$$
B_m=\frac{4}{m^2}\min_h b^{(m)2}
$$
in the Heisenberg-scaling case.

Determine whether the best block bound equals the achievable asymptotic precision,
$$
\inf_{m\geq1}B_m
=
\limsup_{N\to\infty}\frac{\mathcal F_{\mathrm{AD}}^{(N)}}{N^s},
\qquad s\in\{1,2\},
$$
for every model covered by the corresponding bound. A proof should supply asymptotically matching physical controls. A counterexample should give a finite-dimensional correlated model with a strict gap.

## Exact unresolved remainder

Prove that the block hierarchy converges to the achievable asymptotic comb quantum Fisher information, or construct a finite-dimensional correlated model with a strict gap.

## Checked progress

### 2025-09-22: The block hierarchy tightens without a convergence theorem

- Evidence: Peer reviewed; Framework limitation
- Finding: Kurdziałek, Albarelli and Demkowicz-Dobrzański derive asymptotic bounds for correlated-noise combs and show how larger blocks improve them. They state that the bounds are not generally tight and prove no limit equality with the physical optimum.
- Source: https://doi.org/10.1103/jy3v-wkcb

## Scope and cautions

- Interpretation: The defensible open problem is the tightness of the asymptotic coefficient. The broader scaling-dichotomy formulation in the lead repository goes beyond the explicit claim in the source paper.
- Provenance: The source paper states that its bounds are not generally tight and that larger blocks tighten them. The convergence problem is an audited formalization of that limitation, not a conjecture quoted from the authors.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
