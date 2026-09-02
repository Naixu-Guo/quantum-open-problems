# AI research brief: Bell inequalities holding for all quantum states

- Record ID: krueger-2005-bell-inequalities-all-quantum-states
- Record revision (SHA-256): 4092a4aa66c1924500d2b00d2fc613152481d35e89d1a09f655d589489773db9
- Formal statement digest (SHA-256): 398ad4bf228b49c8249c9c00bba9cde35c8f961e2527efb47cd712d6e66f5d3a
- Status: Solved
- Field: Quantum information
- Topic: Bell nonlocality
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-bell-inequalities-all-quantum-states/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-bell-inequalities-all-quantum-states.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Bell+inequalities+holding+for+all+quantum+states

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 66-67 (Problem 26)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

The two questions probe how the quantum set Q sits between the local polytope C and the no-signalling polytope P; a proper Bell inequality valid for all quantum states would be a striking additional structural constraint on quantum mechanics beyond Tsirelson-type bounds.

## Notation

| Symbol | Meaning |
|---|---|
| $N$ | Number of parties in a multipartite Bell experiment |
| $M$ | Number of measurement settings available to each party |
| $K$ | Number of possible outcomes per measurement |
| Correlation data | Joint probabilities $p(a_1,\dots,a_N \mid x_1,\dots,x_N)$ over outcomes $a_i$ given settings $x_i$ |
| No-signalling | The constraint that the marginal probabilities seen by any subset of parties do not depend on the settings of the others |
| $P$ | The no-signalling polytope: convex polytope of correlation data satisfying positivity and the no-signalling constraint |
| $Q$ | The quantum body: convex set of correlation data realisable by quantum POVM measurements on multipartite quantum states; $C\subset Q\subset P$ |
| $C$ | The classical (local realistic) polytope: convex hull of deterministic local strategies |
| Tsirelson region | Synonym for $Q$ (after B. S. Tsirelson, the originator) |
| Proper Bell inequality | A tight linear inequality defining a maximal face of $C$ that is not also a face of $P$ — i.e. a non-trivial Bell inequality not implied by positivity and no-signalling |
| von Neumann measurement | A complete projective measurement (with $K$ orthogonal rank-one projectors when realising $K$ outcomes) |

## Formal statement

Fix integers $N\ge 2$, $M\ge 2$, $K\ge 2$, and consider the convex bodies $C\subset Q\subset P$ defined above.

**Problem 26.A.** Consider the part of the boundary $\partial Q$ that is *not* already contained in the boundary $\partial P$. Can every such boundary point be reached by choosing each of the local Hilbert spaces to have dimension exactly $K$, by taking each measurement to be a complete von Neumann measurement (with $K$ orthogonal projectors), and by using only pure quantum states of this minimal dimension?

**Problem 26.B.** Consider a maximal face of the local polytope $C$ that is *not* also a face of $P$ — equivalently, a "proper Bell inequality": a tight linear inequality for local classical correlations that does not follow from positivity and no-signalling alone. Can one always find points of $Q$ outside this face? Phrased in terms of Bell inequalities: can every proper Bell inequality be violated by quantum correlation data? Or, do there exist proper Bell inequalities (faces of $C$ that are not faces of $P$ and that nevertheless support a face of $Q$ on the same side as $C$) that hold for all quantum states?

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2012: Both universal Bell questions have explicit counterexamples

- Evidence: Peer reviewed; Exact theorem
- Finding: Slofstra's CHSH(n) XOR games have binary outcomes, so K = 2, yet every optimal strategy needs local dimension at least 2 to the power of floor(n/2); the associated optimal behavior lies on the quantum boundary away from the positivity boundary of the no-signalling polytope and cannot be realised in dimension K, refuting 26.A. Almeida, Bancal, Brunner, Acin, Gisin and Pironio's Guess Your Neighbor's Input inequalities have equal classical and quantum optima while no-signalling correlations do better, and Augusiak et al. proved explicit instances are tight facets, refuting 26.B.
- Source: https://arxiv.org/abs/1112.3238

### 2011: Both universal Bell questions have explicit counterexamples

- Evidence: Peer reviewed; Exact counterexample
- Finding: Slofstra's CHSH(n) XOR games have binary outcomes, so K = 2, yet every optimal strategy needs local dimension at least 2 to the power of floor(n/2); the associated optimal behavior lies on the quantum boundary away from the positivity boundary of the no-signalling polytope and cannot be realised in dimension K, refuting 26.A. Almeida, Bancal, Brunner, Acin, Gisin and Pironio's Guess Your Neighbor's Input inequalities have equal classical and quantum optima while no-signalling correlations do better, and Augusiak et al. proved explicit instances are tight facets, refuting 26.B.
- Source: https://arxiv.org/abs/1007.2248

### 2010: Both universal Bell questions have explicit counterexamples

- Evidence: Peer reviewed; Exact counterexample
- Finding: Slofstra's CHSH(n) XOR games have binary outcomes, so K = 2, yet every optimal strategy needs local dimension at least 2 to the power of floor(n/2); the associated optimal behavior lies on the quantum boundary away from the positivity boundary of the no-signalling polytope and cannot be realised in dimension K, refuting 26.A. Almeida, Bancal, Brunner, Acin, Gisin and Pironio's Guess Your Neighbor's Input inequalities have equal classical and quantum optima while no-signalling correlations do better, and Augusiak et al. proved explicit instances are tight facets, refuting 26.B.
- Source: https://arxiv.org/abs/1003.3844

## Scope and cautions

- Scope: In the CHSH scenario (N,M,K) = (2,2,2) and in many further low-complexity scenarios all proper Bell inequalities are quantum-violable, so 26.B is affirmative there; the counterexamples arise in larger scenarios.
- Scope: MIP* = RE and later dimension-witness results strengthen the conclusion but are not needed for either exact counterexample.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
