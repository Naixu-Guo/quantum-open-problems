# Additivity of minimal output (von Neumann) entropy of quantum channels

> **Audit status (2026-08-12): SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d\times d$ complex matrices |
| $\Phi,\Omega$ | quantum channels (completely positive trace-preserving maps) on matrix algebras |
| $\Phi\otimes\Omega$ | tensor product channel on $M_{d_\Phi}\otimes M_{d_\Omega}$ |
| $\gamma$ | input density matrix, $\gamma\ge 0$, $\operatorname{Tr}\gamma=1$ |
| $S(\rho)$ | von Neumann entropy, $S(\rho)=-\operatorname{Tr}\rho\log\rho$ |
| $S_{\min}(\Phi)$ | minimal output entropy of $\Phi$, $S_{\min}(\Phi)=\inf_\gamma S[\Phi(\gamma)]$ |
| $\chi^*(\Phi)$ | Holevo (classical) capacity of $\Phi$ |
| $E_F$ | entanglement of formation |

## Background

For a quantum channel $\Phi$, the minimal output entropy
$$S_{\min}(\Phi) \;=\; \inf_{\gamma}\, S\!\bigl[\Phi(\gamma)\bigr]$$
quantifies the worst-case purity of the output. Subadditivity gives
$$S_{\min}(\Phi\otimes\Omega) \;\le\; S_{\min}(\Phi)+S_{\min}(\Omega),$$
and the question of *equality* — i.e., that entanglement across the input of $\Phi\otimes\Omega$ cannot reduce the output entropy below the product-state minimum — became the central conjecture of the multiplicativity programme.

Shor (*Commun. Math. Phys.* 246 (2004), 453-472; quant-ph/0305035) showed that this additivity statement is *globally equivalent* to a constellation of other long-standing conjectures: additivity of the Holevo (classical) capacity $\chi^*$, additivity of the entanglement of formation $E_F$, and the so-called strong superadditivity of $E_F$. As of mid-2007, after counter-examples to the stronger $p>1$ multiplicativity conjecture had been announced by Winter (arXiv:0707.0402) and Hayden (arXiv:0707.3291), Ruskai noted in §5.6 that "one can ask whether or not additivity itself holds. It is worth recalling that the equivalent capacity conjecture was stated in [Bennett-Fuchs-Smolin] in a form that seemed to favor superadditivity. Thus, the ultimate open question is still..." and stated it as Problem 22. Closely related reductions were given by Fukuda (arXiv:quant-ph/0608010) and Fukuda-Wolf (arXiv:0704.1092), and earlier infinite-dimensional implications by Shirokov (arXiv:quant-ph/0408009, arXiv:quant-ph/0608090).

The conjecture was resolved — *negatively* — by Hastings in 2009.

## Formal statement

**Problem 22 (Ruskai 2007).** Prove the additivity of minimal output entropy,
$$S_{\min}(\Phi\otimes\Omega) \;=\; S_{\min}(\Phi)+S_{\min}(\Omega) \tag{23}$$
for every pair of quantum channels $\Phi,\Omega$, or else find a counter-example.

## Status and known progress

**Resolved (negatively) in 2009.** M. B. Hastings, "Superadditivity of communication capacity using entangled inputs", *Nature Physics* 5 (2009), 255-257 (arXiv:0809.3972), disproved the conjecture by constructing pairs of random unitary channels $\Phi,\Omega$ (with $\Omega$ obtained from $\Phi$ via complex conjugation) for which the maximally entangled input $\frac{1}{\sqrt{d}}\sum_i|i\rangle|i\rangle$ achieves
$$S_{\min}(\Phi\otimes\Omega) \;<\; S_{\min}(\Phi)+S_{\min}(\Omega).$$
Hastings's argument uses concentration of measure for random unitary Kraus operators in very large dimension; the channel dimension required for the violation is large but finite. Via Shor's equivalence (quant-ph/0305035), this simultaneously refutes the additivity of Holevo capacity and of entanglement of formation.

Subsequent work has simplified and quantified the counter-example:
- F. G. S. L. Brandão, M. Horodecki, "On Hastings' counterexamples to the minimum output entropy additivity conjecture", *Open Syst. Inf. Dyn.* 17 (2010), 31-52 (arXiv:0907.3210), gave a more constructive version with sharper dimensional estimates.
- M. Fukuda, C. King, D. K. Moser, "Comments on Hastings' Additivity Counterexamples", *Commun. Math. Phys.* 296 (2010), 111-143 (arXiv:0905.3697), provided a detailed rigorous reworking.
- G. Aubrun, S. Szarek, E. Werner, "Hastings' additivity counterexample via Dvoretzky's theorem", *Commun. Math. Phys.* 305 (2011), 85-97 (arXiv:1003.4925), gave a conceptual proof via almost-Euclidean sections of Schatten spaces.
- Subsequent quantitative work (Belinschi-Collins-Nechita, Communications in Mathematical Physics 2012; arXiv:1206.5874) provides further constructions.

Despite the resolution at $p=1$, the *magnitude* of the violation is small and the dimensions required are enormous; the question of how much capacity superadditivity can occur, and for which channel families, remains a very active subject.

- **Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory" (arXiv:0708.1902 [quant-ph], 2007), based on the BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007. Problem 22, p. 16. DOI: 10.48550/arXiv.0708.1902. Source PDF: `Open Problems in Quantum Information Theory_Ruskai_2007.pdf`.
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs", *Nature Physics* 5 (2009), 255-257; arXiv:0809.3972. (*Resolution.*)
- P. W. Shor, "Equivalence of Additivity Questions in Quantum Information Theory", *Commun. Math. Phys.* 246 (2004), 453-472; quant-ph/0305035.
- C. H. Bennett, C. A. Fuchs, J. A. Smolin, "Entanglement-enhanced classical communication on a noisy quantum channel", in *Quantum Communication, Computing and Measurement*, Plenum Press (1997), 79-88; quant-ph/9611006.
- F. G. S. L. Brandão, M. Horodecki, "On Hastings' counterexamples to the minimum output entropy additivity conjecture", *Open Syst. Inf. Dyn.* 17 (2010), 31-52; arXiv:0907.3210.
- M. Fukuda, C. King, D. K. Moser, "Comments on Hastings' Additivity Counterexamples", *Commun. Math. Phys.* 296 (2010), 111-143; arXiv:0905.3697.
- G. Aubrun, S. Szarek, E. Werner, "Hastings' additivity counterexample via Dvoretzky's theorem", *Commun. Math. Phys.* 305 (2011), 85-97; arXiv:1003.4925.
- M. E. Shirokov, "The Holevo capacity of infinite dimensional channels and the additivity problem", *Commun. Math. Phys.* 262 (2006), 137-159; quant-ph/0408009.
- M. Fukuda, "Simplification of additivity conjecture in quantum information theory", arXiv:quant-ph/0608010.
- M. Fukuda, M. M. Wolf, "Simplifying additivity problems using direct sum constructions", arXiv:0704.1092.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$", arXiv:0707.0402 (2007).
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false", arXiv:0707.3291 (2007).
