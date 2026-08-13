# Asymptotic cloning is state estimation?

> **Audit status (2026-08-12): SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $d$ | Dimension of the local quantum system (each state lives in $\mathbb{C}^d$) |
| $\mu$ | A fixed probability measure on the pure states of $\mathbb{C}^d$ |
| $N$ | Number of input copies of an unknown pure state |
| $M$ | Number of output (clone) copies, $M \ge N$ |
| $\mathcal{C}_{N\to M}$ | An $N$-to-$M$ cloning transformation: a CPTP map from $N$ input copies to $M$ output systems |
| $F(N,M)$ | Optimal single-copy fidelity averaged over $\mu$ and over all $M$ output clones, for the best $N$-to-$M$ cloner |
| $F(N,\infty)$ | $\lim_{M\to\infty} F(N,M)$; equivalently, the best mean single-copy fidelity achievable by a "measure-and-reprepare" strategy: measure on $N$ input copies and prepare a state according to the measurement outcome |
| $\lvert\langle\phi\,\vert\,\psi\rangle\rvert^2$ | Fidelity between two pure states $\lvert\phi\rangle$ and $\lvert\psi\rangle$ |

## Background

Two of the most basic limitations on quantum information are no-cloning and the finite information content of a quantum measurement. The two are intimately connected: if one could clone an unknown state, one could measure copies separately and beat the Holevo bound; conversely, if one could perfectly estimate an unknown state from finitely many copies, one could reprepare arbitrarily many high-fidelity copies, again contradicting no-cloning.

These intuitions are made quantitative by *optimal cloning theory* and *optimal state-estimation theory*. Given an input ensemble $\mu$ on pure states of $\mathbb{C}^d$, one defines:

- $F(N,M)$: the best single-copy fidelity, averaged over $\mu$ and over all $M$ output clones, achievable by an $N$-to-$M$ cloning channel.
- $F(N,\infty)$: the best single-copy fidelity achievable by a "measure-and-reprepare" strategy, in which one first measures the $N$ input copies (obtaining a classical estimate) and then reprepares any number of identical output copies according to the estimate. Since any such strategy is a particular $N$-to-$M$ cloner for any $M$, $F(N,M) \ge F(N,\infty)$ for all $M$; equivalently, $F(N,M)$ is non-increasing in $M$, and the limit $F(N,\infty) = \lim_{M\to\infty} F(N,M)$ always exists and satisfies $F(N,\infty) \ge F_{\text{measure-then-prepare}}(N)$.

For all examples in which both quantities had been explicitly computed at the time of the problem statement — universal cloning of qubits and qudits (Bruss–Ekert–Macchiavello and others), phase-covariant cloning (Bruss–Cinchetti–D'Ariano–Macchiavello), Keyl–Werner optimal cloning for arbitrary input distributions — the limit formula held: $F(N,\infty)$ as computed from cloning agreed with the best measure-and-reprepare fidelity. The folklore expectation is that this is general: "asymptotic cloning equals state estimation". But the naïve argument (clone many times, then statistically measure the clones, then reprepare) is suspect because the clones produced by the optimal cloner are typically *correlated* (often entangled) — measurement statistics on them are not the same as on independent copies of the input state.

## Formal statement

Fix a dimension $d$ and an arbitrary probability measure $\mu$ on the pure states of $\mathbb{C}^d$. For $N \ge 1$ and $M \ge N$, let $F(N,M)$ be the optimal single-copy fidelity, averaged with respect to $\mu$ and over all $M$ output clones, attained by $N$-to-$M$ cloning transformations. Let $F(N,\infty)$ be the best mean single-copy fidelity achievable by first measuring on $N$ input copies of the state and then repreparing a state according to the measured data.

Decide whether, for every $\mu$ and every $N$,
$$\lim_{M\to\infty} F(N,M) \;=\; F(N,\infty).$$

A weaker but still interesting version of the problem asks whether the equality holds in the further limit $N \to \infty$,
$$\lim_{N\to\infty}\lim_{M\to\infty} F(N,M) \;=\; \lim_{N\to\infty} F(N,\infty).$$

## Status and known progress

- **Computed examples.** In all examples in which the two sides could be evaluated explicitly — universal qudit cloning [KW99]; phase-covariant cloning of qubits [BCDM00]; certain other covariant cloning families — the equality holds. This supplies positive empirical evidence for the conjecture but does not prove it, because in each case the symmetry of the problem makes a direct comparison possible.
- **Status at the time of the snapshot.** Recorded as open in the source. The remark in the source is precisely the warning that the naïve argument fails because optimal clones are correlated/entangled, so one cannot simply "measure the clones independently" to recover state estimation.
- **Resolution.** The conjecture has been *proved* in full generality, independently by Bae and Acín (2006) and by Chiribella and D'Ariano (2006). Bae and Acín gave a short proof via monogamy of entanglement and properties of entanglement-breaking channels; Chiribella and D'Ariano gave a complementary proof via group-theoretic / de Finetti-type analysis of the asymptotic state of the clones. Both establish that for every input distribution and every $N$, $\lim_{M\to\infty} F(N,M) = F(N,\infty)$. Therefore the problem is **solved**: asymptotic cloning is state estimation.
- **Refinements.** Subsequent work (Chiribella, D'Ariano, Yang and collaborators, and others) has extended the result to multiphase and other covariant scenarios and connected it to the resource theory of programmable quantum measurements.

**Solved by:** J. Bae and A. Acín, *Asymptotic quantum cloning is state estimation*, Phys. Rev. Lett. 97, 030402 (2006); arXiv:quant-ph/0603078. Independent confirmation: G. Chiribella and G. M. D'Ariano, *Quantum information becomes classical when distributed to many users*, Phys. Rev. Lett. 97, 250503 (2006); arXiv:quant-ph/0608007.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005), Problem 22 on pp. 58–59; snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166.
- [KW99] M. Keyl, R. F. Werner, *Optimal cloning of pure states, judging single clones*, J. Math. Phys. 40, 3283 (1999); arXiv:quant-ph/9807010 (1998).
- [BCDM00] D. Bruss, M. Cinchetti, G. M. D'Ariano, C. Macchiavello, *Phase-covariant quantum cloning*, Phys. Rev. A 62, 012302 (2000); arXiv:quant-ph/9909046 (1999).
- J. Bae, A. Acín, *Asymptotic quantum cloning is state estimation*, Phys. Rev. Lett. 97, 030402 (2006); arXiv:quant-ph/0603078.
- G. Chiribella, G. M. D'Ariano, *Quantum information becomes classical when distributed to many users*, Phys. Rev. Lett. 97, 250503 (2006); arXiv:quant-ph/0608007.
