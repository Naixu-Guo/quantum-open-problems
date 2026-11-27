---
id: "01M2M9FCB1FHWBC06BEF4123WQ"
type: "Problem"
schemaVersion: "1.0"
revision: 3
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-11-27T00:12:45.225Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-algorithm"]
topicIds: ["random-circuit-sampling","quantum-circuit-complexity"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Exact spectral gap of random Pauli rotations"
aliases: ["op-aaf9791beced84e4","op_aaf9791beced84e4","01M2M9FCB1FHWBC06BEF4123WQ"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_aaf9791beced84e4.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_aaf9791beced84e4","ulid":"01M2M9FCB1FHWBC06BEF4123WQ","aliases":["op_aaf9791beced84e4","01M2M9FCB1FHWBC06BEF4123WQ","op-aaf9791beced84e4"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:48.769Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["random-circuit-sampling","quantum-circuit-complexity"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Exact spectral gap of random Pauli rotations","status":"Solved","fields":["Quantum algorithm"],"topics":["Random circuit sampling","Quantum circuit complexity"],"statement":"Is the exact Haar-mixing spectral gap of uniformly random Pauli rotations equal to $2^n(2^n-3)/(8(4^n-1))$ for every $n\\geq4$?\n\nLet $\\mathcal P_n=\\{I,X,Y,Z\\}^{\\otimes n}\\setminus\\{I^{\\otimes n}\\}$. One step chooses $P\\in\\mathcal P_n$ and $\\theta\\in[0,2\\pi)$ uniformly and applies $e^{i\\theta P}$. On $L^2(\\mathrm{SU}(2^n),\\mathrm{Haar})$, define\n\n\\begin{equation}\n(K_nf)(U)=\\mathbb E_{P,\\theta}f(e^{i\\theta P}U),\n\\qquad\n\\Delta_n=1-\\|K_n|_{L^2_0}\\|_{2\\to2},\n\\label{eq:aaf9-1}\n\\end{equation}\n\nwhere $L^2_0$ is the zero-Haar-mean subspace. The conjectured value of the gap in Eq.~\\eqref{eq:aaf9-1} is\n\n\\begin{equation}\n\\Delta_n=\\frac{2^n(2^n-3)}{8(4^n-1)}\n\\label{eq:aaf9-2}\n\\end{equation}\n\nDoes Eq.~\\eqref{eq:aaf9-2} hold for every $n\\geq4$?","source":"Baer and Haah posed this question as Conjecture 3.48 in the first version of their preprint. Their Definition 1.1 takes the gap over all finite-dimensional unitary representations of $\\mathrm{SU}(2^n)$. \\sourcecite{ref:aaf9-baer26}{Baer26}","progress":["For $n\\geq3$, Baer and Haah's Theorem 3.16 and Proposition 3.17 give\n  \\begin{equation}\n    \\frac{4^n+16}{16(4^n-1)}\\leq\\Delta_n\\leq\\frac{2^n(2^n-3)}{8(4^n-1)}.\n    \\label{eq:aaf9-3}\n  \\end{equation}\n  The upper bound in Eq.~\\eqref{eq:aaf9-3} comes from an eigenvalue in the balanced fourth moment $U^{\\otimes4}\\otimes\\overline U^{\\otimes4}$. \\sourcecite{ref:aaf9-baer26}{Baer26}","Baer and Haah determined the gap for $n\\leq3$, including $\\Delta_3=5/63$. At four qubits their bounds gave\n  \\begin{equation}\n    \\frac{1}{15}\\leq\\Delta_4\\leq\\frac{26}{255}.\n    \\label{eq:aaf9-4}\n  \\end{equation}\n  Their July 2026 preprint conjectured that the upper bound in Eq.~\\eqref{eq:aaf9-3} was attained for every $n\\geq3$. \\sourcecite{ref:aaf9-baer26}{Baer26}","Yuxuan Zhang gave a four-qubit counterexample. In $\\bigwedge^8\\mathbb C^{16}$, the sum of the basis wedges for the $30$ affine hyperplanes of $\\mathbb F_2^4$, each in ascending binary order, is an eigenvector of the averaged rotation with eigenvalue $14/15$. The corresponding mean-zero function on $\\mathrm{SU}(16)$ gives $\\Delta_4\\leq1/15$. The lower bound in Eq.~\\eqref{eq:aaf9-4} then gives $\\Delta_4=1/15$. \\sourcecite{ref:aaf9-zhang26}{Zha26} (\\href{https://github.com/Naixu-Guo/quantum-open-problems/issues/122}{GitHub \\#122}).","Dong and Fan subsequently determined both gaps. Writing $d=2^n$, their Theorem 3.1 gives\n  \\begin{equation}\n    \\begin{aligned}\n      \\Delta_{\\mathrm{SU}(d)} &= \\frac{d-8}{8(d-1)} && (n\\geq4),\\\\\n      \\Delta_{\\mathrm{PU}(d)} &= \\frac{d(d-3)}{8(d^2-1)} && (n\\geq3).\n    \\end{aligned}\n    \\label{eq:aaf9-exact-gaps}\n  \\end{equation}\n  The projective gap in Eq.~\\eqref{eq:aaf9-exact-gaps} is attained in the balanced fourth moment. \\sourcecite{ref:aaf9-dong-fan26}{DF26}"],"references":[{"key":"Baer26","label":"ref:aaf9-baer26","tex":"T. Baer and J. Haah, \"Random unitary circuits with constant spectral gap,\" arXiv preprint (2026), version 1, 23 July 2026. \\href{https://arxiv.org/abs/2607.20919v1}{arXiv:2607.20919v1}."},{"key":"Zha26","label":"ref:aaf9-zhang26","tex":"Y. Zhang, \"The spectral gap of random Pauli rotations on four qubits is $1/15$,\" Theorem 1 and Corollary 9, manuscript dated 28 September 2026. Manuscript 20 in \\emph{Agentic Proofs for QIQC: Collected Manuscripts}, version 1.2. \\href{https://zenodo.org/records/23032999/files/pauli-rotation-gap.pdf}{Manuscript PDF}."},{"key":"DF26","label":"ref:aaf9-dong-fan26","tex":"Z. Dong and X. Fan, \"Spectral gaps and slow modes of Pauli rotations and random quantum circuits,\" Theorem 3.1, version 2, 4 October 2026. \\href{https://arxiv.org/abs/2609.40164v2}{arXiv:2609.40164v2}."}],"comment":"The answer is no. At four qubits the Haar-mixing gap on $\\mathrm{SU}(16)$ is $1/15=17/255$, strictly below the $26/255$ predicted by Eq.~\\eqref{eq:aaf9-2}. The central element $e^{i\\pi/8}I$ acts by $-1$ on Zhang's eigenvector and by $+1$ on every balanced tensor moment. This explains how the projective walk can have the larger gap $26/255$. \\sourcecite{ref:aaf9-zhang26}{Zha26} \\sourcecite{ref:aaf9-dong-fan26}{DF26}","contributors":[]}}
---
## Source

