# Reversibility of entanglement assisted coding

## Background

For classical channels Shannon's noisy-channel coding theorem assigns a single number — the capacity $C(T)$ — to each channel, and capacities multiply: $n$ parallel uses of $T$ can simulate $rn$ uses of an ideal bit channel with vanishing error iff $r < C(T)$. Crucially, the converse simulation is also possible (random coding), so any two classical channels with the same capacity are essentially interchangeable resources, and the resource theory of classical channels is "reversible".

For quantum channels without any auxiliary entanglement, this fails dramatically. The classical capacity $C(T,S_1)$ may be one, while the quantum capacity is zero — a classical bit channel cannot send qubits at all — so the comparison $C(T,S) \cdot C(S,T) \le C(T,T) = 1$ can be strict, and inequivalent channels can have the same classical capacity. The clean asymptotic equivalence of Shannon theory is lost.

If one provides the sender and receiver with arbitrary amounts of pre-shared entanglement for free, the situation becomes much more symmetric. Bennett, Shor, Smolin and Thapliyal (BSST) proved a single-letter formula for the entanglement-assisted classical capacity $C_{\mathrm{E}}(T)$ of any channel $T$, and this quantity behaves much more like a Shannon capacity than its un-assisted cousin. With free entanglement, an ideal classical bit channel and an ideal qubit channel become equivalent up to a factor of two: $C_{\mathrm{E}}(S_1,T_{\text{qubit}}) = 2$ (superdense coding) and $C_{\mathrm{E}}(T_{\text{qubit}},S_1) = 1/2$ (teleportation).

The conjectured "Reverse Shannon Theorem" of BSST asserts that with free entanglement the resource theory of quantum channels is fully reversible: any two channels with the same entanglement-assisted capacity can simulate each other at unit rate per bit of capacity. The present problem states the simplest non-trivial form of this conjecture.

## Status and known progress

- **Status:** solved by the Quantum Reverse Shannon Theorem (QRST).
- **Background.** The forward (achievability) coding theorem giving a formula for $C_{\mathrm{E}}(T) = C_{\mathrm{E}}(T, S_1)$ was proved by Bennett, Shor, Smolin and Thapliyal in 1999. The reverse Shannon theorem in the form above was formulated in their 2001 paper. At the time of the IMaPh snapshot the result was known only in the special case of a *known tensor-power source*, i.e. when the message channel $S$ emits the same, known density matrix at each time step; P. W. Shor (private communication, 2003) had been working on the *unknown* tensor-power case and on the *known tensor-product source* case (the density matrix is a tensor product, but the marginals may vary with time).
- **Resolution.** The full Quantum Reverse Shannon Theorem was proved by C. H. Bennett, I. Devetak, A. W. Harrow, P. W. Shor and A. Winter (announced 2009; published IEEE Trans. Inform. Theory 60, 2926 (2014); arXiv:0912.5537), with a one-shot approach by M. Berta, M. Christandl and R. Renner (Commun. Math. Phys. 306, 579 (2011); arXiv:0912.3805). Under the source's convention, $C_{\mathrm{E}}(T,S)$ counts how many uses of $T$ can be produced per use of $S$. The theorem therefore gives
  $$C_{\mathrm{E}}(T,S) \;=\; \frac{C_{\mathrm{E}}(S)}{C_{\mathrm{E}}(T)} \;=\; C_{\mathrm{E}}(S,T)^{-1}$$
  for every pair of memoryless channels in the i.i.d. asymptotic resource model. The ratio had been reversed in an earlier version of this entry; the reciprocal identity was unaffected. More general source models can require extra conventions about feedback or embezzling entanglement, so they should not be inferred from this statement without specifying the resources.
- **Subsequent refinements.** Work continues on refinements involving the precise resource cost (entanglement vs. classical communication), strong-converse rates and non-i.i.d./compound sources (e.g. Berta–Christandl–Renner 2011 strong-converse, Datta–Hsieh strong converse), but these are extensions beyond the formal statement of Problem 17.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005), Problem 17 on pp. 51–52; snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166.
- [BSST1] C. H. Bennett, P. W. Shor, J. A. Smolin, A. V. Thapliyal, *Entanglement-assisted classical capacity of noisy quantum channels*, Phys. Rev. Lett. 83, 3081 (1999); arXiv:quant-ph/9904023.
- [BSST2] C. H. Bennett, P. W. Shor, J. A. Smolin, A. V. Thapliyal, *Entanglement-assisted capacity of a quantum channel and the reverse Shannon theorem*, arXiv:quant-ph/0106052 (2001); published IEEE Trans. Inform. Theory 48, 2637 (2002).
- [SH] P. W. Shor, private communication (2003).
- C. H. Bennett, I. Devetak, A. W. Harrow, P. W. Shor, A. Winter, *The Quantum Reverse Shannon Theorem and Resource Tradeoffs for Simulating Quantum Channels*, IEEE Trans. Inform. Theory 60, 2926 (2014); arXiv:0912.5537.
- M. Berta, M. Christandl, R. Renner, *The Quantum Reverse Shannon Theorem Based on One-Shot Information Theory*, Commun. Math. Phys. 306, 579 (2011); arXiv:0912.3805.
