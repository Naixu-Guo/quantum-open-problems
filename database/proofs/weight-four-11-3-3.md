# No [[11,3,3]] stabilizer code has weight-four generators

**Result by:** Yifan Jing and Yue Tu (University of Michigan), 25 September 2026.  
**Content license:** [CC BY 4.0](../../LICENSE-CONTENT), selected by both contributors.
No external peer review and no claim of historical priority is asserted.

This note resolves [op_458e9e86ccbddccb](https://qiqc-op.com/problem/op_458e9e86ccbddccb/)
negatively. No vectors $g_1,\dots,g_8\in\mathbb F_2^{22}$ satisfy Eq. (458e-conditions), so no
$[[11,3,d]]$ stabilizer code with $d\ge3$ has generators of weight at most four. Hence
$W_{\rm opt}(11,3,3)=5$. The certificates, encoders and Lean 4 formalization are at
<https://github.com/Ivann1242/optimal-check-weight-11-3-3> (commit `b4df2d2`).

## Results

- **Nonexistence.** $W_{\rm opt}(11,3,3)=5$.
- **Weight four at length 12.** The following $[[12,3,3]]$ code has generators of weight four:

  ```
  IIIIIIZZIIZZ  IIIIIIIIZZXX  ZZIIIIIIXXII  IIIIZZXXIIII  IIIZIXIYIIIX
  ZIZIXXIIIIII  IZXXIZIIIIII  IXIYIIIIIYIZ  XIIIYIZIZIII
  ```

  All 36 single-qubit syndromes are nonzero and pairwise distinct, so the code is pure with
  $d\ge3$, and a weight-three logical operator gives $d=3$. Hence $W_{\rm opt}(12,3,3)=4$. Since
  $W_{\rm opt}(n,k,d)$ is nonincreasing in $n$, the least length of an $[[n,3,3]]$ code with
  weight-four checks is exactly $12$.
- **Other entries of Table II** (Wei, Han, He, Li and Liu, arXiv:2601.19848v2): the remaining open
  distance-three entries are $W_{\rm opt}(10,4,3)=6$, $W_{\rm opt}(11,4,3)=5$,
  $W_{\rm opt}(11,5,3)=7$, $W_{\rm opt}(12,4,3)=5$, $W_{\rm opt}(12,5,3)=6$ and
  $W_{\rm opt}(12,6,3)=8$.
  - Each upper bound comes from an explicit pure code listed in the repository.
  - The lower bounds come from Table II, except $W_{\rm opt}(11,5,3)\ge7$, which is our
    certified nonexistence result for weight six.

## Proof of nonexistence

Write $m=n-k$. For a qubit $j$ and a Pauli type $t\in\{X,Y,Z\}$, let $s_{j,t}\in\mathbb F_2^m$
be the syndrome of the single-qubit error $e_{j,t}$, that is, its symplectic products with the
generators. Two errors have equal syndromes exactly when their product commutes with all
generators.

**Lemma 1 (syndromes).** Suppose the span $S$ contains no weight-one element. Then the last line
of Eq. (458e-conditions) holds if and only if:
- every $s_{j,t}$ is nonzero, which forces the three syndromes on a qubit to be distinct; and
- whenever $s_{j,t}=s_{l,s}$ with $j\neq l$, the weight-two operator $e_{j,t}+e_{l,s}$ lies in
  $S$.

For pure codes, the condition is that all $3n$ syndromes are nonzero and pairwise distinct.

**Lemma 2 (weight-one reduction).** Suppose $S$ contains a weight-one element $e$ on qubit
$j_0$. Every element of $S$ restricts to $0$ or $e_{j_0}$ on that qubit. Deleting qubit $j_0$
then gives an $[[n-1,k,\ge3]]$ code with $m-1$ generators of no larger weight.

**Lemma 3 (exchange).** A linearly independent family in $S$ of weight at most $w$ can be
extended by some of the original generators to a generating set of $S$. The span and every
condition of Eq. (458e-conditions) are preserved.

**Lemma 4 (normal form).**
- Local Clifford operations act on each qubit's three syndromes by an arbitrary permutation,
  because $GL(2,\mathbb F_2)=Sp(2,\mathbb F_2)\cong S_3$. So we may assume
  $s_{j,Z}<s_{j,X}<s_{j,Y}$ lexicographically.
- A permutation of the qubits $j\ge t_0$ can then sort the $s_{j,Z}$.
- Both operations preserve weights, commutation, supports and the distance condition.

**Case analysis.** For $n\le11$ and weight $w=4$, induct on $n$. The base case $n=k$ has no
generators and fails the distance condition. Every code falls into one of three cases.

- **(A) $S$ contains a weight-one element.** Lemma 2 reduces to length $n-1$.
- **(B) $S$ contains weight-two elements but none of weight one.** Let $W$ be their span and
  $r=\dim W$. By Lemma 3 a weight-two basis of $W$ comes first. Every syndrome coincidence
  between two qubits is then a combination of the first $r$ generators.
  - $r=1$: the support of $g_1$ is placed on $\{1,2\}$.
  - $r=2$: the supports of $g_1,g_2$ are equal, share one qubit, or are disjoint. Place them on
    $\{1,2\},\{1,2\}$, on $\{1,2\},\{2,3\}$, or on $\{1,2\},\{3,4\}$. Then $W$ lives on the first
    $t\le4$ qubits, the other qubits have pairwise distinct syndromes, and they are sorted
    strictly.
  - $r\ge3$: place $g_1$ on $\{1,2\}$ and require $\mathrm{wt}(g_i)\le2$ for $i\le r$.
- **(C) $S$ has no element of weight at most two.** All $3n$ syndromes are distinct; normalize
  by Lemma 4.

Cases (B) and (C) become Boolean formulas in the generator bits, with coefficient bits for the
collisions. Relaxations only weaken these formulas, which is sound.

## Certificates

- **DRAT for $[[11,3,3]]$:** 33 unsatisfiable instances. Each was solved by CaDiCaL 3.0.1, and
  its DRAT proof was checked by drat-trim.
  - There is one pure instance for each $4\le n\le11$.
  - For $n\le9$, case (B) is a single instance whose collision coefficients range over all
    generators.
  - For $n=10,11$, case (B) is split into the four layouts and one instance for each
    $3\le r\le m$.
  - The hardest case, $n=11$, $r=3$, takes about 10 minutes to solve and 14 minutes to check.
- **DRAT for $W_{\rm opt}(11,5,3)\ge7$:** 37 unsatisfiable instances at lengths $6\le n\le11$,
  all with verified DRAT proofs.
- **Lean 4 (Mathlib, `v4.35.0-rc2`):** the theorem
  `LowWeight.no_weight_four_11_3_3 : ¬ ∃ g : Fin 8 → Pauli 11, IsCode 11 8 4 g`, where `IsCode` is
  Eq. (458e-conditions) verbatim.
  - All reductions are proved in Lean.
  - The 61 satisfiability cases are discharged by `bv_decide`, which bit-blasts inside Lean and
    checks LRAT certificates with a verified checker.
  - `#print axioms` shows the three standard axioms plus 49 `bv_decide` native axioms. These
    native axioms mean the Lean compiler is also trusted.
  - The seven constructions are proved with kernel `decide` and use only the standard axioms.
  - There is no `sorry`.
- **Cross-check:** the encoders reproduce 13 known distance-three values of
  $W_{\rm opt}(n,k,3)$ from Table II.

## References

- F. Wei, Z. Han, A. Y. He, Z. Li, and Z.-W. Liu, "Theory of low-weight quantum codes,"
  arXiv:2601.19848v2 (2026).
- N. Wetzler, M. J. H. Heule, and W. A. Hunt, "DRAT-trim: Efficient checking and trimming using
  expressive clausal proofs," SAT 2014.
- L. de Moura and S. Ullrich, "The Lean 4 theorem prover and programming language," CADE 2021.

*Acknowledgment.* The reduction strategy, SAT encodings and Lean formalization were developed
with the assistance of Claude (Anthropic); the contributors checked the arguments.
