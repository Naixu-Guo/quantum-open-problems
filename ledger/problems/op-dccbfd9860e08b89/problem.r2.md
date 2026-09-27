---
id: "01M2M9FADN2Y21FW8M2PS654T2"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-16T06:50:03.694Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-algorithm"]
topicIds: ["computational-complexity-and-computability","matrix-and-entropy-inequalities"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M21S9FW14RJDR83J8D64FKEM"]
title: "Endpoint quantum KKL inequality for Boolean observables"
aliases: ["op-dccbfd9860e08b89","op_dccbfd9860e08b89","01M2M9FADN2Y21FW8M2PS654T2"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_dccbfd9860e08b89.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_dccbfd9860e08b89","ulid":"01M2M9FADN2Y21FW8M2PS654T2","aliases":["op_dccbfd9860e08b89","01M2M9FADN2Y21FW8M2PS654T2","op-dccbfd9860e08b89"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:46.805Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["computational-complexity-and-computability","matrix-and-entropy-inequalities"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M21S9FW14RJDR83J8D64FKEM"]},"title":"Endpoint quantum KKL inequality for Boolean observables","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Computational complexity and computability","Matrix and entropy inequalities"],"statement":"Does the Montanaro--Osborne $L^2$ quantum KKL inequality hold for every Boolean quantum observable?\n\nLet $A=A^\\dagger$ act on $n\\geq2$ qubits and satisfy $A^2=I$. Write $\\tau(A)=2^{-n}\\operatorname{Tr}A$, let $\\mathcal E_i$ completely depolarize qubit $i$, and define\n\n\\begin{equation}\n\\mathcal E_i(A)=\\frac{I_i}{2}\\otimes\\operatorname{Tr}_iA,\n\\qquad\nD_iA=A-\\mathcal E_i(A),\n\\qquad\n\\operatorname{Inf}^{(2)}_i(A)=\\tau[(D_iA)^\\dagger D_iA].\n\\label{eq:dccb-1}\n\\end{equation}\n\nDoes a universal constant $c>0$ exist such that every such $A$ satisfies\n\n\\begin{equation}\n\\max_i\\operatorname{Inf}^{(2)}_i(A)\n\\geq c\\bigl(1-\\tau(A)^2\\bigr)\\frac{\\log n}{n}?\n\\label{eq:dccb-2}\n\\end{equation}\n\nEquation~\\eqref{eq:dccb-2} uses the squared influences defined in Eq.~\\eqref{eq:dccb-1}; the balanced case has $\\tau(A)=0$.","source":"The question is explicitly posed or retained as open in the cited primary literature \\sourcecite{ref:dccb-montanaro08}{Montanaro08}\\sourcecite{ref:dccb-jiao24}{Jiao24}.  The statement is rewritten here to make its hypotheses and success criterion self-contained.","progress":["For diagonal observables $A=\\sum_x f(x)|x\\rangle\\langle x|$, the influence in Eq.~\\eqref{eq:dccb-1} reduces to the classical bit-flip influence, and Eq.~\\eqref{eq:dccb-2} becomes the classical KKL bound. The tensor-product quantum extension was proposed by Montanaro and Osborne \\sourcecite{ref:dccb-montanaro08}{Montanaro08}.","Rouzé, Wirth, and Zhang proved important quantum Talagrand, KKL-type, and Friedgut results using geometric or $L^p$ influences with $p<2$. Those results do not resolve the displayed endpoint. Jiao, Lin, Luo, and Zhou explicitly preserve this distinction and state that the Montanaro–Osborne conjecture remains open. \\sourcecite{ref:dccb-rouz24}{Rouz24}, \\sourcecite{ref:dccb-jiao24}{Jiao24}","The February 17, 2026 revision by Chang and Li develops further variance-decay and higher-order inequalities. Its relevant influence results remain sub-$L^2$; their constants do not give the required endpoint by simply taking $p\\to2$. \\sourcecite{ref:dccb-chang26}{Chang26}","An August 6, 2026 paper by Slote, Volberg, and Zhang provides another useful comparison. Its Hermitian-dilation family has small influences on the data qubits but an ancilla of influence one. Section 7 explicitly explains why this is not a counterexample to standard quantum KKL, which counts every qubit. \\sourcecite{ref:dccb-slote26}{Slote26}"],"references":[{"key":"Montanaro08","label":"ref:dccb-montanaro08","tex":"A. Montanaro and T. J. Osborne, \\emph{Quantum boolean functions}, arXiv:0810.2435 (2008); Chicago Journal of Theoretical Computer Science (2010). \\href{https://arxiv.org/abs/0810.2435}{Paper}."},{"key":"Jiao24","label":"ref:dccb-jiao24","tex":"Y. Jiao, W. Lin, S. Luo, and D. Zhou, \\emph{Quantum KKL-type inequalities revisited}, arXiv:2411.12399, November 2024, Introduction, including the explicit distinction between the CAR counterexample and the Montanaro–Osborne conjecture. \\href{https://arxiv.org/html/2411.12399}{Full text}. See Conjecture 1.4 for the displayed variance-weighted formulation."},{"key":"Rouz24","label":"ref:dccb-rouz24","tex":"C. Rouzé, M. Wirth, and H. Zhang, \\emph{Quantum Talagrand, KKL and Friedgut's theorems and the learnability of quantum Boolean functions}, arXiv:2209.07279; Communications in Mathematical Physics (2024). \\href{https://arxiv.org/abs/2209.07279}{Paper}."},{"key":"Chang26","label":"ref:dccb-chang26","tex":"F. Chang and P. Li, \\emph{Quantum Talagrand-type Inequalities via Variance Decay}, arXiv:2601.01900v2, February 17, 2026, Introduction and Section 4. \\href{https://arxiv.org/html/2601.01900v2}{Full text}."},{"key":"Slote26","label":"ref:dccb-slote26","tex":"J. Slote, A. Volberg, and H. Zhang, \\emph{Tightness of and counterexamples to several quantum estimates}, arXiv:2608.04411v2, August 6, 2026, Section 7, on the influential ancilla. \\href{https://arxiv.org/html/2608.04411v2}{Full text}."}],"comment":"Retained as unresolved, with 2026 partial-progress and counterexample checks. A counterexample in a canonical anticommutation-relation algebra uses a different coordinate structure and must not be substituted for a counterexample on the tensor-product qubit cube. \\sourcecite{ref:dccb-jiao24}{Jiao24}","contributors":[]}}
---
## Source

