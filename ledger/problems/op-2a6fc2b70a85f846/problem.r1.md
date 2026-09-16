---
id: "01M2CZEFDTBM18B9Z7V4SRE05Y"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-13T09:04:40.250Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-error-correction"]
topicIds: ["quantum-coding-theory"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Maximal length of stabilizer quantum MDS codes"
aliases: ["op-2a6fc2b70a85f846","op_2a6fc2b70a85f846","01M2CZEFDTBM18B9Z7V4SRE05Y"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_2a6fc2b70a85f846.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_2a6fc2b70a85f846","ulid":"01M2CZEFDTBM18B9Z7V4SRE05Y","aliases":["op_2a6fc2b70a85f846","01M2CZEFDTBM18B9Z7V4SRE05Y","op-2a6fc2b70a85f846"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-13T08:51:52.378Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-error-correction"],"topicIds":["quantum-coding-theory"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Maximal length of stabilizer quantum MDS codes","status":"Unsolved","fields":["Quantum Error Correction"],"topics":["Quantum coding theory"],"statement":"Is there a stabilizer quantum maximum-distance-separable code $[[n,k,d]]_q$\nwith $k\\geq1$ and $d\\geq3$ whose length $n$ exceeds the conjectured limit\n$b(q,d)$ of Eq.~\\eqref{eq:qmds-limit}?  Let $q=p^{m}$ with $p$ prime and\n$m\\geq1$.  A stabilizer code $[[n,k,d]]_q$ is a $q^{k}$-dimensional subspace\nof $(\\mathbb{C}^{q})^{\\otimes n}$ that is the joint $+1$ eigenspace of an\nabelian subgroup of the $n$-qudit Pauli group containing no nontrivial\nmultiple of the identity, and whose minimum distance is $d$: it detects\nevery Pauli error acting on fewer than $d$ qudits and therefore exactly\ncorrects an arbitrary error on any $\\lfloor(d-1)/2\\rfloor$ qudits.  No\nentanglement assistance or other side resource is allowed.  Such a code is\nquantum maximum-distance-separable (QMDS) when it saturates the quantum\nSingleton bound,\n\\begin{equation}\n  n-k=2(d-1).\n  \\label{eq:qmds-singleton}\n\\end{equation}\nDefine the conjectured length limit\n\\begin{equation}\n  b(q,d):=\n  \\begin{cases}\n    q^{2}+2, & q\\text{ even and }d=4,\\\\\n    q^{2}+1, & \\text{otherwise}.\n  \\end{cases}\n  \\label{eq:qmds-limit}\n\\end{equation}\nThe question is whether some stabilizer code satisfying\nEq.~\\eqref{eq:qmds-singleton} with $k\\geq1$ and $d\\geq3$ has\n\\begin{equation}\n  n>b(q,d).\n  \\label{eq:qmds-length}\n\\end{equation}\nA complete answer is either an explicit stabilizer code satisfying\nEqs.~\\eqref{eq:qmds-singleton} and \\eqref{eq:qmds-length}, or a proof that\nEq.~\\eqref{eq:qmds-length} fails for every prime power $q$, every $d\\geq3$,\nand every $k\\geq1$, which establishes the quantum MDS conjecture for codes\nwith at least one logical qudit.","source":"Huber and Grassl state the quantum MDS conjecture explicitly as\nConjecture~12 and attribute it to Corollary~65 of Ketkar, Klappenecker,\nKumar, and Sarvepalli, where the length bound appears as a consequence of\nthe classical MDS conjecture \\sourcecite{ref:qmds-huber-grassl}{HG20},\n\\sourcecite{ref:qmds-ketkar}{KKKS06}.  The conjecture bounds the length of\nevery stabilizer QMDS code with $d\\geq3$ by Eq.~\\eqref{eq:qmds-limit}; this\nrecord asks for its proof or a stabilizer counterexample and restricts\nattention to codes with $k\\geq1$.","progress":["Huber and Grassl prove, for every QMDS code $((n,q^{k},d))_q$ with\n$d\\geq3$, stabilizer or not, the unconditional bound\n\\begin{equation}\n  n\\leq q^{2}+d-2,\n  \\qquad\\text{equivalently}\\qquad\n  n+k\\leq 2(q^{2}-1),\n  \\label{eq:qmds-huber-grassl-bound}\n\\end{equation}\nTheorem~10 of \\sourcecite{ref:qmds-huber-grassl}{HG20}.  For $d=3$ it gives\n$n\\leq q^{2}+1=b(q,3)$, and for $d=4$ with $q$ even it gives\n$n\\leq q^{2}+2=b(q,4)$, so Eq.~\\eqref{eq:qmds-length} is impossible in\nthese cases.  Huber and Grassl state that Conjecture~12 is otherwise\nunresolved for $d>3$: Eq.~\\eqref{eq:qmds-huber-grassl-bound} exceeds\n$b(q,d)$ by one for $d=4$ with $q$ odd and by $d-3$ for every $d\\geq5$.","The even-alphabet exception in Eq.~\\eqref{eq:qmds-limit} is necessary.\nGrassl and R\\\"otteler construct, for every $q=2^{m}$, stabilizer QMDS codes\nwith parameters\n\\begin{equation}\n  [[q^{2}+2,\\;q^{2}-4,\\;4]]_q,\n  \\label{eq:qmds-even-family}\n\\end{equation}\nTheorem~14 of \\sourcecite{ref:qmds-grassl-roetteler}{GR15}, which Huber and\nGrassl cite as the family meeting their $d=4$ bound\n\\sourcecite{ref:qmds-huber-grassl}{HG20}.  For $q\\geq4$ these codes have\n$k\\geq1$ and length $q^{2}+2>q^{2}+1$; for $q=2$ the family gives the\none-dimensional code $[[6,0,4]]_2$, outside the scope of this record.","Ball, Gamboa, and Lavrauw classify additive MDS codes over small fields,\nincluding $\\mathbb{F}_{4}$ and $\\mathbb{F}_{9}$, and deduce that the\nquantum MDS conjecture holds for\n\\begin{equation}\n  q\\in\\{2,3\\}\n  \\label{eq:qmds-small-alphabets}\n\\end{equation}\n\\sourcecite{ref:qmds-ball-gamboa-lavrauw}{BGL23}.  The classification\ncovers additive codes, not only codes linear over $\\mathbb{F}_{q^{2}}$, as\nthe stabilizer correspondence requires; it does not extend to other prime\npowers.","By Theorem~5.4 of \\sourcecite{ref:qmds-ball-centelles-huber}{BCH23}, a\nstabilizer code $[[n,k,d]]_q$ exists exactly when there is an additive code\n$C\\subseteq\\mathbb{F}_{q}^{2n}$ with $|C|=q^{n-k}$ contained in its\nsymplectic dual $C^{\\perp_a}$, with $d$ the minimum symplectic weight of\n$C^{\\perp_a}\\setminus C$.  QMDS codes are pure, Section~6.1 there, so the\nnormalizer code $C^{\\perp_a}$ itself has minimum symplectic weight $d$.\nUnder the coordinatewise identification of $\\mathbb{F}_{q}^{2n}$ with\n$\\mathbb{F}_{q^{2}}^{\\,n}$ used in the proof of Theorem~5.7 there,\nsymplectic weight becomes Hamming weight, so a stabilizer QMDS code yields\nan additive code $D\\subseteq\\mathbb{F}_{q^{2}}^{\\,n}$, closed under addition\nbut not necessarily $\\mathbb{F}_{q^{2}}$-linear, with\n\\begin{equation}\n  |D|=q^{n+k}=(q^{2})^{\\,n-d+1},\n  \\qquad\n  d_{\\mathrm{H}}(D)=d,\n  \\label{eq:qmds-additive-code}\n\\end{equation}\nwhere $d_{\\mathrm{H}}$ is the minimum Hamming distance; $D$ is an additive\nMDS code over $\\mathbb{F}_{q^{2}}$.  Ball, Centelles, and Huber point out\nthat Corollary~65 of \\sourcecite{ref:qmds-ketkar}{KKKS06} claims the\nquantum conjecture for stabilizer codes would follow from the classical MDS\nconjecture for linear codes, and correct it: the MDS conjecture for\nadditive codes over $\\mathbb{F}_{q^{2}}$ is what the argument needs,\nSection~6.2 and Research Problem~6 of\n\\sourcecite{ref:qmds-ball-centelles-huber}{BCH23}."],"references":[{"key":"HG20","label":"ref:qmds-huber-grassl","tex":"F. Huber and M. Grassl,\n  ``Quantum Codes of Maximal Distance and Highly Entangled Subspaces,''\n  \\emph{Quantum} \\textbf{4}, 284 (2020).\n  \\href{https://doi.org/10.22331/q-2020-06-18-284}{doi:10.22331/q-2020-06-18-284};\n  \\href{https://arxiv.org/abs/1907.07733}{arXiv:1907.07733}."},{"key":"KKKS06","label":"ref:qmds-ketkar","tex":"A. Ketkar, A. Klappenecker, S. Kumar, and P. K. Sarvepalli, ``Nonbinary\nstabilizer codes over finite fields,'' \\emph{IEEE Transactions on\nInformation Theory} \\textbf{52}, 4892--4914 (2006).\n\\href{https://doi.org/10.1109/TIT.2006.883612}{doi:10.1109/TIT.2006.883612};\n\\href{https://arxiv.org/abs/quant-ph/0508070}{arXiv:quant-ph/0508070}."},{"key":"GR15","label":"ref:qmds-grassl-roetteler","tex":"M. Grassl and M. R\\\"otteler, ``Quantum MDS codes over small fields,'' in\n\\emph{2015 IEEE International Symposium on Information Theory (ISIT)},\npp. 1104--1108 (2015).\n\\href{https://doi.org/10.1109/ISIT.2015.7282626}{doi:10.1109/ISIT.2015.7282626};\n\\href{https://arxiv.org/abs/1502.05267}{arXiv:1502.05267}."},{"key":"BGL23","label":"ref:qmds-ball-gamboa-lavrauw","tex":"S. Ball, G. Gamboa, and M. Lavrauw, ``On additive MDS codes over small\nfields,'' \\emph{Advances in Mathematics of Communications} \\textbf{17},\n828--844 (2023).\n\\href{https://doi.org/10.3934/amc.2021024}{doi:10.3934/amc.2021024};\n\\href{https://arxiv.org/abs/2012.06183}{arXiv:2012.06183}."},{"key":"BCH23","label":"ref:qmds-ball-centelles-huber","tex":"S. Ball, A. Centelles, and F. Huber, ``Quantum error-correcting codes and\ntheir geometries,'' \\emph{Annales de l'Institut Henri Poincar\\'e D}\n\\textbf{10}, 337--405 (2023).\n\\href{https://doi.org/10.4171/aihpd/160}{doi:10.4171/aihpd/160};\n\\href{https://arxiv.org/abs/2007.05992}{arXiv:2007.05992}."}],"comment":"The unresolved cases are $d=4$ with $q$ odd and every $d\\geq5$:\nEq.~\\eqref{eq:qmds-huber-grassl-bound} leaves a window above $b(q,d)$, and\nonly the alphabets in Eq.~\\eqref{eq:qmds-small-alphabets} are settled.  A\nstabilizer counterexample would give, through\nEq.~\\eqref{eq:qmds-additive-code}, an additive MDS code over\n$\\mathbb{F}_{q^{2}}$ longer than the additive MDS conjecture permits, so a\nproof of that classical conjecture would settle this problem; it is open\nbeyond small fields.  This record excludes one-dimensional code spaces,\n$k=0$, whose stabilizer QMDS codes are absolutely maximally entangled\nstabilizer states; the catalog's records on absolutely maximally entangled\nstates concern that case for arbitrary, not necessarily stabilizer,\nstates.  The record also does not extend the conjecture to nonstabilizer\nQMDS codes, which Huber and Grassl note could violate it even if the\nclassical conjecture holds \\sourcecite{ref:qmds-huber-grassl}{HG20}.","contributors":[]}}
---
## Source

