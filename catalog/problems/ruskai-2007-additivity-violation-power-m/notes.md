# Channel additive for $n<m$ tensor copies but violating additivity at $n=m$

## Background

For a quantum channel $\Phi$, the (Renyi) minimal output entropy $S^p_{\min}(\Phi)$ measures the worst-case output purity of $\Phi$. Subadditivity gives
$$S^p_{\min}(\Phi^{\otimes n}) \;\le\; n\,S^p_{\min}(\Phi)$$
for every $n\ge 1$, and additivity is the statement that equality holds for all $n$. All known counter-examples to additivity (Winter 2007 for $p>2$; Hayden 2007 for $1<p<2$; Hastings 2009 for $p=1$) exhibit channels for which the very first non-trivial product, $\Phi\otimes\Phi$ (or $\Phi\otimes\Omega$ between two distinct channels), already fails additivity. Equivalently, the violation appears at $n=2$.

A natural and surprisingly subtle structural question is whether this is forced. Is it conceivable that additivity holds for all "small" tensor powers — say for every $n<m$ — and then breaks at $n=m$? Such a channel would behave additively for two, three, ..., $m-1$ copies but acquire genuine multi-copy "superadditive" behaviour only when sufficiently many uses are coupled. Ruskai notes in particular that with current results one cannot even rule out the possibility that some non-unital qubit channel exhibits this kind of higher-power-only failure of additivity, and remarks (citing King and Koldan, arXiv:quant-ph/0512185) that multiplicativity (24) has only been proved for non-unital qubit maps when $p=2$ or $p\ge 4$. The status of additivity on three or more copies of a single small-dimensional channel is therefore genuinely uncertain.

A positive answer to the problem would expose a new "delayed-onset" mechanism for superadditivity. A negative answer would show that any failure of additivity already shows up at $n=2$, dramatically simplifying the search for counter-examples and tightening the connection between two-letter and many-letter additivity.

## Status and known progress

- No example of a channel with this "delayed-onset" additivity-violation pattern is known. All known counter-examples to additivity break at $n=2$ already.
- The source says only $m$ is an integer. If $m=2$ is allowed, equality is required only at the tautological one-copy level, so any self-channel two-copy counterexample solves the literal statement. Derksen and Lovitz, arXiv:2510.07547v2, give explicit self-channel violations for every $p>1$. The **open** label therefore applies to the intended delayed-onset problem $m\ge3$, with equality at every $n=2,\ldots,m-1$.
- For non-unital qubit channels, the question is wide open even at $n=2$ in many parameter regimes: multiplicativity of $\nu_p$ was proved by King and Koldan ("New multiplicativity results for qubit maps", arXiv:quant-ph/0512185) only for $p=2$ and $p\ge 4$. It is not known whether some non-unital qubit channel violates additivity for $\Phi^{\otimes m}$ at some $m\ge 2$.
- Hastings (2009, *Nature Physics* 5, 255-257; arXiv:0809.3972) disproved $p=1$ additivity for two copies of generic random channels; this does not address higher-$m$ behaviour for channels that happen to be additive at $n=2$.
- Fukuda and Wolf ("Simplifying additivity problems using direct sum constructions", arXiv:0704.1092) and Fukuda ("Simplification of additivity conjecture in quantum information theory", arXiv:quant-ph/0608010) discuss reductions among additivity questions but do not produce such a channel.
- The problem remains open as stated.
- **Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory" (arXiv:0708.1902 [quant-ph], 2007), based on the BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007. Problem 19, p. 16. DOI: 10.48550/arXiv.0708.1902. Source PDF: `Open Problems in Quantum Information Theory_Ruskai_2007.pdf`.
- C. King, N. Koldan, "New multiplicativity results for qubit maps", arXiv:quant-ph/0512185.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$", arXiv:0707.0402.
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false", arXiv:0707.3291.
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs", *Nature Physics* 5 (2009), 255-257; arXiv:0809.3972.
- M. Fukuda, "Simplification of additivity conjecture in quantum information theory", arXiv:quant-ph/0608010.
- M. Fukuda, M. M. Wolf, "Simplifying additivity problems using direct sum constructions", arXiv:0704.1092.
- H. Derksen, B. Lovitz, *Constructive counterexamples to the additivity of minimum output Rényi entropy of quantum channels for all $p>1$*, arXiv:2510.07547v2 (2026 preprint).
