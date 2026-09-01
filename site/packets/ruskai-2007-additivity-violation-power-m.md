# AI research brief: Delayed-onset additivity violation

- Record ID: ruskai-2007-additivity-violation-power-m
- Record revision (SHA-256): 40a1f72721b2bd728e7df30264230a8df93659d7ba70ea8746020c05a56dd9ba
- Formal statement digest (SHA-256): bf4bfc97b663cdce6203636f06c6ef6d4ae874955e2ba45773a9ce020de7a641
- Status: Open
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-additivity-violation-power-m/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-additivity-violation-power-m.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Delayed-onset+additivity+violation

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 16 (Problem 19)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

A delayed violation would show that testing one or two copies cannot certify an additive channel law. It would expose a new level of regularization in channel-output entropy.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d\times d$ complex matrices |
| $\Phi$ | completely positive trace-preserving (CPT) map (quantum channel) |
| $\Phi^{\otimes n}$ | $n$-fold tensor product of the channel $\Phi$ with itself |
| $n,m$ | positive integers, with $n<m$ in the additive regime |
| $p$ | Renyi parameter, $p>0$ |
| $\gamma$ | input density matrix, $\gamma\ge 0$, $\operatorname{Tr}\gamma=1$ |
| $S^p(\gamma)$ | Rényi $p$-entropy, $\tfrac{1}{1-p}\log\operatorname{Tr}\gamma^p$ for $p\ne 1$; $S^1$ is von Neumann entropy |
| $S^p_{\min}(\Phi)$ | minimal output Renyi entropy, $S^p_{\min}(\Phi)=\inf_\gamma S^p[\Phi(\gamma)]$ |
| eq. (24) | the multiplicativity assertion $\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\nu_p(\Omega)$ |

## Formal statement

**Problem 19 (Ruskai 2007), nontrivial intended form.** Find an example of a channel $\Phi$, an integer $m\ge 3$, and a value $p>0$ such that
$$S^p_{\min}\!\bigl(\Phi^{\otimes n}\bigr) \;=\; n\,S^p_{\min}(\Phi)\quad\text{for every }1\le n<m,$$
but
$$S^p_{\min}\!\bigl(\Phi^{\otimes m}\bigr) \;<\; m\,S^p_{\min}(\Phi).$$
In words: find a channel that is additive for every product of fewer than $m$ copies of itself but fails additivity at exactly $m$ copies.

## Exact unresolved remainder

Construct a genuine delayed-onset example with m at least three, or prove that two-copy additivity forces all-copy additivity in the relevant setting.

## Checked progress

### 2026: Explicit self-channel violations expose a quantifier trap

- Evidence: Preprint; Exact adjacent result
- Finding: Derksen and Lovitz give self-channel two-copy violations for every p greater than one. This solves the literal m equals two wording, but not delayed onset at m at least three.
- Source: https://arxiv.org/abs/2510.07547

### 2009: Hastings violations already appear at two copies

- Evidence: Peer reviewed; General counterexample
- Finding: The random-channel counterexample to minimum-output-entropy additivity does not remain additive through lower nontrivial tensor powers.
- Source: https://arxiv.org/abs/0809.3972

## Scope and cautions

- Interpretation: The intended problem must require m at least three. Otherwise the one-copy equality is tautological and any self-channel two-copy violation answers it.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
