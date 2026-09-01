# AI research brief: Catalytic majorization

- Record ID: krueger-2005-catalytic-majorization
- Record revision (SHA-256): 11aa6a73b042cb59546f4dbd740cc9f8f1bb526227937484666e3cae34387dc5
- Formal statement digest (SHA-256): d2f7b36daa9d93cd1a8acfdb487f976e10c8be0dabcb1af63ce29ff2f995a4da
- Status: Partially solved
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-catalytic-majorization/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-catalytic-majorization.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Catalytic+majorization

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 23-24 (Problem 4)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Catalysts enlarge the set of pure-state transformations possible under LOCC without being consumed. A finite criterion would turn that resource conversion rule into a practical decision procedure.

## Notation

| Symbol | Meaning |
|---|---|
| $p = (p_1, \ldots, p_n)$ | A probability vector |
| $q = (q_1, \ldots, q_n)$ | A probability vector |
| $r$ | An auxiliary probability vector (the "catalyst") |
| $p \otimes r$ | Tensor product of probability vectors (coordinate-wise products) |
| $A, B$ | Pure bipartite quantum states |
| $C$ | An auxiliary entangled "catalyst" state |
| LOCC | Local operations and classical communication |
| $D$ | A doubly stochastic matrix (nonnegative; row and column sums equal $1$) |
| $f$ | A real-valued (convex) function on $\mathbf{R}$ |
| Majorization $p \prec q$ | $\sum_{i > k} p_i \le \sum_{i > k} q_i$ for all $k$ when $p, q$ are in decreasing order (i.e., $q$ is "more mixed" than $p$ in the source's terminology, i.e., $p$ has its mass more concentrated) |
| Catalytic majorization | Existence of an auxiliary $r$ with $p \otimes r$ majorized by $q \otimes r$ in the same sense |

## Formal statement

Define the relation *catalytic majorization* on probability vectors as follows: $p$ catalytically majorizes $q$ if there exists a probability vector $r$ such that $p \otimes r$ is more mixed than $q \otimes r$ in the sense of (ordinary) majorization, i.e., for $p, q, r$ rearranged in decreasing order,

$$\sum_{i > k} (p \otimes r)_i \;\le\; \sum_{i > k} (q \otimes r)_i \qquad \text{for all } k \in \mathbf{Z}_{\ge 0}.$$

Equivalently (Nielsen) on pure bipartite quantum states: $A$ can be converted into $B$ with a catalyst by LOCC iff the Schmidt-coefficient vectors $p$ of $A$ and $q$ of $B$ satisfy this catalytic majorization relation.

Give an efficient, explicit, mathematically transparent criterion — analogous to Nielsen's criterion for plain LOCC convertibility — that decides which pure bipartite states can be converted into which by LOCC with a catalyst; equivalently, decide the relation of catalytic majorization on classical probability vectors.

A promising line indicated in the source: find a class $\mathcal{F}$ of convex functions $f : \mathbf{R} \to \mathbf{R}$ such that

$$p \;\mapsto\; \sum_i f(p_i)$$

is monotone under catalytic majorization for every $f \in \mathcal{F}$, and use the monotonicity of all such functionals to characterise the relation. Multiplicative candidates such as $f(t) = t^x$ ($x>1$) are natural because they yield functionals that factor through tensor products.

## Exact unresolved remainder

Find a finite, tractable necessary-and-sufficient criterion for catalytic majorization, or prove that no such reduction exists.

## Checked progress

### 2026-03-19: A finite sufficient criterion is available

- Evidence: Peer reviewed; Sufficient criterion
- Finding: The new finite test certifies catalytic transformations but is not necessary, so it does not replace the infinite exact characterization.
- Source: https://www.nature.com/articles/s42005-026-02583-x

### 2007-09-24: Klimesh gives an exact infinite characterization

- Evidence: Preprint; Exact characterization
- Finding: A family of strict inequalities is necessary and sufficient for trumping under the theorem's support conditions.
- Source: https://arxiv.org/abs/0709.3680

### 2007-07-03: Turgut derives independent exact conditions

- Evidence: Peer reviewed; Exact characterization
- Finding: Power means and entropy give another necessary-and-sufficient infinite criterion for catalytic conversion.
- Source: https://arxiv.org/abs/0707.0444

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
