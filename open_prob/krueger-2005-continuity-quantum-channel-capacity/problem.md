# Continuity of the quantum channel capacity

> **Audit status (2026-08-12): SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}, \mathcal{K}$ | Finite-dimensional complex Hilbert spaces |
| $T, T'$ | Quantum channels (completely positive trace-preserving maps) |
| $Q(T)$ | Quantum (coherent) capacity of channel $T$ |
| $\lVert T - T'\rVert_{\mathrm{cb}}$ | Completely-bounded (cb) norm distance between channels |
| $\lVert\cdot\rVert_{\diamond}$ | Diamond norm (equivalent to cb-norm on quantum channels) |
| $\mathcal{C}$ | Convex set of all quantum channels with fixed input and output dimensions |
| $\varepsilon$ | Small positive parameter (distance threshold) |
| $\delta$ | Small positive parameter (capacity-gap threshold) |

## Background

A noisy quantum channel $T$ has a quantum capacity $Q(T)$ equal to the largest rate at which it can faithfully transmit qubits when used many times in parallel, with arbitrary encoding and decoding by quantum operations. In contrast to classical Shannon capacity, $Q$ is defined only via a regularisation limit and is known to display several surprising features: it can be strictly superadditive on tensor products, it cannot be expressed by any known single-letter formula, and it depends discontinuously on the very nature of the noise in subtle ways (e.g. zero-capacity channels can combine to give positive capacity, the phenomenon of superactivation).

A natural mathematical question is whether $Q$, regarded as a function from the metric space of quantum channels (equipped with the cb-norm, equivalently the diamond norm) to the real line, is continuous. Continuity would entail that if the noise model $T$ is known only up to a small uncertainty $\varepsilon$ in cb-norm, then the available transmission rate is also known up to a vanishing error. Such a robustness property is fundamental for both the theoretical analysis of capacities and the practical design of fault-tolerant protocols.

It is already known, by an argument due to Keyl and Werner, that $Q$ is lower semi-continuous: small cb-perturbations cannot abruptly decrease the capacity. Upper semi-continuity, however, is delicate: the regularisation
$$Q(T) \;=\; \lim_{n\to\infty}\,\frac{1}{n}\,Q^{(1)}(T^{\otimes n})$$
involves an unbounded number of channel uses, and small changes in $T$ can in principle accumulate exponentially.

## Formal statement

Let $\mathcal{C}$ denote the convex set of all quantum channels between fixed finite-dimensional input and output Hilbert spaces, equipped with the cb-norm distance.

**Problem.** Is the quantum (coherent) capacity
$$Q\colon \mathcal{C} \longrightarrow [0,\infty), \qquad T \mapsto Q(T)$$
a continuous function?

Equivalently: for every $\varepsilon > 0$ does there exist $\delta > 0$ such that, for all channels $T, T' \in \mathcal{C}$,
$$\|T - T'\|_{\mathrm{cb}} \;<\; \delta \;\;\Longrightarrow\;\; |Q(T) - Q(T')| \;<\; \varepsilon\,?$$

## Status and known progress

- **Status: solved affirmatively.** Leung and Smith (2009) proved uniform continuity of the ordinary, unassisted quantum capacity for channels with fixed finite output dimension. Their bound applies on the entire channel set, including channels of zero capacity.
- **Partial result (Keyl–Werner, 2002).** It is proved that the quantum capacity is *lower semi-continuous* as a function of the channel in cb-norm. That is, if $T_n \to T$ then $\liminf_n Q(T_n) \geq Q(T)$.
- **Main resolution (Leung–Smith, 2009).** For two channels at diamond distance at most $\varepsilon$, they bound the change in $Q$ by an explicit function of $\varepsilon$ and the output dimension that tends to zero with $\varepsilon$. Their entropy-telescoping proof covers the classical, unassisted quantum, and private classical capacities without an interior restriction.
- **Important distinction.** The interior-of-the-positive-capacity qualification in the same paper concerns quantum capacities assisted by free backward or two-way public classical communication. It does not qualify the theorem for the unassisted capacity $Q$ asked about here.
- **Refinements.**
  - Alicki–Fannes–Winter continuity bounds (Winter, 2016; Shirokov, 2017) provide tight uniform continuity for the coherent information and other entropic capacity formulas, including under energy constraints in infinite dimensions (Shirokov, *Problems Inform. Trans.* **54** (2018)).
  - For fixed input dimension and bounded output entropy, continuity bounds for many capacities follow from continuity of the coherent information together with the Alicki–Fannes–Winter inequality. These give uniform continuity on dimensionally constrained sub-classes.
  - Superactivation (Smith–Yard, 2008) demonstrates nonadditivity, but it does not imply discontinuity and does not create an exception at the zero-capacity boundary.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig, http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166. Problem 11, p. 41 (proposed by M. Keyl, 20 June 2003).
- M. Keyl and R. F. Werner, *How to correct small quantum errors*, in A. Buchleitner and K. Hornberger (eds.), *Coherent Evolution in Noisy Environment*, Springer Lecture Notes in Physics **611**, 263 (2002); arXiv:quant-ph/0206086.
- D. Leung and G. Smith, *Continuity of quantum channel capacities*, Comm. Math. Phys. **292**, 201–215 (2009); arXiv:0810.4931.
- G. Smith and J. Yard, *Quantum communication with zero-capacity channels*, Science **321**, 1812 (2008); arXiv:0807.4935.
- A. Winter, *Tight uniform continuity bounds for quantum entropies*, Comm. Math. Phys. **347**, 291 (2016); arXiv:1507.07775.
- M. E. Shirokov, *Tight uniform continuity bounds for the quantum conditional mutual information, for the Holevo quantity, and for capacities of quantum channels*, J. Math. Phys. **58**, 102202 (2017); arXiv:1512.09047.
