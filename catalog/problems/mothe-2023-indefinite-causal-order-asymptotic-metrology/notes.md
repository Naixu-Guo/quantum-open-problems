# Asymptotic metrology with quantum-controlled causal order

## Background

Quantum channel-estimation strategies form several classes. Parallel protocols use all channel calls side by side. Adaptive protocols connect them in a fixed causal order. Causal-superposition protocols coherently superpose fixed orders. Quantum circuits with quantum control of causal order, abbreviated QC-QC, can change the order through a dynamical quantum control.

Kurdziałek, Górecki, Albarelli, and Demkowicz-Dobrzański proved that adaptive and causal-superposition protocols have no asymptotic advantage over parallel protocols for repeated uses of one finite-dimensional channel. Mothe, Branciard, and Abbott then found noisy channel families for which QC-QC protocols give a strict advantage at three channel uses. Their paper asks whether this higher class retains an advantage as the number of uses grows.

## Status and known progress

**Status: open.**

- The 2023 Physical Review Letters theorem proves asymptotic equivalence for parallel, adaptive, and causal-superposition strategies. Its recursion does not cover QC-QC.
- Mothe, Branciard, and Abbott prove strict finite-$N$ separations for noisy channel families. In their three-use examples, QC-QC outperforms causal superpositions and fixed-order strategies. They state the asymptotic QC-QC question in their discussion.
- Abbott, Mhalla, and Pocreau rule out a QC-QC query advantage when a task repeats one unitary channel. Any counterexample to the metrology statement must therefore use noise or a broader channel setting.
- Salzger and Vilasini prove that higher-order processes satisfying their spacetime, Acting Once, and Local Order assumptions reduce to QC-QC. Their result sharpens the physical scope of the question but supplies no asymptotic metrological bound.

No proof or counterexample for noisy finite-dimensional QC-QC metrology was located by 31 August 2026.

**Last verified:** 2026-08-31.

## Bibliography

- R. Mothe, C. Branciard, A. A. Abbott, *Reassessing the advantage of indefinite causal orders for quantum metrology*, Phys. Rev. A **109**, 062435 (2024); arXiv:2312.12172.
- S. Kurdziałek, W. Górecki, F. Albarelli, R. Demkowicz-Dobrzański, *Using Adaptiveness and Causal Superpositions Against Noise in Quantum Metrology*, Phys. Rev. Lett. **131**, 090801 (2023); arXiv:2212.08106.
- A. A. Abbott, M. Mhalla, P. Pocreau, *Quantum query complexity of Boolean functions under indefinite causal order*, Phys. Rev. Research **6**, L032020 (2024); arXiv:2307.10285.
- M. Salzger, V. Vilasini, *Higher-order quantum processes respecting closed labs in a spacetime have quantum controlled causal order*, arXiv:2605.08351 (2026).

Catalog source: GaugeForge, *Quantum Open Problem Killer*, entry `quantum_0055`. The audit uses the primary papers for the statement and status.
