# Existence of SIC POVMs in an infinite sequence of dimensions

## Background

In an $N$-dimensional complex Hilbert space $\mathcal{H}_N$, a symmetric informationally complete positive operator valued measure (SIC POVM) is a configuration of $N^2$ unit vectors $\{\lvert\psi_j\rangle\}_{j=1}^{N^2}$ whose pairwise overlaps are constant and equal to the minimal value allowed by linear algebra. Equivalently, the associated rank-one projectors form a regular simplex inscribed in the convex set of density matrices of order $N$. SIC POVMs realise generalized quantum measurements that extract the maximal possible information from any single copy of an unknown density matrix, because their $N^2$ outcomes correspond exactly to the $N^2-1$ real parameters needed to determine a state plus the trace normalization. From a mathematical point of view, the existence of SICs is the same as the existence of a maximal set of equiangular lines in $\mathbb{C}^N$.

Almost all known constructions exploit the action of the Weyl–Heisenberg group $\mathbb{Z}_N\times\mathbb{Z}_N$: one looks for a fiducial vector whose orbit under the $N^2$ Weyl–Heisenberg operators forms the SIC. Zauner conjectured in 1999 that such a fiducial vector exists for every $N$. While this conjecture is supported by numerical computations and exact algebraic solutions in many specific dimensions, it has not been proved for any infinite family. The problem is deeply intertwined with algebraic number theory (in particular it is related to Hilbert's twelfth problem on explicit class field theory for real quadratic fields), and any infinite family of SICs would represent a major advance in both quantum information and number theory.

## Status and known progress

The Zauner conjecture is the subject of intense research but, in 2020 when the source was written, no infinite family of SICs was known. The state of the art recorded in the source is as follows.

- Numerical SIC fiducials were computed for all dimensions $N\leq 45$ by Renes, Blume-Kohout, Scott, and Caves (2004), extended to $N\leq 67$ by Scott and Grassl (2010) and to $N\leq 121$ by Scott (2017) and to $N\leq 151$ by Fuchs, Hoang, and Stacey (2017).
- In 2020 numerical solutions were known by Grassl for all $N\leq 193$ and additionally for $N\in\{204,224,255,288,528,725,1155,2208\}$.
- Exact (algebraic) solutions were known for $N\leq 53$ and for many further individual dimensions including $N\in\{57,61\text{–}63,65,67,73,74,76,78\text{–}80,84,86,91,93,95,97\text{–}99,103,109,111,120,122,124,127,129,133,134,139,143,146,147,151,155,157,163,168,169,172,181-183,193,195,199,201,228,259,292,323,327,364,399,403,489,844,1299\}$.
- Despite considerable effort by Appleby, Bengtsson, Flammia, Goyeneche, Grassl, Kopp, Yard and others, no infinite family of SIC POVMs has been constructed. Deep links to the Stark conjectures and to Hilbert's twelfth problem on explicit class field theory have been uncovered.

Subsequent to the publication of the source, further numerical and exact dimensions have been added by Grassl and collaborators (the running list of exact SICs maintained at the Markus Grassl SIC database has continued to grow into the 1000s), and Appleby–Bengtsson–Flammia–Kopp and others have strengthened the number-theoretic framework relating SICs to ray class fields of real quadratic fields. Nevertheless, as of the verification date below, no proof of an infinite family of SIC POVMs has appeared, and Zauner's conjecture remains open.

- **Conditional 2025 construction.** Appleby, Flammia and Kopp propose a uniform construction that would give SICs in all dimensions, but its validity assumes two unproved number-theoretic/special-value conjectures. It does not supply the unconditional infinite family requested here.
- **Withdrawn 2026 claim.** Joka's January 2026 preprint claimed an all-dimensions proof. It was withdrawn on 31 May 2026; the arXiv record explicitly says the proof is not correct.

**Last verified:** 2026-08-12.

## Bibliography

- M. Appleby, S. T. Flammia, G. S. Kopp, *A Constructive Approach to Zauner's Conjecture via the Stark Conjectures*, arXiv:2501.03970 (2025).
- S. Joka, *A proof of the SIC-POVM conjecture*, arXiv:2601.13475 (2026), withdrawn because the proof is incorrect.

- P. Horodecki, Ł. Rudnicki, K. Życzkowski, *Five open problems in theory of quantum information*, PRX Quantum 3, 010101 (2022); arXiv:2002.03233 [quant-ph]. (Source paper; Problem 1 on p. 2–3.)
- G. Zauner, *Quantendesigns — Grundzüge einer nichtkommutativen Designtheorie*, Dissertation, Universität Wien, 1999; English translation: Int. J. Quantum Inf. 9, 445 (2004).
- J. M. Renes, R. Blume-Kohout, A. J. Scott, C. M. Caves, *Symmetric Informationally Complete Quantum Measurements*, J. Math. Phys. 45, 2171 (2004).
- D. Andersson, *An Enthusiast's Guide to SICs in Low Dimensions*, Master Thesis, Stockholm University, 2015.
- B. C. Stacey, *Maximal sets of equiangular lines*, arXiv:2008.13288.
- I. Bengtsson, K. Życzkowski, *Geometry of Quantum States* (2nd ed.), Cambridge University Press, 2017.
- A. J. Scott, M. Grassl, *SIC-POVMs: A new computer study*, J. Math. Phys. 51, 042203 (2010).
- A. J. Scott, *SICs: Extending the list of solutions*, arXiv:1703.03993.
- C. A. Fuchs, M. C. Hoang, B. C. Stacey, *The SIC Question: History and State of Play*, Axioms 6, 21 (2017).
- M. Grassl, *Finding Numerical and Exact Solutions to the SIC-POVM Problem*, talk at the Max Planck Institute for the Science of Light, Erlangen, 03.11.2020; see also http://sicpovm.markus-grassl.de.
- M. Appleby, T.-Y. Chien, S. Flammia, S. Waldron, *Constructing exact symmetric informationally complete measurements from numerical solutions*, J. Phys. A 51, 165302 (2018).
- G. S. Kopp, *SIC-POVMs and the Stark conjectures*, International Mathematics Research Notices, rnz153, 2019.
- M. Appleby, I. Bengtsson, I. Dumitru, S. Flammia, *Dimension towers of SICs. I. Aligned SICs and embedded tight frames*, J. Math. Phys. 58, 122201 (2017).
