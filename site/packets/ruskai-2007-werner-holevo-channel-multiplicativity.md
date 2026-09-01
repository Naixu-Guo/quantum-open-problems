# AI research brief: Polarized Werner-Holevo multiplicativity

- Record ID: ruskai-2007-werner-holevo-channel-multiplicativity
- Record revision (SHA-256): d664414576b2612a20350632726143735c30409919006d017f8d8fe8400da9bb
- Formal statement digest (SHA-256): 04ce0a79ef13c7db3a88cb48214666af64a1687126f330722ce5327bade5d77d
- Status: Partially solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/ruskai-2007-werner-holevo-channel-multiplicativity/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/ruskai-2007-werner-holevo-channel-multiplicativity.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Polarized+Werner-Holevo+multiplicativity

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 7-8 (Problem 6)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

Werner-Holevo channels are a canonical stress test for output-norm conjectures. Resolving the polarized family would map the positive and negative regions of a central example.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d \times d$ complex matrices |
| $\rho$ | a density matrix (positive, trace-one) on $\mathbb{C}^d$ |
| $\mathrm{Tr}\,\rho$ | trace of $\rho$ |
| $\rho^T$ | transpose of $\rho$ in a fixed basis |
| $I$ | identity matrix on $\mathbb{C}^d$ |
| $\mathcal{W}$ | the Werner–Holevo channel $\mathcal{W}(\rho) = \tfrac{1}{d-1}\bigl((\mathrm{Tr}\,\rho)I - \rho^T\bigr)$ on $M_d$ |
| $\mathcal{I}$ | the identity channel ($\mathcal{I}(\rho) = \rho$) |
| $x$ | mixing parameter in $[0,1]$ |
| $\Phi_x$ | the *polarized* (or depolarized) Werner–Holevo channel $\Phi_x = x\mathcal{I} + (1-x)\mathcal{W}$ |
| $\Phi_x \otimes \Phi_x$ | tensor product (parallel two uses) of $\Phi_x$ |
| $\lVert\cdot\rVert_p$ | Schatten $p$-norm on matrices, $\lVert A\rVert_p = (\mathrm{Tr}\lvert A\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | maximal output $p$-norm, $\nu_p(\Phi) = \sup_\rho \lVert\Phi(\rho)\rVert_p$ |
| $p$ | the Schatten norm exponent, here $1 \le p \le 2$ |
| EB | entanglement breaking (a channel whose Choi state is separable) |

## Formal statement

**Problem 6 (Ruskai, 2007).** *Show that the polarized Werner–Holevo channel*
$$\Phi_x \;=\; x\,\mathcal{I} + (1-x)\,\mathcal{W}, \qquad x \in [0,1],$$
*on $M_d$ satisfies the multiplicativity property*
$$\nu_p(\Phi_x \otimes \Phi_x) \;=\; [\nu_p(\Phi_x)]^2 \qquad \text{for } 1 \le p \le 2.$$

## Exact unresolved remainder

Prove or refute multiplicativity for polarized Werner-Holevo channels throughout the remaining x and p values in the interval from one to two.

## Checked progress

### 2007: Every polarization is settled at p = 2

- Evidence: Peer reviewed; Exact parameter slice
- Finding: Michalakis proves maximal-output 2-norm multiplicativity for two identical depolarized Werner-Holevo channels in all dimensions.
- Source: https://arxiv.org/abs/0707.1722

### 2004: The unpolarized endpoint is settled through p = 2

- Evidence: Peer reviewed; Exact endpoint
- Finding: Datta proves multiplicativity for the Werner-Holevo endpoint throughout the interval from one to two.
- Source: https://arxiv.org/abs/quant-ph/0410063

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
