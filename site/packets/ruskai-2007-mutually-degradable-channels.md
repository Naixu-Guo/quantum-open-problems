# AI research brief: Nontrivial mutually degradable channel pairs

- Record ID: ruskai-2007-mutually-degradable-channels
- Record revision (SHA-256): 346859af0c52cc6a7fbbd11d9417837d43b889cec23cac2d500118e229a9f2c1
- Formal statement digest (SHA-256): 65117e0d24210dbc6cef187270d9a8c5963fe3e1102f181a6040e42aca3b7110
- Status: Open
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-mutually-degradable-channels/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-mutually-degradable-channels.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Nontrivial+mutually+degradable+channel+pairs

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 16-17 (Problem 23)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

Mutual degradability means that each channel output can simulate the other channel's environment. Nontrivial examples would expose new structures governing coherent information and capacity.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d\times d$ complex matrices |
| $\mathcal{M},\mathcal{N}$ | quantum channels (CPT maps) |
| $\mathcal{X},\mathcal{Y}$ | auxiliary quantum channels |
| $\mathcal{M}^C$ | complementary channel of $\mathcal{M}$ (defined via the Stinespring dilation) |
| $\circ$ | composition of channels, $(\mathcal{X}\circ\mathcal{M})(\rho)=\mathcal{X}[\mathcal{M}(\rho)]$ |
| $\mathcal{I}$ | identity channel |
| $\operatorname{Tr}$ | trace channel, $\rho\mapsto\operatorname{Tr}\rho$ |
| Choi rank of $\mathcal{M}$ | rank of the Choi matrix $(\mathcal{I}\otimes\mathcal{M})(\lvert\Omega\rangle\langle\Omega\rvert)$, equivalently the minimum number of Kraus operators |
| $d$ | dimension of the input/output Hilbert spaces (here taken equal) |
| eq. (32) | the mutual-degradability condition $\mathcal{X}\circ\mathcal{M}=\mathcal{N}^C$ and $\mathcal{Y}\circ\mathcal{N}=\mathcal{M}^C$ |

## Formal statement

**Problem 23 (Ruskai 2007), intended nontrivial form.** Find distinct quantum channels $\mathcal{M},\mathcal{N}$ beyond the identity and individually degradable constructions that are *mutually degradable*, meaning that there exist CPT maps $\mathcal{X},\mathcal{Y}$ with
$$\mathcal{X}\circ\mathcal{M} \;=\; \mathcal{N}^C, \qquad \mathcal{Y}\circ\mathcal{N} \;=\; \mathcal{M}^C. \tag{32}$$
Of particular interest are examples in which:
- both $\mathcal{M}$ and $\mathcal{N}$ have Choi rank strictly less than $d^2$;
- and (most interestingly) both have Choi rank exactly $d$, but neither $\mathcal{M}$ nor $\mathcal{N}$ is *individually* degradable.

## Exact unresolved remainder

Construct distinct mutually degradable channels, preferably with neither channel individually degradable, or prove such pairs cannot exist under natural rank conditions.

## Checked progress

### 2008: Structural theory sharply constrains degradable channels

- Evidence: Peer reviewed; Structural constraints
- Finding: Cubitt, Ruskai and Smith formalize the relevant channel structure and rank restrictions without producing the requested nontrivial pair.
- Source: https://arxiv.org/abs/0802.1360

## Scope and cautions

- Interpretation: Without a nontriviality qualifier, identity/arbitrary and identical-degradable pairs answer the literal wording.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
