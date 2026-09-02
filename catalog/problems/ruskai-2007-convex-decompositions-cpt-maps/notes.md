# Convex decompositions of CPT maps — a block matrix generalization of Horn's lemma (Audenaert–Ruskai)

## Background

A CPT map (quantum channel) is the natural noncommutative analogue of a stochastic map. The convex set of CPT maps $\Phi : M_{d_1}\mapsto M_{d_2}$ has extreme points characterized by Choi: generalized extreme points have Choi rank at most the input dimension $d_1$. A natural decomposition question is how many such maps are needed to express a generic channel. Carathéodory gives the much larger bound $d_1^2(d_2^2-1)+1$. The strong Audenaert-Ruskai conjecture says that $d_2$ equally weighted generalized extreme maps suffice.

The channel question has adjoint and block-positive formulations. The source proves an implication chain among several of them and an equivalence between its Conjectures 4 and 5; it does not establish that all four displayed conjectures are mutually equivalent. The scalar case reduces to Horn's lemma, and the qubit-output block-matrix case is known. Audenaert also obtained extensive numerical evidence.

## Status and known progress

- **Special cases proved:**
  - $d_1 = 1$ (scalar case): Conjecture 4 is exactly Horn's lemma (A. Horn 1954; Horn & Johnson Theorem 4.3.32).
  - $d_2 = 2$ (qubit output): Ruskai–Szarek–Werner (2002), using an argument due to S. Szarek, proves Conjectures 4 and 5. Sketch: write $\mathbf{A}>0$ in the form $\mathrm{diag}(\sqrt{A_{11}},\sqrt{A_{22}})\,\begin{pmatrix}I & W\\W^\dagger & I\end{pmatrix}\,\mathrm{diag}(\sqrt{A_{11}},\sqrt{A_{22}})$ with $W$ a contraction; the SVD $W = U\,\mathrm{diag}(\cos\theta_j)\,V^\dagger$ decomposes $W = \tfrac{1}{2}(W_1+W_2)$ as the midpoint of two unitaries, showing $\mathbf{A}$ is the midpoint of two block matrices of rank $\le d_1$.
- **Numerical evidence:** Audenaert obtained extensive numerical evidence supporting Conjectures 2–5 in general.
- **Strengthened version:** One might hope each $\mathbf{B}_m$ has the *same* diagonal blocks as $\mathbf{A}$; the source notes this stronger statement does *not* appear to hold in the limiting case $d_1 = 1$ with $d_2 > 2$.
- **Obstructions to direct proof strategies:** In the proof of the scalar Corollary 2 it is tempting to replace $B$ by $C = BV$ for unitary $V$, but $C^\dagger C$ need not have diagonal elements $1/d$. A double-induction approach analogous to Horn's original proof is suggested by the known $d_2 = 2$ and $d_1 = 1$ base cases but is described as probably non-trivial.
- **Major recent partial result (Kumar and Wolf, 25 July 2026).** An unrefereed preprint proves the strong equal-weight conjecture for every channel with qubit input, all classical-to-quantum and quantum-to-classical channels, and a nonzero-measure set of channels in every dimension. It proves the weak, unequal-weight conjecture for qutrit endomorphisms $3\to3$, not for arbitrary-output channels with qutrit input.
- **Current status: partially solved.** The strong conjecture in arbitrary input and output dimensions remains open. Because the July 2026 result was a first-version preprint only eighteen days old at the audit cutoff, its claims should be tracked through peer review.

**Last verified:** 2026-08-12.

## Bibliography

- N. Kumar, M. M. Wolf, *The Ruskai-Audenaert conjecture & equipartitions of positive operators*, arXiv:2607.23066 (2026), v1 dated 25 July 2026.

- M. B. Ruskai, *Open Problems in Quantum Information Theory*, arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 February 2007. DOI: 10.48550/arXiv.0708.1902. (Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*.)
- M.-D. Choi, "Completely Positive Linear Maps on Complex Matrices," *Linear Algebra and its Applications* **10**, 285–290 (1975).
- A. Horn, "Doubly stochastic matrices and the diagonal of a rotation matrix," *American Journal of Mathematics* **76**, 620–630 (1954).
- R. A. Horn and C. R. Johnson, *Matrix Analysis*, Cambridge University Press, 1985 (see Theorem 4.3.32).
- M. B. Ruskai, S. Szarek and E. Werner, "An analysis of completely positive trace-preserving maps on $M_2$," *Linear Algebra and its Applications* **347**, 159–187 (2002).
