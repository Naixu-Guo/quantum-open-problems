# AI research brief: The power of CGLMP inequalities

- Record ID: krueger-2005-cglmp-inequalities-power
- Record revision (SHA-256): b2bff4d973ed9472af4c5989597da88cfdc5261c755196c633cb78b6680d6414
- Formal statement digest (SHA-256): 8f12b17a3c578728532169a85c04465f8ed9c18bfa7c3a32062381dcfa19500a
- Status: Partially solved
- Field: Quantum information
- Topic: Bell nonlocality
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/krueger-2005-cglmp-inequalities-power/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/krueger-2005-cglmp-inequalities-power.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+The+power+of+CGLMP+inequalities

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 68-69 (Problem 27)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

The remaining claim would identify the measurement architecture that extracts the strongest and most noise-resistant CGLMP evidence from a maximally entangled state.

## Notation

| Symbol | Meaning |
|---|---|
| $N$ | Number of parties (here $N=2$, parties $X$ and $Y$) |
| $M$ | Number of measurement settings per party (here $M=2$) |
| $K$ | Number of outcomes per measurement (here $K=d$) |
| $d$ | Common outcome alphabet size; equivalently, local Hilbert-space dimension for the canonical realisation |
| $X_1,X_2$ | The two observables (each with $d$ outcomes) of party $X$ |
| $Y_1,Y_2$ | The two observables of party $Y$ |
| $m(x)$ | The mod-$d$ representative function $m(x)=x\bmod d \in\{0,1,\dots,d-1\}$ for integer $x$ |
| $\mathsf{E}[\cdot]$ | Expectation value under the experimentally observed joint distribution |
| $P$ | No-signalling polytope in the $(N,M,K)=(2,2,d)$ scenario |
| $Q$ | Convex set of quantum-achievable correlation data in that scenario |
| $C$ | Local classical (deterministic + shared randomness) polytope in that scenario |
| CGLMP inequality | The family of Bell inequalities introduced by Collins, Gisin, Linden, Massar and Popescu for two parties, two settings, and $d$ outcomes |
| Lifting | The operation of producing a Bell inequality for a larger-outcome scenario from one with fewer outcomes by formally identifying ("fusing") some outcomes |
| Kullback–Leibler divergence | Information-theoretic measure $D_{\mathrm{KL}}(p\Vert q)=\sum_a p(a)\log\bigl(p(a)/q(a)\bigr)$, used to quantify statistical strength of nonlocality proofs |
| Discrete Fourier transform | Unitary $F_{jk}=d^{-1/2}\,e^{i 2\pi jk/d}$ on $\mathbb{C}^d$ |
| Diagonal unitary | A unitary whose matrix in the computational basis is diagonal |
| Maximally entangled state | $\vert\Phi_d^+\rangle = d^{-1/2}\sum_{j=0}^{d-1} \vert j\rangle\vert j\rangle$ |

## Formal statement

In the bipartite Bell scenario with $(N,M,K)=(2,2,d)$, let $X_1,X_2$ be the two observables of party $X$ and $Y_1,Y_2$ the two observables of party $Y$, each with outcome alphabet $\{0,1,\dots,d-1\}$. Let $m(x)=x\bmod d$ on the integers, and let $\mathsf{E}[\cdot]$ denote expectation under the experimentally observed joint distribution. The CGLMP inequality (in the form used here, following R. Gill) reads
$$\mathsf{E}\bigl[m(X_1-Y_1)\bigr] + \mathsf{E}\bigl[m(Y_1-X_2)\bigr] + \mathsf{E}\bigl[m(X_2-Y_2)\bigr] + \mathsf{E}\bigl[m(Y_2 - X_1 - 1)\bigr] \;\ge\; d-1 ,$$
which holds for every local classical model. (One may note the proof identity $(X_1-Y_1)+(Y_1-X_2)+(X_2-Y_2)+(Y_2-X_1-1) = -1$ together with the inequality $m(a)+m(b)+m(c)+m(d)\ge m(a+b+c+d)$ for integers $a,b,c,d$.)

**Problem 27.A.** Show that every facet of the local polytope $C$ (in this scenario) which is *not* a facet of the no-signalling polytope $P$ is of CGLMP type: it is either an inequality of the CGLMP form written above, or a *lifting* of such an inequality from a strictly lower-dimensional outcome alphabet — i.e. an inequality obtained by formally fusing outcomes of a CGLMP inequality at smaller $d'<d$.

**Problem 27.B.** Numerically, the observables maximally violating CGLMP on a maximally entangled state $|\Phi_d^+\rangle$ have the specific structure (DKZ; CGLMP): each is a computational-basis measurement preceded by the discrete Fourier transform and a diagonal unitary. Show that this structure is necessary. Show in addition that these "Fourier + diagonal" measurements simultaneously realise the highest resistance of the violation to (white) noise, and the best discrimination against classical realism in the sense of Kullback–Leibler divergence (the statistical strength of nonlocality proofs in the sense of van Dam–Grünwald–Gill).

## Exact unresolved remainder

For a fixed maximally entangled state, prove or refute necessity of Fourier-plus-diagonal measurements and their simultaneous white-noise and Kullback-Leibler optimality in every outcome dimension.

## Checked progress

### 2010-04-23: Part A is refuted by a finite facet counterexample

- Evidence: Peer reviewed; Exact counterexample
- Finding: Bancal, Gisin and Pironio find two-party, two-setting, four-outcome facets that are neither CGLMP inequalities nor lower-outcome liftings.
- Source: https://arxiv.org/abs/1004.4146

### 2008-03-27: Numerics clarify the optimizer but do not prove Part B

- Evidence: Peer reviewed; Numerical evidence
- Finding: Global optimization shows that nonmaximally entangled states can outperform maximally entangled ones. The archived measurement claim must therefore retain its fixed-state qualifier.
- Source: https://doi.org/10.1103/PhysRevLett.100.120406

## Scope and cautions

- Interpretation: Part B fixes the maximally entangled state. A better global strategy using a nonmaximally entangled state does not by itself answer that fixed-state measurement question.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
