# Pairs of mutually degradable quantum channels

## Background

For a channel $\mathcal{N}:M_{d_A}\to M_{d_B}$ with Stinespring isometry $V:\mathbb{C}^{d_A}\to\mathbb{C}^{d_B}\otimes\mathbb{C}^{d_E}$, the *complementary channel* $\mathcal{N}^C:M_{d_A}\to M_{d_E}$ is defined by tracing out the system instead of the environment. A channel $\mathcal{N}$ is called *degradable* (Devetak-Shor, *Commun. Math. Phys.* 256 (2005), 287-303; quant-ph/0311131) if there exists a CPT map $\mathcal{D}$ such that $\mathcal{D}\circ\mathcal{N}=\mathcal{N}^C$; intuitively, the receiver can simulate the environment by post-processing. Degradable channels have additive coherent information and tractable quantum capacity.

Cubitt, Ruskai and Smith (cited as [11] "in preparation" in the source PDF; later finalised as T. S. Cubitt, M. B. Ruskai, G. Smith, "The structure of degradable quantum channels", *J. Math. Phys.* 49 (2008), 102104; arXiv:0802.1360) studied structural aspects of degradability and raised the more symmetric notion of *mutual degradability*. Two channels $\mathcal{M},\mathcal{N}$ are mutually degradable if each can be degraded into the complement of the other by post-processing — that is, $\mathcal{X}\circ\mathcal{M}=\mathcal{N}^C$ and $\mathcal{Y}\circ\mathcal{N}=\mathcal{M}^C$ for some CPT maps $\mathcal{X},\mathcal{Y}$.

The source records identity/arbitrary pairs. There are other immediate degenerate readings: $(\mathcal M,\mathcal M)$ works whenever $\mathcal M$ is degradable. The intended question must therefore exclude such constructions and seek a distinct, genuinely nontrivial pair, preferably with neither channel individually degradable.

Ruskai also gives structural heuristics involving full Choi rank. They are not a simple dimensional impossibility: a CPT map may increase output dimension by appending an ancilla. The interesting regime highlighted by the source is lower Choi rank for both channels, especially rank $d$.

## Status and known progress

- Identity/arbitrary pairs and identical individually degradable pairs answer a literal reading, but are degenerate relative to the source's aim.
- The follow-up paper T. S. Cubitt, M. B. Ruskai, G. Smith, "The structure of degradable quantum channels", *J. Math. Phys.* 49 (2008), 102104 (arXiv:0802.1360), develops the structure of degradable channels and gives strong constraints on the Choi rank.
- Wolf and Pérez-García (*Phys. Rev. A* 75 (2007), 012303; quant-ph/0607070) and subsequent work classified low-rank degradable qubit channels; this includes anti-degradable channels but does not directly settle Problem 23.
- Brandão, Oppenheim and Strelchuk ("When does noise increase the quantum capacity?", *Phys. Rev. Lett.* 108 (2012), 040501; arXiv:1107.4385) and others have studied composite channels whose degradability properties are non-trivial.
- No verified distinct, genuinely nontrivial pair of the requested kind was located. In particular, none with both Choi ranks exactly $d$ and neither channel individually degradable is known.
- **Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory" (arXiv:0708.1902 [quant-ph], 2007), based on the BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007. Problem 23, p. 16-17. DOI: 10.48550/arXiv.0708.1902. Source PDF: `Open Problems in Quantum Information Theory_Ruskai_2007.pdf`.
- I. Devetak, P. W. Shor, "The capacity of a quantum channel for simultaneous transmission of classical and quantum information", *Commun. Math. Phys.* 256 (2005), 287-303; quant-ph/0311131.
- T. S. Cubitt, M. B. Ruskai, G. Smith, "The structure of degradable quantum channels", *J. Math. Phys.* 49 (2008), 102104; arXiv:0802.1360. (Identified in the source PDF as [11] "in preparation".)
- A. S. Holevo, "On complementary channels and the additivity problem", *Probab. Theory Appl.* 51 (2007), 133-143; quant-ph/0509101.
- C. King, K. Matsumoto, M. Nathanson, M. B. Ruskai, "Properties of conjugate channels with applications to additivity and multiplicativity", quant-ph/0509126.
- M. M. Wolf, D. Pérez-García, "Quantum capacities of channels with small environment", *Phys. Rev. A* 75 (2007), 012303; quant-ph/0607070.