Baer and Haah posed this question as Conjecture 3.48 in the first version of their preprint. Their Definition 1.1 takes the gap over all finite-dimensional unitary representations of $\mathrm{SU}(2^n)$. [Baer26](https://arxiv.org/abs/2607.20919v1)

## Progress

For $n\geq3$, Baer and Haah’s Theorem 3.16 and Proposition 3.17 give

$$
\frac{4^n+16}{16(4^n-1)}\leq\Delta_n\leq\frac{2^n(2^n-3)}{8(4^n-1)}.
 \tag{3}
$$

The upper bound in Eq. (3) comes from an eigenvalue in the balanced fourth moment $U^{\otimes4}\otimes\overline U^{\otimes4}$. [Baer26](https://arxiv.org/abs/2607.20919v1)

Baer and Haah determined the gap for $n\leq3$, including $\Delta_3=5/63$. At four qubits their bounds gave

$$
\frac{1}{15}\leq\Delta_4\leq\frac{26}{255}.
 \tag{4}
$$

Their July 2026 preprint conjectured that the upper bound in Eq. (3) was attained for every $n\geq3$. [Baer26](https://arxiv.org/abs/2607.20919v1)

Yuxuan Zhang gave a four-qubit counterexample. In $\bigwedge^8\mathbb C^{16}$, the sum of the basis wedges for the $30$ affine hyperplanes of $\mathbb F_2^4$, each in ascending binary order, is an eigenvector of the averaged rotation with eigenvalue $14/15$. The corresponding mean-zero function on $\mathrm{SU}(16)$ gives $\Delta_4\leq1/15$. The lower bound in Eq. (4) then gives $\Delta_4=1/15$. [Zha26](https://zenodo.org/records/23032999/files/pauli-rotation-gap.pdf) ([GitHub #122](https://github.com/Naixu-Guo/quantum-open-problems/issues/122)).

Dong and Fan subsequently determined both gaps. Writing $d=2^n$, their Theorem 3.1 gives

$$
\begin{aligned}
 \Delta_{\mathrm{SU}(d)} &= \frac{d-8}{8(d-1)} && (n\geq4),\\
 \Delta_{\mathrm{PU}(d)} &= \frac{d(d-3)}{8(d^2-1)} && (n\geq3).
 \end{aligned}
 \tag{5}
$$

The projective gap in Eq. (5) is attained in the balanced fourth moment. [DF26](https://arxiv.org/abs/2609.40164v2)

## Comment

The answer is no. At four qubits the Haar-mixing gap on $\mathrm{SU}(16)$ is $1/15=17/255$, strictly below the $26/255$ predicted by Eq. (2). The central element $e^{i\pi/8}I$ acts by $-1$ on Zhang’s eigenvector and by $+1$ on every balanced tensor moment. This explains how the projective walk can have the larger gap $26/255$. [Zha26](https://zenodo.org/records/23032999/files/pauli-rotation-gap.pdf) [DF26](https://arxiv.org/abs/2609.40164v2)

## References

**Baer26** T. Baer and J. Haah, "Random unitary circuits with constant spectral gap," arXiv preprint (2026), version 1, 23 July 2026. [arXiv:2607.20919v1](https://arxiv.org/abs/2607.20919v1).

**Zha26** Y. Zhang, "The spectral gap of random Pauli rotations on four qubits is $1/15$," Theorem 1 and Corollary 9, manuscript dated 28 September 2026. Manuscript 20 in *Agentic Proofs for QIQC: Collected Manuscripts*, version 1.2. [Manuscript PDF](https://zenodo.org/records/23032999/files/pauli-rotation-gap.pdf).

**DF26** Z. Dong and X. Fan, "Spectral gaps and slow modes of Pauli rotations and random quantum circuits," Theorem 3.1, version 2, 4 October 2026. [arXiv:2609.40164v2](https://arxiv.org/abs/2609.40164v2).
