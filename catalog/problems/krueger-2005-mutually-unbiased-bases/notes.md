# Mutually unbiased bases

## Background

Two orthonormal bases $\{e_i^k\}_i$ and $\{e_j^n\}_j$ of $\mathbb{C}^D$ are called *mutually unbiased* if the overlap between any vector of one and any vector of the other has the same absolute value $D^{-1/2}$. A family of $K$ pairwise mutually unbiased bases (MUB) carries strong information-theoretic structure: measuring in different bases of the family extracts maximally complementary information.

MUBs arise in at least three contexts.

1. **State determination (Ivanovic, Wootters–Fields).** With $K$ orthonormal measurements one can determine $K(D-1)$ independent real parameters of a density operator; since a density operator has $D^2 - 1$ parameters, $K = D+1$ MUBs are exactly enough to fully reconstruct an unknown state with optimal statistical efficiency, when such a family exists.
2. **Quantum cryptography.** Maximal sets of MUBs underlie protocols such as the six-state QKD protocol (which uses $K = D+1 = 3$ MUBs in $D = 2$) and tolerate higher error rates than non-maximal families like BB84 ($K = 2$).
3. **The Mean King's problem (Vaidman–Aharonov–Albert and successors).** Determining the outcome of a previously-performed unknown measurement is solvable when $K = D+1$ MUBs are available.

It has been known since Ivanovic and Wootters–Fields that if $D$ is a prime power then $K = D+1$ MUBs exist, and this is the maximum possible value of $K$. For *non*-prime-power dimensions, no construction of $K = D+1$ MUBs is known, and the maximum possible $K$ is open. The smallest non-prime-power dimension is $D = 6$, where only $K = 3$ MUBs are known and the existence of a fourth (let alone the maximal $K = 7$) is a long-standing open problem.

## Status and known progress

- **Status:** open. As of 2026, the maximum number of MUBs in any non-prime-power dimension is unknown, and in particular the smallest case $D = 6$ remains unresolved despite intensive analytical, numerical, and computer-algebra investigation.
- **Prime-power dimensions.** $N(D) = D + 1$ whenever $D = p^k$ with $p$ prime (Ivanovic; Wootters–Fields; constructive proofs via Galois-field methods by Bandyopadhyay–Boykin–Roychowdhury, by Pittenger–Rubin, and by Klappenecker–Roetteler; algebraic-field-extension structure as in Pittenger–Rubin).
- **Non-prime-power dimensions.** Archer (2003) showed that the known prime-power constructions admit no straightforward extension to non-prime-power dimensions. For $D = 6$ the largest explicit set has $K = 3$ MUBs; extensive numerical search and Gröbner-basis attempts have produced strong evidence (but not proof) that no fourth MUB exists in $D = 6$, and hence that $N(6) < 7$.
- **Connections.** Barnum highlighted a close connection of the MUB problem with *spherical 2-designs* (collections of pure states whose averages reproduce integrals of degree-2 polynomials over the pure-state set). This recasts the problem in design-theoretic terms.
- **Lower bounds in composite dimensions.** When $D = \prod p_i^{k_i}$, one has $N(D) \geq 1 + \min_i p_i^{k_i}$ by combining MUBs in the prime-power factors. In particular $N(D) \geq 3$ for every even $D$; better lower bounds are known for some specific composite dimensions.
- **Subsequent developments (2005–2026).** Numerical evidence, semidefinite-programming bounds, and SIC-POVM connections continue to support the conjecture $N(6) = 3$, but no proof — neither of $N(6) = 3$ nor of any value $4 \leq N(6) \leq 7$ — has been published. The problem in arbitrary non-prime-power dimension also remains open.
- **Recent claim audit.** Joka's 2025/2026 preprint claims that complete MUBs imply complete mutually orthogonal Latin squares and hence excludes seven MUBs in dimension six. Its moment-map and dimension-reduction steps do not preserve the phase, projector, rank and overlap data needed for that conclusion, so the audit does not accept it. A peer-reviewed April 2026 review written after the preprint still states that complete MUBs in dimension six and other non-prime-power dimensions are unknown.
- A 2025 Comment exposed an error in an older dimension-six structural lemma and invalidated three later theorems that depended on it. This removes purported restrictions; it does not solve the existence problem.

**Last verified:** 2026-08-12.

## Bibliography

- D. McNulty, S. Weigert, *Mutually Unbiased Bases in Composite Dimensions: A Review*, Quantum **10**, 2051 (2026); arXiv:2410.23997.
- S. Joka, *Mutually Unbiased Bases and Orthogonal Latin Squares*, arXiv:2511.03537v3 (2026). Cited as an unaccepted solution claim.
- D. McNulty, S. Weigert, *Comment on "Product states and Schmidt rank of mutually unbiased bases in dimension six"*, J. Phys. A **58**, 168001 (2025); arXiv:2504.13067.

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig, http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166. Problem 13, pp. 43–45 (proposed by B.-G. Englert, 31 Jan 2003).
- I. D. Ivanovic, *Geometrical description of quantal state determination*, J. Phys. A **14**, 3241 (1981).
- W. K. Wootters and B. D. Fields, *Optimal state-determination by mutually unbiased measurements*, Ann. Phys. **191**, 363 (1989).
- L. Vaidman, Y. Aharonov, and D. Z. Albert, *How to ascertain the values of $\sigma_x$, $\sigma_y$, and $\sigma_z$ of a spin-1/2 particle*, Phys. Rev. Lett. **58**, 1385 (1987).
- Y. Aharonov and B.-G. Englert, *The mean king's problem: Spin 1*, Z. Naturforsch. **56a**, 16 (2001); arXiv:quant-ph/0101065.
- B.-G. Englert and Y. Aharonov, *The mean king's problem: Prime degrees of freedom*, Phys. Lett. A **284**, 1 (2001); arXiv:quant-ph/0101134.
- P. K. Aravind, *Solution to the King's Problem in prime power dimensions*, Z. Naturforsch. **58a**, 2212 (2003); arXiv:quant-ph/0210007 (2002).
- P. K. Aravind, *Best conventional solutions to the King's Problem*, arXiv:quant-ph/0306119 (2003).
- C. Archer, *There is no generalization of known formulas for mutually unbiased bases*, arXiv:quant-ph/0312204 (2003).
- H. Barnum, *Information-disturbance tradeoff in quantum measurement on the uniform ensemble and on the mutually unbiased bases*, arXiv:quant-ph/0205155 (2002).
- A. Klappenecker and M. Roetteler, *Constructions of mutually unbiased bases*, arXiv:quant-ph/0309120 (2003).
- A. O. Pittenger and M. H. Rubin, *Mutually unbiased bases, generalized spin matrices and separability*, arXiv:quant-ph/0308142 (2003).
- O. Schulz, R. Steinhübl, M. Weber, B.-G. Englert, C. Kurtsiefer, and H. Weinfurter, *Ascertaining the values of $\sigma_x$, $\sigma_y$, and $\sigma_z$ of a polarization qubit*, arXiv:quant-ph/0209127 (2002).