The question is explicitly posed or retained as open in the cited primary literature [Montanaro08](https://arxiv.org/abs/0810.2435)[Jiao24](https://arxiv.org/abs/2411.12399). The statement is rewritten here to make its hypotheses and success criterion self-contained.

## Progress

For diagonal observables $A=\sum_x f(x)|x\rangle\langle x|$, the influence in Eq. (1) reduces to the classical bit-flip influence, and Eq. (2) becomes the classical KKL bound. The tensor-product quantum extension was proposed by Montanaro and Osborne [Montanaro08](https://arxiv.org/abs/0810.2435).

Rouzé, Wirth, and Zhang proved important quantum Talagrand, KKL-type, and Friedgut results using geometric or $L^p$ influences with $p<2$. Those results do not resolve the displayed endpoint. Jiao, Lin, Luo, and Zhou explicitly preserve this distinction and state that the Montanaro–Osborne conjecture remains open. [Rouz24](https://arxiv.org/abs/2209.07279), [Jiao24](https://arxiv.org/abs/2411.12399)

The February 17, 2026 revision by Chang and Li develops further variance-decay and higher-order inequalities. Its relevant influence results remain sub-$L^2$; their constants do not give the required endpoint by simply taking $p\to2$. [Chang26](https://arxiv.org/abs/2601.01900v2)

An August 6, 2026 paper by Slote, Volberg, and Zhang provides another useful comparison. Its Hermitian-dilation family has small influences on the data qubits but an ancilla of influence one. Section 7 explicitly explains why this is not a counterexample to standard quantum KKL, which counts every qubit. [Slote26](https://arxiv.org/abs/2608.04411v2)

## Comment

Retained as unresolved, with 2026 partial-progress and counterexample checks. A counterexample in a canonical anticommutation-relation algebra uses a different coordinate structure and must not be substituted for a counterexample on the tensor-product qubit cube. [Jiao24](https://arxiv.org/abs/2411.12399)

## References

**Montanaro08** A. Montanaro and T. J. Osborne, *Quantum boolean functions*, arXiv:0810.2435 (2008); Chicago Journal of Theoretical Computer Science (2010). [Paper](https://arxiv.org/abs/0810.2435).

**Jiao24** Y. Jiao, W. Lin, S. Luo, and D. Zhou, *Quantum KKL-type inequalities revisited*, arXiv:2411.12399, November 2024, Introduction, including the explicit distinction between the CAR counterexample and the Montanaro–Osborne conjecture. [Full text](https://arxiv.org/html/2411.12399). See Conjecture 1.4 for the displayed variance-weighted formulation.

**Rouz24** C. Rouzé, M. Wirth, and H. Zhang, *Quantum Talagrand, KKL and Friedgut’s theorems and the learnability of quantum Boolean functions*, arXiv:2209.07279; Communications in Mathematical Physics (2024). [Paper](https://arxiv.org/abs/2209.07279).

**Chang26** F. Chang and P. Li, *Quantum Talagrand-type Inequalities via Variance Decay*, arXiv:2601.01900v2, February 17, 2026, Introduction and Section 4. [Full text](https://arxiv.org/html/2601.01900v2).

**Slote26** J. Slote, A. Volberg, and H. Zhang, *Tightness of and counterexamples to several quantum estimates*, arXiv:2608.04411v2, August 6, 2026, Section 7, on the influential ancilla. [Full text](https://arxiv.org/html/2608.04411v2).
