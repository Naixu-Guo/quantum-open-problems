---
id: "01M2JD6D42ZF21JR0CXSY184XW"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-15T18:45:29.941Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-error-correction"]
topicIds: ["quantum-coding-theory"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M2JD6D1YCESPTHQZDT5TZB77"]
title: "Optimal dimension of seven-qubit distance-two codes"
aliases: ["op-5ea7cb9abb281829","op_5ea7cb9abb281829","01M2JD6D42ZF21JR0CXSY184XW"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_5ea7cb9abb281829.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_5ea7cb9abb281829","ulid":"01M2JD6D42ZF21JR0CXSY184XW","aliases":["op_5ea7cb9abb281829","01M2JD6D42ZF21JR0CXSY184XW","op-5ea7cb9abb281829"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-15T11:28:20.098Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-error-correction"],"topicIds":["quantum-coding-theory"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M2JD6D1YCESPTHQZDT5TZB77"]},"title":"Optimal dimension of seven-qubit distance-two codes","status":"Unsolved","fields":["Quantum Error Correction"],"topics":["Quantum coding theory"],"statement":"For an exact seven-qubit code that detects every single-qubit error, what is\nthe largest possible code-space dimension: is $K_{\\max}^{(2)}(7,2)$ equal to\n$24$, $25$, or $26$?  Let $\\mathcal P_7:=\\{I,X,Y,Z\\}^{\\otimes7}$ be the Pauli\nbasis, where the weight $\\operatorname{wt}(E)$ counts nonidentity tensor\nfactors, and define\n\\begin{equation}\n  K_{\\max}^{(2)}(7,2):=\\max\\Bigl\\{\\operatorname{rank}P:\\\n  P=P^\\dagger=P^2\\ \\text{on}\\ (\\mathbb C^2)^{\\otimes7},\\\n  PEP=c_EP\\ \\text{for every}\\ E\\in\\mathcal P_7\\ \\text{with}\\\n  \\operatorname{wt}(E)=1\\Bigr\\},\n  \\label{eq:5ea7-kmax}\n\\end{equation}\nwhere each $c_E$ is a scalar depending only on $E$.  The maximum in\nEq.~\\eqref{eq:5ea7-kmax} is over all projectors, including degenerate, impure,\nand non-CWS codes.  A distance-two code detects an arbitrary single-qubit error\nand corrects an erasure at a known location; it need not correct an arbitrary\nsingle-qubit error at an unknown location.","source":"Derived from the gap between the construction and the linear-programming\nbound of Rains \\sourcecite{ref:5ea7-rains}{Rai99}, recorded as $24$--$26$ in\nTable~III of \\sourcecite{ref:5ea7-roj}{ROJ19} and in Table~1 of\n\\sourcecite{ref:5ea7-amh}{AMH26}.  No source located states a conjecture about\nthe value of $K_{\\max}^{(2)}(7,2)$.","progress":["Rains's Theorem~4 gives pure codes\n  \\begin{equation}\n    ((2m+1,\\,3\\cdot2^{2m-3},\\,2))_2,\\qquad m\\geq2,\n    \\label{eq:5ea7-family}\n  \\end{equation}\n  obtained inductively from Lemma~5, which turns a pure $((n,K,2))_2$ code into a\n  pure $((n+2,4K,2))_2$ code (numbering of the arXiv version).  Setting $m=3$ in\n  Eq.~\\eqref{eq:5ea7-family} gives a $((7,24,2))_2$ code; since $24$ is not a\n  power of two, this code is non-additive\n  \\sourcecite{ref:5ea7-rains}{Rai99}.","Rains's Theorem~2 shows that every $((2m+1,K,2))_2$ code satisfies\n  \\begin{equation}\n    K\\leq4^{m-1}\\Bigl(2-\\frac1m\\Bigr),\n    \\label{eq:5ea7-bound}\n  \\end{equation}\n  and that this agrees with the full linear-programming bound.  For seven qubits\n  ($m=3$), Eq.~\\eqref{eq:5ea7-bound} gives $K\\leq80/3$, hence $K\\leq26$.  His\n  Theorem~3 shows that the bound is not attained at the lengths $2^i+1$ with\n  $i\\geq3$, where it is an integer, and he remarks that the argument cannot\n  strengthen the bound beyond nonattainment.  At seven qubits the bound is not\n  an integer, so this argument gives nothing further\n  \\sourcecite{ref:5ea7-rains}{Rai99}.","The exact rational semidefinite-programming certificates of Angl\\`es Munn\\'e\n  and Huber do not improve this case: their Table~1 (called Table~4.1 in the\n  text of Section~4.2) still lists $24$--$26$ for block length $7$ and distance\n  $2$ \\sourcecite{ref:5ea7-amh}{AMH26}.","Rigby, Olivier, and Jarvis report an exhaustive search over seven-vertex\n  graphs up to local complementation and isomorphism: seven classes yield\n  distance-two codeword-stabilized (CWS) codes of dimension $24$, and none yields\n  dimension $25$ or $26$ (Section~III-A).  A code of dimension $25$ or $26$\n  would therefore lie outside the CWS framework\n  \\sourcecite{ref:5ea7-roj}{ROJ19}.","The two open existence questions are nested.  If $P$ is the projector of a\n  $((7,26,2))_2$ code and $P'$ projects onto any $25$-dimensional subspace of its\n  range, then $P'=P'P=PP'$ and\n  \\begin{equation}\n    P'EP'=P'(PEP)P'=c_EP'\n    \\qquad(\\operatorname{wt}(E)=1),\n    \\label{eq:5ea7-subcode}\n  \\end{equation}\n  so $P'$ is a $((7,25,2))_2$ code.  Hence nonexistence at dimension $25$ implies\n  $K_{\\max}^{(2)}(7,2)=24$, whereas existence at dimension $25$ leaves dimension\n  $26$ to decide.  Neither dimension arises as a subcode of a seven-qubit\n  distance-two stabilizer code, since such codes have dimension at most $16$\n  (Table~II of \\sourcecite{ref:5ea7-roj}{ROJ19})."],"references":[{"key":"Rai99","label":"ref:5ea7-rains","tex":"E. M. Rains, ``Quantum codes of minimum distance two,'' \\emph{IEEE Transactions on Information Theory} \\textbf{45}(1), 266--271 (1999). \\href{https://doi.org/10.1109/18.746807}{doi:10.1109/18.746807}; \\href{https://arxiv.org/abs/quant-ph/9704043}{arXiv:quant-ph/9704043}."},{"key":"AMH26","label":"ref:5ea7-amh","tex":"G. Angl\\`es Munn\\'e and F. Huber, ``SDP bounds on quantum codes: rational certificates,'' arXiv:2603.19901 (2026). \\href{https://doi.org/10.48550/arXiv.2603.19901}{doi:10.48550/arXiv.2603.19901}; \\href{https://arxiv.org/abs/2603.19901}{arXiv:2603.19901}."},{"key":"ROJ19","label":"ref:5ea7-roj","tex":"A. Rigby, J. C. Olivier, and P. Jarvis, ``Heuristic construction of codeword stabilized codes,'' \\emph{Physical Review A} \\textbf{100}, 062303 (2019). \\href{https://doi.org/10.1103/PhysRevA.100.062303}{doi:10.1103/PhysRevA.100.062303}; \\href{https://arxiv.org/abs/1907.04537}{arXiv:1907.04537}."}],"comment":"Literature checked through 15 September 2026: no $((7,25,2))_2$ or\n$((7,26,2))_2$ code and no exclusion of either was located, so\n$K_{\\max}^{(2)}(7,2)\\in\\{24,25,26\\}$ remains open.  The problem is the gap\nbetween an exact construction and the surviving general upper bound; no source\nattributes a conjecture $K_{\\max}^{(2)}(7,2)=24$.  The error constraints in\nEq.~\\eqref{eq:5ea7-kmax} involve only the $21$ weight-one Pauli operators on a\n$128$-dimensional space, but they are coupled to the nonlinear condition\n$P^2=P$, so counting variables and constraints proves neither existence nor\nnonexistence.  By Eq.~\\eqref{eq:5ea7-subcode}, a certified exclusion of rank\n$25$ would settle the problem, whereas searches confined to CWS codes cannot go\nbeyond $24$.  The analogous question for nine qubits and distance three is\n\\href{https://qiqc-op.com/problem/op_0d6ac674da115857/}{the optimal dimension of\nnine-qubit distance-three codes}.","contributors":[]}}
---
## Source

Derived from the gap between the construction and the linear-programming bound of Rains [Rai99](https://doi.org/10.1109/18.746807), recorded as $24$–$26$ in Table III of [ROJ19](https://doi.org/10.1103/PhysRevA.100.062303) and in Table 1 of [AMH26](https://doi.org/10.48550/arXiv.2603.19901). No source located states a conjecture about the value of $K_{\max}^{(2)}(7,2)$.

## Progress

Rains’s Theorem 4 gives pure codes

$$
((2m+1,\,3\cdot2^{2m-3},\,2))_2,\qquad m\geq2,
 \tag{2}
$$

obtained inductively from Lemma 5, which turns a pure $((n,K,2))_2$ code into a pure $((n+2,4K,2))_2$ code (numbering of the arXiv version). Setting $m=3$ in Eq. (2) gives a $((7,24,2))_2$ code; since $24$ is not a power of two, this code is non-additive [Rai99](https://doi.org/10.1109/18.746807).

Rains’s Theorem 2 shows that every $((2m+1,K,2))_2$ code satisfies

$$
K\leq4^{m-1}\Bigl(2-\frac1m\Bigr),
 \tag{3}
$$

and that this agrees with the full linear-programming bound. For seven qubits ($m=3$), Eq. (3) gives $K\leq80/3$, hence $K\leq26$. His Theorem 3 shows that the bound is not attained at the lengths $2^i+1$ with $i\geq3$, where it is an integer, and he remarks that the argument cannot strengthen the bound beyond nonattainment. At seven qubits the bound is not an integer, so this argument gives nothing further [Rai99](https://doi.org/10.1109/18.746807).

The exact rational semidefinite-programming certificates of Anglès Munné and Huber do not improve this case: their Table 1 (called Table 4.1 in the text of Section 4.2) still lists $24$–$26$ for block length $7$ and distance $2$ [AMH26](https://doi.org/10.48550/arXiv.2603.19901).

Rigby, Olivier, and Jarvis report an exhaustive search over seven-vertex graphs up to local complementation and isomorphism: seven classes yield distance-two codeword-stabilized (CWS) codes of dimension $24$, and none yields dimension $25$ or $26$ (Section III-A). A code of dimension $25$ or $26$ would therefore lie outside the CWS framework [ROJ19](https://doi.org/10.1103/PhysRevA.100.062303).

The two open existence questions are nested. If $P$ is the projector of a $((7,26,2))_2$ code and $P'$ projects onto any $25$-dimensional subspace of its range, then $P'=P'P=PP'$ and

$$
P'EP'=P'(PEP)P'=c_EP'
 \qquad(\operatorname{wt}(E)=1),
 \tag{4}
$$

so $P'$ is a $((7,25,2))_2$ code. Hence nonexistence at dimension $25$ implies $K_{\max}^{(2)}(7,2)=24$, whereas existence at dimension $25$ leaves dimension $26$ to decide. Neither dimension arises as a subcode of a seven-qubit distance-two stabilizer code, since such codes have dimension at most $16$ (Table II of [ROJ19](https://doi.org/10.1103/PhysRevA.100.062303)).

## Comment

Literature checked through 15 September 2026: no $((7,25,2))_2$ or $((7,26,2))_2$ code and no exclusion of either was located, so $K_{\max}^{(2)}(7,2)\in\{24,25,26\}$ remains open. The problem is the gap between an exact construction and the surviving general upper bound; no source attributes a conjecture $K_{\max}^{(2)}(7,2)=24$. The error constraints in Eq. (1) involve only the $21$ weight-one Pauli operators on a $128$-dimensional space, but they are coupled to the nonlinear condition $P^2=P$, so counting variables and constraints proves neither existence nor nonexistence. By Eq. (4), a certified exclusion of rank $25$ would settle the problem, whereas searches confined to CWS codes cannot go beyond $24$. The analogous question for nine qubits and distance three is [the optimal dimension of nine-qubit distance-three codes](https://qiqc-op.com/problem/op_0d6ac674da115857/).

## References

**Rai99** E. M. Rains, “Quantum codes of minimum distance two,” *IEEE Transactions on Information Theory* **45**(1), 266–271 (1999). [doi:10.1109/18.746807](https://doi.org/10.1109/18.746807); [arXiv:quant-ph/9704043](https://arxiv.org/abs/quant-ph/9704043).

**AMH26** G. Anglès Munné and F. Huber, “SDP bounds on quantum codes: rational certificates,” arXiv:2603.19901 (2026). [doi:10.48550/arXiv.2603.19901](https://doi.org/10.48550/arXiv.2603.19901); [arXiv:2603.19901](https://arxiv.org/abs/2603.19901).

**ROJ19** A. Rigby, J. C. Olivier, and P. Jarvis, “Heuristic construction of codeword stabilized codes,” *Physical Review A* **100**, 062303 (2019). [doi:10.1103/PhysRevA.100.062303](https://doi.org/10.1103/PhysRevA.100.062303); [arXiv:1907.04537](https://arxiv.org/abs/1907.04537).
