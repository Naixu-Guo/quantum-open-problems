# Tough error models

> **Audit status (2026-08-12): OPEN**

## Notation

| Symbol | Meaning |
|---|---|
| $H$ | $n$-dimensional complex Hilbert space (data space) |
| $n$ | Dimension of $H$ |
| $E$ | Error model: an $e$-dimensional linear subspace of operators on $H$ |
| $e$ | Dimension of the error model $E$ |
| $C$ | Quantum code: a subspace $C \subseteq H$ |
| $\dim C = c$ | Dimension of the code subspace |
| $P_C$ | Orthogonal projector onto $C$ |
| $A, B$ | Generic operators in $E$ |
| $A^*$ | Adjoint (conjugate transpose) of $A$ |
| $\lambda(A,B)$ | Scalar coefficient appearing in the Knill–Laflamme condition |
| $c(e, n)$ | Largest code dimension guaranteed to exist for every error model of dimension $e$ on $H$ |
| $\lceil x \rceil$ | Ceiling of $x$ |

## Background

A *quantum error-correcting code* is a subspace $C$ of a Hilbert space $H$, on which a specified set of errors acts in a way that can be perfectly reversed by a recovery operation. Following Knill and Laflamme, fix an *error model* $E$ — an $e$-dimensional subspace of operators on $H$ that contains every error to be corrected — and demand that for all $A, B \in E$,
$$P_C \, A^* B \, P_C \;=\; \lambda(A, B) \, P_C$$
for some scalars $\lambda(A, B)$ (independent of the code basis). Codes satisfying this condition can be perfectly recovered against any noise expressed as a Kraus map with all Kraus operators in $E$.

Two complementary questions are then natural. First, given only the dimension parameters $e$ and $n$, *what is the largest code dimension $c$ that can be guaranteed to exist*, without further information about the structure of $E$? Second, *which error models are "tough"*, in the sense that they nearly saturate this universal lower bound — i.e. error models against which no significantly larger code is possible? Constructing tough error models is essentially constructing worst-case noise for fault-tolerance: it tells us how protective coding can be in the absence of structural assumptions like locality, sparsity, or independent single-qubit noise.

The standard Pauli/stabiliser model on $n = 2^k$ qubits assumes that errors decompose into independent contributions on each qubit, which is a strong structural restriction; without such restrictions the picture is far less complete.

## Formal statement

Let $H$ be an $n$-dimensional complex Hilbert space and $E \subseteq B(H)$ an $e$-dimensional subspace of operators on $H$ (the *error model*). A subspace $C \subseteq H$ with projector $P_C$ is said to *correct* $E$ if for all $A, B \in E$ there exists a scalar $\lambda(A, B) \in \mathbb{C}$ with
$$P_C \, A^* B \, P_C \;=\; \lambda(A, B)\, P_C.$$

Define
$$c(e, n) \;=\; \max\bigl\{\, c \,:\, \text{for every } e\text{-dimensional } E \subseteq B(H), \text{ there exists a code } C \subseteq H \text{ correcting } E \text{ with } \dim C \geq c \,\bigr\}.$$

**Problem.**
1. Determine (or give the best possible bounds on) $c(e, n)$.
2. Find "tough error models" $E$ for which this bound is (nearly) tight — i.e. error models that admit no code of dimension substantially larger than $c(e, n)$.

## Status and known progress

- **Status:** open. No closed-form expression for $c(e, n)$ is known, and no fully matching constructions of tough error models have been given.
- **Lower bound (Knill–Laflamme–Viola 2000).** Every error model $E$ of dimension $e$ on an $n$-dimensional Hilbert space admits a code of dimension at least
  $$c(e, n) \;>\; \frac{n}{e^2(e^2 + 1)}.$$
- **Trivial upper bound.** Taking $E$ to be a set of mutually orthogonal projectors of roughly equal dimension $\approx n/e$ produces a noise channel with capacity at most $n/e$ (its Kraus operators implement a Lüders–von Neumann projective measurement). Hence no code subspace of dimension greater than $\lceil n/e \rceil$ can be perfectly corrected against this $E$, giving
  $$c(e, n) \;\leq\; \lceil n/e \rceil.$$
- The gap between the lower bound of order $n/e^4$ and the upper bound of order $n/e$ has not been closed in the general structure-free setting.
- **Subsequent developments.** Refined existence and counting bounds for general (non-Pauli) error models, derived via random coding arguments, approximate quantum error correction (Bény–Oreshkov, Kribs–Spekkens), and complementary-channel/decoupling techniques (Hayden–Horodecki–Winter and successors), have produced sharper bounds under various structural assumptions but have not yielded a tight value of $c(e, n)$ in full generality, nor a matching construction of an explicitly tough error model.

The earlier version of this entry miscopied the source's denominator as $e^2(e+1)$. The source PDF and Knill–Laflamme–Viola give $e^2(e^2+1)$.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig, http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166. Problem 14, pp. 46–47 (proposed by E. Knill, 31 Jan 2003).
- E. Knill, R. Laflamme, and L. Viola, *Theory of quantum error correction for general noise*, Phys. Rev. Lett. **84**, 2525 (2000); arXiv:quant-ph/9908066 (1999).
- E. Knill, R. Laflamme, A. Ashikhmin, H. Barnum, L. Viola, and W. H. Zurek, *Introduction to quantum error correction*, arXiv:quant-ph/0207170 (2002); http://www.c3.lanl.gov/~knill/qip/ecprhtml.