Huber and Grassl state the quantum MDS conjecture explicitly as Conjecture 12 and attribute it to Corollary 65 of Ketkar, Klappenecker, Kumar, and Sarvepalli, where the length bound appears as a consequence of the classical MDS conjecture [HG20](https://doi.org/10.22331/q-2020-06-18-284), [KKKS06](https://doi.org/10.1109/TIT.2006.883612). The conjecture bounds the length of every stabilizer QMDS code with $d\geq3$ by Eq. (2); this record asks for its proof or a stabilizer counterexample and restricts attention to codes with $k\geq1$.

## Progress

Huber and Grassl prove, for every QMDS code $((n,q^{k},d))_q$ with $d\geq3$, stabilizer or not, the unconditional bound

$$
n\leq q^{2}+d-2,
 \qquad\text{equivalently}\qquad
 n+k\leq 2(q^{2}-1),
\tag{4}
$$

Theorem 10 of [HG20](https://doi.org/10.22331/q-2020-06-18-284). For $d=3$ it gives $n\leq q^{2}+1=b(q,3)$, and for $d=4$ with $q$ even it gives $n\leq q^{2}+2=b(q,4)$, so Eq. (3) is impossible in these cases. Huber and Grassl state that Conjecture 12 is otherwise unresolved for $d>3$: Eq. (4) exceeds $b(q,d)$ by one for $d=4$ with $q$ odd and by $d-3$ for every $d\geq5$.

The even-alphabet exception in Eq. (2) is necessary. Grassl and Rötteler construct, for every $q=2^{m}$, stabilizer QMDS codes with parameters

$$
[[q^{2}+2,\;q^{2}-4,\;4]]_q,
\tag{5}
$$

Theorem 14 of [GR15](https://doi.org/10.1109/ISIT.2015.7282626), which Huber and Grassl cite as the family meeting their $d=4$ bound [HG20](https://doi.org/10.22331/q-2020-06-18-284). For $q\geq4$ these codes have $k\geq1$ and length $q^{2}+2>q^{2}+1$; for $q=2$ the family gives the one-dimensional code $[[6,0,4]]_2$, outside the scope of this record.

Ball, Gamboa, and Lavrauw classify additive MDS codes over small fields, including $\mathbb{F}_{4}$ and $\mathbb{F}_{9}$, and deduce that the quantum MDS conjecture holds for

$$
q\in\{2,3\}
\tag{6}
$$

[BGL23](https://doi.org/10.3934/amc.2021024). The classification covers additive codes, not only codes linear over $\mathbb{F}_{q^{2}}$, as the stabilizer correspondence requires; it does not extend to other prime powers.

By Theorem 5.4 of [BCH23](https://doi.org/10.4171/aihpd/160), a stabilizer code $[[n,k,d]]_q$ exists exactly when there is an additive code $C\subseteq\mathbb{F}_{q}^{2n}$ with $|C|=q^{n-k}$ contained in its symplectic dual $C^{\perp_a}$, with $d$ the minimum symplectic weight of $C^{\perp_a}\setminus C$. QMDS codes are pure, Section 6.1 there, so the normalizer code $C^{\perp_a}$ itself has minimum symplectic weight $d$. Under the coordinatewise identification of $\mathbb{F}_{q}^{2n}$ with $\mathbb{F}_{q^{2}}^{\,n}$ used in the proof of Theorem 5.7 there, symplectic weight becomes Hamming weight, so a stabilizer QMDS code yields an additive code $D\subseteq\mathbb{F}_{q^{2}}^{\,n}$, closed under addition but not necessarily $\mathbb{F}_{q^{2}}$-linear, with

$$
|D|=q^{n+k}=(q^{2})^{\,n-d+1},
 \qquad
 d_{\mathrm{H}}(D)=d,
\tag{7}
$$

where $d_{\mathrm{H}}$ is the minimum Hamming distance; $D$ is an additive MDS code over $\mathbb{F}_{q^{2}}$. Ball, Centelles, and Huber point out that Corollary 65 of [KKKS06](https://doi.org/10.1109/TIT.2006.883612) claims the quantum conjecture for stabilizer codes would follow from the classical MDS conjecture for linear codes, and correct it: the MDS conjecture for additive codes over $\mathbb{F}_{q^{2}}$ is what the argument needs, Section 6.2 and Research Problem 6 of [BCH23](https://doi.org/10.4171/aihpd/160).

## Comment

The unresolved cases are $d=4$ with $q$ odd and every $d\geq5$: Eq. (4) leaves a window above $b(q,d)$, and only the alphabets in Eq. (6) are settled. A stabilizer counterexample would give, through Eq. (7), an additive MDS code over $\mathbb{F}_{q^{2}}$ longer than the additive MDS conjecture permits, so a proof of that classical conjecture would settle this problem; it is open beyond small fields. This record excludes one-dimensional code spaces, $k=0$, whose stabilizer QMDS codes are absolutely maximally entangled stabilizer states; the catalog’s records on absolutely maximally entangled states concern that case for arbitrary, not necessarily stabilizer, states. The record also does not extend the conjecture to nonstabilizer QMDS codes, which Huber and Grassl note could violate it even if the classical conjecture holds [HG20](https://doi.org/10.22331/q-2020-06-18-284).

## References

**HG20** F. Huber and M. Grassl, “Quantum Codes of Maximal Distance and Highly Entangled Subspaces,” *Quantum* **4**, 284 (2020). [doi:10.22331/q-2020-06-18-284](https://doi.org/10.22331/q-2020-06-18-284); [arXiv:1907.07733](https://arxiv.org/abs/1907.07733).

**KKKS06** A. Ketkar, A. Klappenecker, S. Kumar, and P. K. Sarvepalli, “Nonbinary stabilizer codes over finite fields,” *IEEE Transactions on Information Theory* **52**, 4892–4914 (2006). [doi:10.1109/TIT.2006.883612](https://doi.org/10.1109/TIT.2006.883612); [arXiv:quant-ph/0508070](https://arxiv.org/abs/quant-ph/0508070).

**GR15** M. Grassl and M. Rötteler, “Quantum MDS codes over small fields,” in *2015 IEEE International Symposium on Information Theory (ISIT)*, pp. 1104–1108 (2015). [doi:10.1109/ISIT.2015.7282626](https://doi.org/10.1109/ISIT.2015.7282626); [arXiv:1502.05267](https://arxiv.org/abs/1502.05267).

**BGL23** S. Ball, G. Gamboa, and M. Lavrauw, “On additive MDS codes over small fields,” *Advances in Mathematics of Communications* **17**, 828–844 (2023). [doi:10.3934/amc.2021024](https://doi.org/10.3934/amc.2021024); [arXiv:2012.06183](https://arxiv.org/abs/2012.06183).

**BCH23** S. Ball, A. Centelles, and F. Huber, “Quantum error-correcting codes and their geometries,” *Annales de l’Institut Henri Poincaré D* **10**, 337–405 (2023). [doi:10.4171/aihpd/160](https://doi.org/10.4171/aihpd/160); [arXiv:2007.05992](https://arxiv.org/abs/2007.05992).
