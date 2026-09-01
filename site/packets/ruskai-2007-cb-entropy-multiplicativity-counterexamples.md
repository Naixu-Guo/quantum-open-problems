# AI research brief: CB entropy of multiplicativity counterexamples

- Record ID: ruskai-2007-cb-entropy-multiplicativity-counterexamples
- Record revision (SHA-256): eaf7a01c7f08ce1dd31055017d93a5b3c351cebf926feb3d4ade3ebe340a92ab
- Formal statement digest (SHA-256): f0be07cfd86bab6db6b9930c841b68ca4be1d9dee0da6c167f607fa36fb62c6d
- Status: Open
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/ruskai-2007-cb-entropy-multiplicativity-counterexamples/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/ruskai-2007-cb-entropy-multiplicativity-counterexamples.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+CB+entropy+of+multiplicativity+counterexamples

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 16 (Problem 21)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

A universal entropy signature would explain why known output-norm counterexamples work and connect multiplicativity failure to coherent information.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d\times d$ complex matrices |
| $\Phi$ | quantum channel (CPT map) |
| $\Phi^C$ | complementary channel of $\Phi$ |
| $S(\rho)$ | von Neumann entropy of state $\rho$, $S(\rho)=-\operatorname{Tr}\rho\log\rho$ |
| $S^p(\rho)$ | Renyi $p$-entropy, $\tfrac{1}{p-1}\log\operatorname{Tr}\rho^p$ for $p\ne 1$ |
| $I_{\rm coh}(\rho,\Phi)$ | coherent information, $I_{\rm coh}(\rho,\Phi)=S[\Phi(\rho)]-S[\Phi^C(\rho)]$ |
| $S_{\rm CB}(\Phi)$ | completely-bounded (CB) entropy of the channel $\Phi$, as defined in Devetak-Junge-King-Ruskai (CMP 266, 2006) |
| EB | entanglement-breaking channel |
| WH | Werner-Holevo channel (Werner-Holevo 2002) |
| eq. (24) | multiplicativity assertion $\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\nu_p(\Omega)$ |

## Formal statement

**Problem 21 (Ruskai 2007).** Do *all* counter-examples to multiplicativity (24) of the maximal output $p$-norm have non-negative CB entropy and/or zero (i.e. non-positive at the violating input) coherent information?

Equivalently: does every quantum channel $\Phi$ for which there exists $\Omega$ and $p\ne 1$ with $\nu_p(\Phi\otimes\Omega)\ne\nu_p(\Phi)\nu_p(\Omega)$ necessarily satisfy
$$S_{\rm CB}(\Phi) \;\ge\; 0$$
and/or admit a multiplicativity-violating maximally entangled input $\rho$ with $I_{\rm coh}(\rho,\Phi)\le 0$? The question is of particular interest for $p<2$.

## Exact unresolved remainder

Prove the requested CB-entropy or coherent-information structure for all maximal-output-norm counterexamples, or give a counterexample to that structure.

## Checked progress

### 2006: Completely bounded norms give forward additivity implications

- Evidence: Peer reviewed; Foundational implication
- Finding: Devetak, Junge, King and Ruskai establish the foundational CB-norm connection, but not the converse classification requested here.
- Source: https://arxiv.org/abs/quant-ph/0506196

## Scope and cautions

- Interpretation: A statement that coherent information is zero must specify whether this is an input value, the channel maximum, or a capacity.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
