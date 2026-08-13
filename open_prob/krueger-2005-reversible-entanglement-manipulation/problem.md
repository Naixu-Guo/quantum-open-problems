# Reversible entanglement manipulation

> **Audit status (2026-08-12): PARTIALLY SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A\otimes\mathcal{H}_B$ | Bipartite Hilbert space for parties $A$ and $B$ |
| $\rho$ | A bipartite density operator on $\mathcal{H}_A\otimes\mathcal{H}_B$ |
| LOCC | The class of local operations and classical communication (the standard free operations of bipartite entanglement) |
| PPT operations | Completely positive maps that preserve the set of PPT (positive partial transpose) states |
| Hyper-set | A class of operations introduced in [HOH02], strictly larger than LOCC and strictly smaller than PPT operations |
| $\lvert\Phi^+\rangle$ | The maximally entangled (singlet) state of two qubits |
| $E_{\mathrm{D}}(\rho)$ | Distillable entanglement of $\rho$ under a given class of operations |
| $E_{\mathrm{C}}(\rho)$ | Entanglement cost of $\rho$ under a given class of operations |
| Asymptotic reversibility | The condition $E_{\mathrm{D}}(\rho) = E_{\mathrm{C}}(\rho)$ for every $\rho$, under a fixed class of operations |
| $n$ | Number of i.i.d. copies of $\rho$ used in the asymptotic conversion |

## Background

Entanglement is treated as a resource: one fixes a class of "free" operations, and asks how efficiently entangled states can be interconverted using only those operations. For pure bipartite states the resource theory under LOCC is asymptotically reversible — every pure bipartite state $\lvert\psi\rangle_{AB}$ can be interconverted with maximally entangled pairs at a rate equal to the entropy of entanglement (Bennett, Bernstein, Popescu, Schumacher, 1996). Hence asymptotic LOCC equips pure-state entanglement with a unique scalar measure, in beautiful analogy with thermodynamic entropy.

For mixed states this analogy breaks down. Vidal and Cirac (2001), and Horodecki, Sen and Sen (2002), proved that under LOCC the entanglement cost $E_{\mathrm{C}}$ can strictly exceed the distillable entanglement $E_{\mathrm{D}}$ — so asymptotic LOCC manipulation of mixed entanglement is irreversible, and no unique LOCC entanglement measure exists for mixed states.

A natural way to recover reversibility is to allow a larger class of operations. PPT operations (Rains) are a popular choice: they include LOCC, they preserve the set of PPT states, and they are tractable via semidefinite programming. Audenaert, Plenio and Eisert (2003) showed that under PPT operations *some* mixed states (the totally antisymmetric Werner state) can be reversibly converted into singlets in the asymptotic limit; numerical evidence (Plenio, unpublished) suggests the same holds for all Werner states. On the other hand, Horodecki, Oppenheim and Horodecki (2002) showed that under a class of operations (the "Hyper-set") strictly between LOCC and PPT operations, asymptotic irreversibility persists.

The mismatch between PPT (where reversibility is plausible) and the Hyper-set (where irreversibility is proven) raises a question of fundamental thermodynamical flavour: *what is the smallest class of operations under which mixed-state bipartite entanglement becomes a single, reversible resource?* Such a class would equip mixed-state entanglement with a unique measure, the "free energy" of entanglement theory.

## Formal statement

Two open questions stated in the source:

(Q1) **Are PPT operations sufficient for asymptotic reversibility?** Is it the case that, for every bipartite density operator $\rho$ (pure or mixed), the distillable entanglement and the entanglement cost under PPT operations coincide,
$$E_{\mathrm{D}}^{\,\mathrm{PPT}}(\rho) \;=\; E_{\mathrm{C}}^{\,\mathrm{PPT}}(\rho)\,?$$
This is the conjecture known in some circles as the "Big-Fat-Conjecture" ([BFC]).

(Q2) **The smallest reversible class.** What is the smallest non-trivial class of operations $\mathcal{O}$ (containing LOCC) such that asymptotic interconversion of *all* bipartite entangled states — pure and mixed — is reversible under $\mathcal{O}$?

Both questions seek a single asymptotic entanglement measure that would play the role of entropy in a thermodynamics of entanglement.

## Status and known progress

