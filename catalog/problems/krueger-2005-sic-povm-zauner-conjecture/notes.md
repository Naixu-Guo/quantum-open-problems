# SIC POVMs and Zauner's Conjecture

## Background

Symmetric Informationally Complete Positive Operator-Valued Measures (SIC-POVMs) are a fundamental structure in quantum information theory: a SIC-POVM is a collection of $d^2$ rank-one operators $|\phi_i\rangle\langle\phi_i|/d$ on a $d$-dimensional Hilbert space whose pairwise overlaps $|\langle\phi_i|\phi_j\rangle|^2$ are equal to $1/(d+1)$ for all $i\neq j$. Such a configuration of $d^2$ unit vectors is also called a set of equiangular lines in $\mathbb{C}^d$ achieving the absolute Welch/Levenstein bound. Because the operators are linearly independent in the space of Hermitian operators, the statistics of a SIC-POVM measurement determine any quantum state $\rho$ uniquely; this property gives them direct importance for quantum state tomography, with the symmetric overlap structure ensuring that the outcomes are "maximally complementary" in a precise sense.

A natural way to construct candidate SIC-POVMs is to seek a single fiducial vector $|\phi\rangle$ such that the $d^2$ vectors $\{w(p,q)|\phi\rangle\}_{p,q\in\mathbf{Z}_d}$ obtained by acting with the Weyl–Heisenberg group form a SIC. SICs admitting such a single-orbit description are called group covariant; this is the form in which they have been constructed in every dimension where they are known. A further specialisation, originating in Gerhard Zauner's 1999 doctoral thesis, observes that an order-3 element $z$ of the Clifford group (the normaliser of the Heisenberg group) acts by a symplectic automorphism on $(p,q)$, and conjectures that a fiducial vector can always be chosen as an eigenvector of $z$. The combined questions—existence of SIC-POVMs, of Heisenberg-covariant SIC-POVMs, and the Clifford-eigenvector form predicted by Zauner—pose a deep and longstanding open problem at the interface of operator theory, finite geometry, and algebraic number theory.

## Status and known progress

The general problem is **open**. As of 2026 there is no proof of existence of SIC-POVMs (Problem 1) for all dimensions, nor of Heisenberg-covariance (Problem 2), nor of Zauner's eigenvector property (Problem 3). However, very substantial evidence has accumulated:

- High-precision numerical SIC fiducials have been computed in essentially every dimension that has been seriously attempted, beginning with the Renes–Blume-Kohout–Scott–Caves catalogue up to $d=45$ (2003) and steadily extended by Scott–Grassl, Fuchs, Appleby, and collaborators through dimensions in the hundreds (notably $d\le 121$, and isolated higher dimensions including $d=323$, $d\sim 844$ and selected dimensions up to nearly $d\approx 2208$). Every such numerical solution found to date is Heisenberg-covariant and consistent with Zauner's conjecture.
- Exact (algebraic) fiducials are known for many small dimensions: e.g. $d=2,3,4,5,6,7,8,11,12,13,19$ from Zauner, Appleby, Grassl and others, and a steadily growing list. Grassl (2004) gave a symbolic proof of Zauner's conjecture for $d=6$.
- Appleby (2004) gave a detailed analysis of the extended Clifford group (including anti-unitary elements), classified the Clifford-stability groups of the known solutions, and produced analytical fiducials in $d=7,19$ together with an infinite sequence of dimensions for which solutions are conjectured to be especially accessible.
- A deep number-theoretic structure was uncovered by Appleby, Flammia, McConnell and Yard (around 2017): the entries of exact SIC fiducials generate abelian extensions of real quadratic fields, linking SIC existence to Hilbert's 12th problem and explicit class-field theory.
- Kopp (2019, with subsequent collaborations) made this link concrete by constructing SIC fiducials from Stark units in certain ray class fields; this has produced exact SICs in many additional dimensions and provides strong evidence for a uniform Stark-unit construction.
- Klappenecker and Rötteler (2005) reproved that every SIC-POVM is a complex projective 2-design (an observation already in Renes et al. and known to Zauner). Wootters' programme connecting SICs to finite affine planes (Wootters 2004; Bengtsson–Ericsson 2004) remains open; in particular Grassl's $d=6$ analysis is relevant because affine planes of order 6 do not exist.

In summary: Zauner's conjecture holds in every dimension where it has been tested, is supported by both numerical and algebraic evidence and by an emerging number-theoretic framework, but a general proof of existence in all $d$ remains elusive.

- **Conditional 2025 construction.** Appleby, Flammia and Kopp give a putatively uniform construction, but their theorem assumes both the order-one abelian Stark conjecture for real quadratic fields and a special-value identity for the Shintani–Faddeev modular cocycle. It is major conditional progress, not an unconditional proof of Zauner's conjecture.
- **Withdrawn 2026 claim.** A January 2026 preprint by Joka claimed all finite-dimensional SICs, but the author withdrew it on 31 May 2026 and the arXiv record states that its proof is incorrect. Search-result titles for that manuscript must not be treated as a resolution.

**Last verified:** 2026-08-12.

## Bibliography

- M. Appleby, S. T. Flammia, G. S. Kopp, *A Constructive Approach to Zauner's Conjecture via the Stark Conjectures*, arXiv:2501.03970 (2025).
- S. Joka, *A proof of the SIC-POVM conjecture*, arXiv:2601.13475 (2026), withdrawn because the proof is incorrect.

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. Problem 23, pp. 60–63 (contact: D. Gross, 17 Feb 2005). DOI: 10.48550/arXiv.quant-ph/0504166. Source PDF: "Some Open Problems in Quantum Information Theory.pdf".
- J. M. Renes, R. Blume-Kohout, A. J. Scott, and C. M. Caves, *Symmetric Informationally Complete Quantum Measurements*, J. Math. Phys. **45**, 2171 (2004); arXiv:quant-ph/0310075 (2003).
- G. Zauner, *Quantendesigns – Grundzüge einer nichtkommutativen Designtheorie*, Doctoral thesis, University of Vienna, 1999. http://www.mat.univie.ac.at/~neum/papers/physpapers.html
- D. M. Appleby, *SIC-POVMs and the Extended Clifford Group*, arXiv:quant-ph/0412001 (2004); J. Math. Phys. **46**, 052107 (2005).
- A. Klappenecker and M. Rötteler, *Mutually Unbiased Bases are Complex Projective 2-Designs*, arXiv:quant-ph/0502031 (2005).
- M. Grassl, *On SIC-POVMs and MUBs in dimension 6*, arXiv:quant-ph/0406175 (2004).
- D. Gross, Diploma thesis, University of Potsdam, 2005.
- W. K. Wootters, *Quantum measurements and finite geometry*, arXiv:quant-ph/0406032 (2004).
- I. Bengtsson and Å. Ericsson, *Mutually Unbiased Bases and The Complementarity Polytope*, arXiv:quant-ph/0410120 (2004).
- A. J. Scott and M. Grassl, *SIC-POVMs: a new computer study*, J. Math. Phys. **51**, 042203 (2010); arXiv:0910.5784.
- D. M. Appleby, S. T. Flammia, G. S. McConnell, and J. Yard, *SICs and algebraic number theory*, Found. Phys. **47**, 1042 (2017); arXiv:1701.05200.
- G. S. Kopp, *SIC-POVMs and the Stark conjectures*, Int. Math. Res. Not. (2021); arXiv:1807.05877 (2019).
