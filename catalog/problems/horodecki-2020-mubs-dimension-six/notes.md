# Mutually unbiased bases in dimension six

## Background

Two orthonormal bases $\{\lvert\psi_i^m\rangle\}$ and $\{\lvert\psi_j^n\rangle\}$ of $\mathcal{H}_N$ are mutually unbiased if the modulus squared of every cross-inner-product equals $1/N$. Mutually unbiased bases (MUBs) generalise the canonical example provided in $\mathcal{H}_2$ by the eigenbases of the Pauli matrices $\sigma_x,\sigma_y,\sigma_z$, which form three MUBs. MUBs are central to quantum tomography (because joint measurements in $N+1$ MUBs yield an optimal informationally complete scheme), to quantum cryptography, to error correction, and to foundational questions about complementarity in finite-dimensional Hilbert spaces.

A standard counting argument shows that $\mathcal{H}_N$ admits at most $N+1$ MUBs, and this bound is attained when $N$ is a prime power: explicit constructions of complete sets of $N+1$ MUBs are known whenever $N=p^k$. For composite dimensions the situation is far less clear. The smallest composite dimension that is not a prime power is $N=6=2\times 3$. Despite enormous effort — analytic, numerical, computer-algebra, and combinatorial — only three MUBs have ever been constructed in $\mathcal{H}_6$ (one less than the prime-power lower bound would naively suggest), and it remains unknown whether four (let alone the maximal seven) MUBs exist. Any complete set of seven MUBs would correspond to seven mutually unbiased orthonormal bases of $\mathbb{C}^6$, equivalently to a particular family of $6\times 6$ complex Hadamard matrices each of unit-modulus entries scaled by $1/\sqrt{6}$. The matter is connected to the non-existence of finite affine planes of order six and to the non-existence of orthogonal Latin squares of order six (Tarry, 1901).

## Status and known progress

**Status: open.** The problem has been intensively studied since at least 2004 without a valid construction or impossibility proof.

- For any prime power $N=p^k$ there exists a complete set of $N+1$ MUBs (Ivanović 1981; Wootters–Fields 1989; Klappenecker–Rötteler 2004; Bandyopadhyay–Boykin–Roychowdhury–Vatan 2002).
- For composite dimensions $N=p_1^{k_1}\cdots p_m^{k_m}$ the product construction guarantees at least $1+\min_i p_i^{k_i}$ MUBs. For $N=6$ this gives only $3$ MUBs.
- Weiner (2013) established a gap result: in any dimension $N$, if one finds $N$ MUBs then the $(N+1)$-th basis must also exist. Hence the maximal number of MUBs in $\mathcal{H}_6$ is either $7$ or at most $6$, but in fact at most $N-1=5$ unless a complete set exists.
- For $\mathcal{H}_6$, numerical evidence by Butterley–Hall (2007), Brierley–Weigert (2008–2010), Jaming–Matolcsi–Móra–Szöllősi (2009), Raynal–Lü–Englert (2011), Goyeneche (2013), Chen–Yu (2018), Batle–Farouk–Naseri–Elhoseny (2016) consistently points to a maximum of three MUBs, but no proof is known.
- Constraints have been proven on the structure of a hypothetical complete set: McNulty and Weigert (2012) showed that a complete set of seven MUBs in $\mathcal{H}_6$ cannot contain three pairwise product bases.
- Many connections to complex Hadamard matrices of order six (Karlsson, Szöllősi, Tadej–Życzkowski, Banica) and to discrete geometry (Galois rings, finite projective planes) have been developed but have not led to a resolution.
- **Recent proof-claim audit.** Joka's November 2025 to January 2026 preprint claims that complete MUBs imply complete mutually orthogonal Latin squares and hence that seven MUBs cannot exist in dimension six. The argument is not accepted here: its moment-map step discards phases and collapses the projectors of one basis to one point, then assumes the lost projector structure and distances can be reassigned; its dimension-reduction induction likewise does not construct lower-dimensional rank-one projectors or preserve MUB overlaps. McNulty and Weigert's peer-reviewed April 2026 review, completed after that preprint's third version, still records dimension six as open.
- A 2025 peer-reviewed Comment also identified a proof error in an older structural lemma and invalidated three dependent theorems. Its Reply salvaged only one restricted theorem, not the MUB existence question.

As of the verification date below, no four MUBs in $\mathcal{H}_6$ have been constructed, no proof that seven MUBs do not exist has been published, and the problem remains open.

**Last verified:** 2026-08-12.

## Bibliography

- D. McNulty, S. Weigert, *Mutually Unbiased Bases in Composite Dimensions: A Review*, Quantum **10**, 2051 (2026); arXiv:2410.23997.
- S. Joka, *Mutually Unbiased Bases and Orthogonal Latin Squares*, arXiv:2511.03537v3 (2026). Cited as an unaccepted solution claim; see the status discussion.
- D. McNulty, S. Weigert, *Comment on "Product states and Schmidt rank of mutually unbiased bases in dimension six"*, J. Phys. A **58**, 168001 (2025); arXiv:2504.13067.

- P. Horodecki, Ł. Rudnicki, K. Życzkowski, *Five open problems in theory of quantum information*, PRX Quantum 3, 010101 (2022); arXiv:2002.03233 [quant-ph]. (Source paper; Problem 2 on p. 3–4.)
- I. D. Ivanović, *Geometrical description of quantal state determination*, J. Phys. A 14, 3241 (1981).
- W. K. Wootters, B. D. Fields, *Optimal state-determination by mutually unbiased measurements*, Ann. Phys. 191, 363 (1989).
- A. Klappenecker, M. Rötteler, *Constructions of mutually unbiased bases*, Lect. Notes Comput. Sci. 2948, 137 (2004).
- M. Weiner, *A gap for the maximum number of mutually unbiased bases*, Proc. Amer. Math. Soc. 141, 1963 (2013).
- S. Brierley, S. Weigert, I. Bengtsson, *All mutually unbiased bases in dimensions two to five*, Quantum Inf. Comput. 10, 0803 (2010).
- I. Bengtsson, W. Bruzda, A. Ericsson, J.-Å. Larsson, W. Tadej, K. Życzkowski, *Mutually unbiased bases and Hadamards of order six*, J. Math. Phys. 48, 052106 (2007).
- P. Jaming, M. Matolcsi, P. Móra, F. Szöllősi, M. Weiner, *A generalized Pauli problem and an infinite family of MUB-triplets in dimension 6*, J. Phys. A 42, 245305 (2009).
- P. Raynal, X. Lü, B.-G. Englert, *Mutually unbiased bases in dimension six: The four most distant bases*, Phys. Rev. A 83, 062303 (2011).
- D. McNulty, S. Weigert, *On the impossibility to extend triples of mutually unbiased product bases in dimension six*, Int. J. Quantum Inf. 10, 1250056 (2012).
- F. Szöllősi, *Complex Hadamard matrices of order 6: a four-parameter family*, J. London Math. Soc. 85, 616 (2012).
- W. Tadej, K. Życzkowski, *A concise guide to complex Hadamard matrices*, Open Syst. Inf. Dyn. 13, 133 (2006).
