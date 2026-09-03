---
id: 01M1HME7807T6WSEAJB0636M35
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Reversibility of entanglement assisted coding
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-reversibility-entanglement-assisted-coding
origin: source-stated
posed: 2003-01-31
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
For classical channels Shannon's noisy-channel coding theorem assigns a single number — the capacity $C(T)$ — to each channel, and capacities multiply: $n$ parallel uses of $T$ can simulate $rn$ uses of an ideal bit channel with vanishing error iff $r < C(T)$. Crucially, the converse simulation is also possible (random coding), so any two classical channels with the same capacity are essentially interchangeable resources, and the resource theory of classical channels is "reversible".

For quantum channels without any auxiliary entanglement, this fails dramatically. The classical capacity $C(T,S_1)$ may be one, while the quantum capacity is zero — a classical bit channel cannot send qubits at all — so the comparison $C(T,S) \cdot C(S,T) \le C(T,T) = 1$ can be strict, and inequivalent channels can have the same classical capacity. The clean asymptotic equivalence of Shannon theory is lost.

If one provides the sender and receiver with arbitrary amounts of pre-shared entanglement for free, the situation becomes much more symmetric. Bennett, Shor, Smolin and Thapliyal (BSST) proved a single-letter formula for the entanglement-assisted classical capacity $C_{\mathrm{E}}(T)$ of any channel $T$, and this quantity behaves much more like a Shannon capacity than its un-assisted cousin. With free entanglement, an ideal classical bit channel and an ideal qubit channel become equivalent up to a factor of two: $C_{\mathrm{E}}(S_1,T_{\text{qubit}}) = 2$ (superdense coding) and $C_{\mathrm{E}}(T_{\text{qubit}},S_1) = 1/2$ (teleportation).

The conjectured "Reverse Shannon Theorem" of BSST asserts that with free entanglement the resource theory of quantum channels is fully reversible: any two channels with the same entanglement-assisted capacity can simulate each other at unit rate per bit of capacity. The present problem states the simplest non-trivial form of this conjecture.
