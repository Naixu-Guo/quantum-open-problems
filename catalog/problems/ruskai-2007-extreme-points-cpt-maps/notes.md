# Extreme points of CPT maps

## Background

In quantum information theory (QIT), a quantum channel is modelled as a completely positive trace-preserving (CPT) linear map
$$\Phi : M_{d_1} \mapsto M_{d_2},$$
which by the Choi–Kraus theorem admits an operator-sum representation
$$\Phi(\rho) = \sum_k A_k \rho A_k^\dagger, \qquad \sum_k A_k^\dagger A_k = I_{d_1}.$$
The Kraus operators $\{A_k\}$ are not unique; they are determined only up to mixing by a partial isometry. A canonical minimal set, often called the Choi–Kraus operators, can be extracted from the eigenvectors of the Choi matrix
$$\Phi(\lvert\beta\rangle\langle\beta\rvert) = \tfrac{1}{d_1}\sum_{jk}\lvert e_j\rangle\langle e_k\rvert \otimes \Phi(\lvert e_j\rangle\langle e_k\rvert),$$
where $\lvert\beta\rangle$ is the maximally entangled Bell state. The rank of the Choi matrix is called the **Choi rank** of $\Phi$ (which is generally *not* the same as the linear-operator rank of $\Phi : M_{d_1} \to M_{d_2}$).

Choi proved that $\Phi$ is an extreme point of the convex set of CPT maps if and only if $\{A_j^\dagger A_k\}$ is linearly independent in $M_{d_1}$; this forces the Choi rank to be at most $d_1$. Ruskai, Szarek and Werner showed for qubit maps that the set of "generalized extreme points," i.e. CPT maps with Choi rank $\le d_1$, is precisely the closure $\overline{\mathcal{E}(d_1,d_2)}$ of the extreme set. The author proves (Theorem 1) that this characterization holds in arbitrary dimension: $\overline{\mathcal{E}(d_1,d_2)}$ consists of all CPT maps with Choi rank at most $d_1$.

For $d_1 = 2$, every map in $\overline{\mathcal{E}(2,d_2)}$ admits a clean SVD-based parameterization
$$A_1 = \sum_{j=1,2}\alpha_j \lvert v_j\rangle\langle u_j\rvert, \qquad A_2 = \sum_{j=1,2}\sqrt{1-\alpha_j^2}\,\lvert w_j\rangle\langle u_j\rvert$$
with $0 \le \alpha_j \le 1$, $\{\lvert u_j\rangle\}$ orthonormal in $\mathbb{C}^2$, and $\{\lvert v_j\rangle\}$, $\{\lvert w_j\rangle\}$ orthonormal pairs in $\mathbb{C}^{d_2}$. The question is whether a comparably explicit description exists for $d_1 > 2$.

## Status and known progress

- For $d_1 = 2$ the SVD parameterization (3) of the source gives a complete explicit description, established by Ruskai, Szarek and Werner in their 2002 analysis of CPT maps on $M_2$.
- For general $d_1$, Theorem 1 of the source identifies the closure with the set of Choi-rank-$\le d_1$ CPT maps, but does *not* give an explicit parameterization.
- The motivation is reinforced by the observation (§5.5 of the source) that certain conjectures about CPT maps with $d_1 = d_2$ can be reduced to channels in the closure of extreme points with $d_1 \ge d_2$.
- No general explicit parameterization is recorded in the source, and the author lists Problem 1 as open.
- Friedland and Loewy (2014) completely characterised the extreme points for qubit-to-qubit and qutrit-to-qubit channels and gave generic extremality conditions more generally.
- Iten and Colbeck (2018) parameterised fixed-Kraus-rank channel sets as quotients of Stiefel manifolds and showed that the fixed-rank extreme channels form smooth submanifolds, with an explicit dimension formula.
- **Status: partially solved.** These are genuine higher-dimensional classifications and parameterisations, but no qubit-style canonical form or complete classification is known for arbitrary $d_1>2$ and arbitrary output dimension.

**Last verified:** 2026-08-12.

## Bibliography

- S. Friedland, R. Loewy, *On the extreme points of quantum channels*, Linear Algebra Appl. **498**, 66 (2016); arXiv:1309.5898.
- R. Iten, R. Colbeck, *Smooth manifold structure for extreme channels*, J. Math. Phys. **59**, 012202 (2018); arXiv:1610.02513.

- M. B. Ruskai, *Open Problems in Quantum Information Theory*, arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 February 2007. DOI: 10.48550/arXiv.0708.1902. (Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*.)
- M.-D. Choi, "Completely Positive Linear Maps on Complex Matrices," *Linear Algebra and its Applications* **10**, 285–290 (1975).
- M. B. Ruskai, S. Szarek and E. Werner, "An analysis of completely positive trace-preserving maps on $M_2$," *Linear Algebra and its Applications* **347**, 159–187 (2002).
