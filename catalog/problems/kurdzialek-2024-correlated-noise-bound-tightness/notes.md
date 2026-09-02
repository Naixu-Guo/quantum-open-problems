# Tightness of asymptotic metrology bounds under correlated noise

## Background

Kurdziałek, Albarelli, and Demkowicz-Dobrzański model correlated sensing channels as a quantum comb. Their exact comb quantum Fisher information is a semidefinite program whose size grows exponentially with the number of channel uses. They replace that calculation with upper bounds built from blocks of $m$ comb teeth. The resulting programs remain usable in the large-$N$ limit.

The construction gives the controller access to environmental information at block boundaries and purifies intermediate states. Both relaxations can raise the upper bound above the precision of any physical adaptive protocol. The authors prove that larger blocks tighten the bound, including its asymptotic coefficient, but they state that the bounds need not be tight in general.

This entry turns that stated limitation into a precise completeness question. The source paper does not present the convergence statement below as a named conjecture.

## Status and known progress

**Status: open.**

- The 2025 Physical Review Letters paper derives the block bounds and proves that increasing $m$ tightens them. It also states that the bounds are not generally tight.
- For perpendicular correlated dephasing, the computed upper bounds agree across the tested block sizes and an adaptive tensor-network protocol approaches them. This gives numerical evidence for tightness in that model.
- For parallel correlated dephasing, a gap remains between the computed upper bounds and restricted-ancilla lower bounds. Current numerics do not decide whether the upper bound or the trial strategy causes the gap.
- No cited theorem proves convergence of the block hierarchy to the physical optimum, and no finite-dimensional model has a proved strict asymptotic gap.

The open status and the narrower formulation above were checked against the source paper and later search results on 31 August 2026.

**Last verified:** 2026-08-31.

## Bibliography

- S. Kurdziałek, F. Albarelli, R. Demkowicz-Dobrzański, *Universal Bounds for Quantum Metrology in the Presence of Correlated Noise*, Phys. Rev. Lett. **135**, 130801 (2025); arXiv:2410.01881.
- S. Kurdziałek, P. Dulian, J. Majsak, S. Chakraborty, R. Demkowicz-Dobrzański, *Quantum metrology using quantum combs and tensor network formalism*, New J. Phys. **27**, 013019 (2025); arXiv:2403.04854.
- S. Zhou, L. Jiang, *Asymptotic theory of quantum channel estimation*, PRX Quantum **2**, 010343 (2021); arXiv:2003.10559.

Catalog source: GaugeForge, *Quantum Open Problem Killer*, entry `quantum_0056`. The audit uses the primary papers for the statement and status.
