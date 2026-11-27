---
id: "01M87VW3KK9MHKWVN7EDQD9V4N"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-11-27T01:42:25.991Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-information-theory"]
topicIds: ["quantum-capacity","quantum-coding-theory"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M22N8KM3DY3A60ZMT6VG3STQ","01M1Q787QRY0AKF1CQTFSQME12"]
title: "Low-rate reliability of the qubit erasure channel"
aliases: ["op-ebdd8afcc5dfa08c","op_ebdd8afcc5dfa08c","01M87VW3KK9MHKWVN7EDQD9V4N"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_ebdd8afcc5dfa08c.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_ebdd8afcc5dfa08c","ulid":"01M87VW3KK9MHKWVN7EDQD9V4N","aliases":["op_ebdd8afcc5dfa08c","01M87VW3KK9MHKWVN7EDQD9V4N","op-ebdd8afcc5dfa08c"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-11-24T22:47:23.507Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-information-theory"],"topicIds":["quantum-capacity","quantum-coding-theory"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M22N8KM3DY3A60ZMT6VG3STQ","01M1Q787QRY0AKF1CQTFSQME12"]},"title":"Low-rate reliability of the qubit erasure channel","status":"Unsolved","fields":["Quantum Information Theory"],"topics":["Quantum capacity","Quantum coding theory"],"statement":"The qubit erasure channel independently replaces each transmitted qubit with an orthogonal erasure flag with probability $p$. The other qubits arrive unchanged, and the receiver knows which positions were erased. Consider any $0<p<1/2$, so the unassisted quantum capacity is $\\mathcal{Q}(p)=1-2p$ qubits per channel use. At a target rate $0<r<\\mathcal{Q}(p)$, how fast can the error in transmitting entanglement decay?\n\nFor $n$ channel uses and a target rate $0<r\\leq 1$, the sender encodes $k$ logical qubits into $n$ physical qubits, with $\\lceil nr\\rceil\\leq k\\leq n$. The logical input is half of a maximally entangled state of Schmidt rank $2^k$, and the reference half stays untouched. The sender and receiver may use arbitrary joint encoding and decoding channels, without preshared entanglement, feedback, or auxiliary communication.\n\nLet $\\varepsilon_n(r,p)$ be the minimum entanglement infidelity over these codes. For each code, this error is one minus the overlap of the decoded system and reference with their original maximally entangled state, averaged over the erasures. Determine the upper reliability exponent $E(r,p)$ in Eq.~\\eqref{eq:erasure-low-exp} for every positive rate below capacity.\n\\begin{equation}\n E(r,p)=\\limsup_{n\\to\\infty}-\\frac{1}{n}\\ln\\varepsilon_n(r,p).\n \\label{eq:erasure-low-exp}\n\\end{equation}\n\nFor each $0<r<1$, the exact exponent remains open for erasure probabilities $0<p<(1-r)/(5+3r)$.","source":"Mao and Fang define the unassisted entanglement transmission problem in Sec.~2.1. They describe the dependence on both the erasure probability and the target rate in Sec.~3.3 and identify the open region in Sec.~4 \\sourcecite{ref:erasure-low-mao-fang}{MF26}.","progress":["For fixed $p$, the critical rate is $r_{\\mathrm{crit}}(p)=(1-5p)/(1+3p)$. At every positive rate below capacity with $r\\geq r_{\\mathrm{crit}}(p)$, Corollary~3.1 gives $E(r,p)=D_{\\mathrm{bin}}((1-r)/2\\|p)$, where $D_{\\mathrm{bin}}(a\\|b)=a\\ln(a/b)+(1-a)\\ln((1-a)/(1-b))$ is binary relative entropy in natural units. For $1/5\\leq p<1/2$, this formula covers every positive rate below capacity \\sourcecite{ref:erasure-low-mao-fang}{MF26}.","For $0<p<1/5$ and $0<r<r_{\\mathrm{crit}}(p)$, the lower bounds from random stabilizer coding and expurgation are strictly below the upper bound $D_{\\mathrm{bin}}((1-r)/2\\|p)$ for arbitrary codes (Propositions~3.2, 3.4, and 3.5). For example, at $r=1/5$ the exponent is open for $0<p<1/7$, and the exact formula applies for $1/7\\leq p<2/5$ \\sourcecite{ref:erasure-low-mao-fang}{MF26}."],"references":[{"key":"MF26","label":"ref:erasure-low-mao-fang","tex":"H. Mao and K. Fang, \\emph{Reliability of quantum communication over erasure channels} (2026). \\href{https://arxiv.org/abs/2611.24054v1}{arXiv:2611.24054v1}."},{"key":"CAS26","label":"ref:erasure-low-cas","tex":"C. Castro-Landolt, R. G. Ahmed, and G. Smith, \\emph{Optimal fidelity over zero-capacity erasure channels} (2026). \\href{https://arxiv.org/abs/2611.30902v1}{arXiv:2611.30902v1}."},{"key":"Wil26","label":"ref:erasure-low-wilde","tex":"M. M. Wilde, \\emph{Second-order asymptotics for the quantum and private capacities of the erasure channel} (2026). \\href{https://arxiv.org/abs/2611.32395v1}{arXiv:2611.32395v1}."}],"comment":"For fixed $p$, raising the target rate restricts the admissible codes, so $E(r,p)$ is nonincreasing in $r$. The known exponent tends to zero as $r$ approaches $\\mathcal{Q}(p)$ from below. Since the exponent is nonnegative, $E(r,p)=0$ for $\\mathcal{Q}(p)\\leq r\\leq 1$. The upper limit in Eq.~\\eqref{eq:erasure-low-exp} defines the exponent even when existence of a limit is unknown. Two other erasure-channel results address different limits. Castro-Landolt, Ahmed, and Smith determine the best asymptotic fidelity for fixed logical dimension and $p\\geq 1/2$ in Theorem~1 \\sourcecite{ref:erasure-low-cas}{CAS26}. Wilde determines the second-order coding rate at fixed infidelity in Theorem~3.1 \\sourcecite{ref:erasure-low-wilde}{Wil26}. The catalog and literature were checked through November 26, 2026.","contributors":[]}}
---
## Source

Mao and Fang define the unassisted entanglement transmission problem in Sec. 2.1. They describe the dependence on both the erasure probability and the target rate in Sec. 3.3 and identify the open region in Sec. 4 [MF26](https://arxiv.org/abs/2611.24054v1).

## Progress

For fixed $p$, the critical rate is $r_{\mathrm{crit}}(p)=(1-5p)/(1+3p)$. At every positive rate below capacity with $r\geq r_{\mathrm{crit}}(p)$, Corollary 3.1 gives $E(r,p)=D_{\mathrm{bin}}((1-r)/2\|p)$, where $D_{\mathrm{bin}}(a\|b)=a\ln(a/b)+(1-a)\ln((1-a)/(1-b))$ is binary relative entropy in natural units. For $1/5\leq p<1/2$, this formula covers every positive rate below capacity [MF26](https://arxiv.org/abs/2611.24054v1).

For $0<p<1/5$ and $0<r<r_{\mathrm{crit}}(p)$, the lower bounds from random stabilizer coding and expurgation are strictly below the upper bound $D_{\mathrm{bin}}((1-r)/2\|p)$ for arbitrary codes (Propositions 3.2, 3.4, and 3.5). For example, at $r=1/5$ the exponent is open for $0<p<1/7$, and the exact formula applies for $1/7\leq p<2/5$ [MF26](https://arxiv.org/abs/2611.24054v1).

## Comment

For fixed $p$, raising the target rate restricts the admissible codes, so $E(r,p)$ is nonincreasing in $r$. The known exponent tends to zero as $r$ approaches $\mathcal{Q}(p)$ from below. Since the exponent is nonnegative, $E(r,p)=0$ for $\mathcal{Q}(p)\leq r\leq 1$. The upper limit in Eq. (1) defines the exponent even when existence of a limit is unknown. Two other erasure-channel results address different limits. Castro-Landolt, Ahmed, and Smith determine the best asymptotic fidelity for fixed logical dimension and $p\geq 1/2$ in Theorem 1 [CAS26](https://arxiv.org/abs/2611.30902v1). Wilde determines the second-order coding rate at fixed infidelity in Theorem 3.1 [Wil26](https://arxiv.org/abs/2611.32395v1). The catalog and literature were checked through November 26, 2026.

## References

**MF26** H. Mao and K. Fang, *Reliability of quantum communication over erasure channels* (2026). [arXiv:2611.24054v1](https://arxiv.org/abs/2611.24054v1).

**CAS26** C. Castro-Landolt, R. G. Ahmed, and G. Smith, *Optimal fidelity over zero-capacity erasure channels* (2026). [arXiv:2611.30902v1](https://arxiv.org/abs/2611.30902v1).

**Wil26** M. M. Wilde, *Second-order asymptotics for the quantum and private capacities of the erasure channel* (2026). [arXiv:2611.32395v1](https://arxiv.org/abs/2611.32395v1).