- **Pure states under LOCC.** Asymptotic reversibility holds for pure bipartite states under LOCC (Bennett–Bernstein–Popescu–Schumacher, 1996) [BBPS96].
- **Mixed states under LOCC: irreversibility proven.** Vidal and Cirac (2002) [VC02] and independently Horodecki, Sen and Sen (2003) [HSS02] showed that LOCC manipulation of mixed bipartite entanglement is asymptotically irreversible.
- **Q1 solved negatively.** Wang and Duan (2017) proved irreversibility under completely PPT-preserving operations. For rank-two states supported on the $3\otimes3$ antisymmetric subspace, the PPT entanglement cost is one ebit while the PPT-distillable entanglement is strictly smaller than one. This counterexample disproves the conjecture that PPT operations make every state reversible.
- **Hyper-set operations.** Horodecki, Oppenheim and Horodecki (2002) [HOH02] proved asymptotic irreversibility under the Hyper-set, an intermediate class strictly between LOCC and PPT operations. So whatever the "right" class for reversibility turns out to be, it must include some operations outside the Hyper-set.
- **Asymptotically resource-nongenerating operations.** Brandão and Plenio proposed a reversible theory governed by regularised relative entropy. A gap in the underlying generalised quantum Stein lemma was identified in 2022. Lami supplied a new proof of that lemma in 2024, published in 2025, and recovered reversibility for the associated asymptotically resource-nongenerating model. Exact non-entangling operations are nevertheless irreversible, as Lami and Regula proved in 2023. These results depend sensitively on how much entanglement generation and approximation error the operational class allows.
- **Q2 remains open as posed.** A reversible class is known, but the smallest such class has not been characterised. Recent battery-assisted and approximate frameworks give other reversible models without establishing the requested minimum.
- **Bet.** The source records [Bet]: a bet between Michał Horodecki and Reinhard Werner on the existence of a "smallest reversible class".

The combined problem is therefore **partially solved**: Q1 has a definitive negative answer, while Q2 remains open.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005), Problem 20 on pp. 55–56; snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166.
- [BBPS96] C. H. Bennett, H. J. Bernstein, S. Popescu, B. Schumacher, *Concentrating partial entanglement by local operations*, Phys. Rev. A 53, 2046 (1996); arXiv:quant-ph/9511030 (1995).
- [VC02] G. Vidal, J. I. Cirac, *Irreversibility in asymptotic manipulations of entanglement*, Phys. Rev. Lett. 86, 5803 (2001); arXiv:quant-ph/0102036.
- [HSS02] M. Horodecki, A. Sen, U. Sen, *Rates of asymptotic entanglement transformations for bipartite mixed states: maximally entangled states are not special*, Phys. Rev. A 67, 062314 (2003); arXiv:quant-ph/0207031 (2002).
- [Ra00] E. M. Rains, *A semidefinite program for distillable entanglement*, IEEE Trans. Inform. Theory 47, 2921 (2001); arXiv:quant-ph/0008047 (2000).
- [APE03] K. Audenaert, M. B. Plenio, J. Eisert, *Entanglement cost under positive-partial-transpose-preserving operations*, Phys. Rev. Lett. 90, 027901 (2003); arXiv:quant-ph/0207146 (2002).
- [HOH02] M. Horodecki, J. Oppenheim, R. Horodecki, *Are the laws of entanglement theory thermodynamical?*, Phys. Rev. Lett. 89, 240403 (2002); arXiv:quant-ph/0207177.
- [Pl] M. B. Plenio, unpublished.
- [BFC] The "Big-Fat-Conjecture", boldly conjectured by M. B. Plenio.
- [Bet] A bet between M. Horodecki and R. F. Werner on the existence of such a class.
- F. G. S. L. Brandão, M. B. Plenio, *Entanglement theory and the second law of thermodynamics*, Nature Phys. 4, 873 (2008); and *A Reversible Theory of Entanglement and its Relation to the Second Law*, Commun. Math. Phys. 295, 829 (2010); arXiv:0710.5827, arXiv:0904.0281.
- X. Wang, R. Duan, *Irreversibility of asymptotic entanglement manipulation under quantum operations completely preserving positivity of partial transpose*, Phys. Rev. Lett. **119**, 180506 (2017); arXiv:1606.09421.
- M. Berta, F. G. S. L. Brandão, G. Gour, L. Lami, M. B. Plenio, B. Regula, M. Tomamichel, *On a gap in the proof of the generalised quantum Stein's lemma and its consequences for the reversibility of quantum resources*, Quantum **7**, 1103 (2023); arXiv:2205.02813.
- L. Lami, *A solution of the generalised quantum Stein's lemma*, IEEE Trans. Inf. Theory **71**, 4454 (2025); arXiv:2408.06410.
- L. Lami, B. Regula, *No second law of entanglement manipulation after all*, Nature Phys. **19**, 184 (2023); arXiv:2111.02438.
