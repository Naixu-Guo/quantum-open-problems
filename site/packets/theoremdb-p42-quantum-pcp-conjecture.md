# AI research brief: Quantum PCP conjecture

- Record ID: theoremdb-p42-quantum-pcp-conjecture
- Record revision (SHA-256): 46dfa9b527bdbdf32a11440b003332ab69b397eff586e25fac96beb87d505cd7
- Formal statement digest (SHA-256): 306b56d9bde766f3b5acfdc4d375bd039cb5dec34f4b5d8012827d1bc75e28e7
- Status: Open
- Field: Quantum computation
- Topic: Local Hamiltonian complexity
- Collection: TheoremDB
- Verified: 2026-08-31
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/theoremdb-p42-quantum-pcp-conjecture/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/theoremdb-p42-quantum-pcp-conjecture.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Quantum+PCP+conjecture

## Problem source

- Relationship: The source states the cataloged problem.
- Title: The Quantum PCP Conjecture
- Authors: Dorit Aharonov, Itai Arad, Thomas Vidick
- Venue: ACM SIGACT News 44(2), 47-79 (2013)
- Statement locator: Sec. 1.2, Conjecture 1.3 (constant-gap Local Hamiltonian formulation)
- Read source: https://arxiv.org/abs/1309.7495

## Why it matters

Constant-gap hardness would connect quantum proof verification to ground-energy approximation at finite energy density. It also sets the complexity barrier for approximating local many-body Hamiltonians.

## Formal statement

Let
$$
H=\sum_{i=1}^{m} H_i,
$$
where each $H_i$ acts on at most a fixed number $k$ of finite-dimensional subsystems and satisfies $0\leq H_i\leq I$. Fix constants $a<b$ with $b-a>0$. Given the promise that either
$$
\lambda_{\min}(H)\leq am
\qquad\text{or}\qquad
\lambda_{\min}(H)\geq bm,
$$
decide which case holds.

Prove that some fixed choice of $k,a,b$ makes this promise problem QMA-hard, or refute the conjecture through an algorithm or complexity containment that rules out such hardness under stated assumptions.

## Exact unresolved remainder

Prove QMA-hardness of constant-gap bounded-locality Local Hamiltonian for fixed constants, or refute it through an algorithm or incompatible complexity containment.

## Checked progress

### 2025-07-11: Quantum-PCP reductions leave constant-gap hardness open

- Evidence: Peer reviewed; Structural restrictions
- Finding: Buhrman, Helsen and Weggemans prove reductions among quantum-PCP formulations and oracle barriers. Their results do not establish QMA-hardness for constant-gap Local Hamiltonian.
- Source: https://doi.org/10.22331/q-2025-07-11-1791

### 2023: NLTS Hamiltonians exist

- Evidence: Peer reviewed; Necessary structural milestone
- Finding: Anshu, Breuckmann and Nirkhe construct NLTS Hamiltonians from good quantum LDPC codes. NLTS supplies a required entanglement phenomenon but not the constant-gap QMA-hardness reduction.
- Source: https://doi.org/10.1145/3564246.3585114

## Scope and cautions

- NLTS is not quantum PCP: The proof of NLTS does not prove the complexity-theoretic hardness statement.
- Interpretation: This entry uses the Local Hamiltonian formulation. Statements about multi-prover games require separate hypotheses after MIP* = RE.
- Provenance: TheoremDB P42 records the standard constant-gap Local Hamiltonian conjecture and links it to the primary quantum-PCP literature.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
