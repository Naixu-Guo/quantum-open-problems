---
id: 01M1HME780WN0M1VEE85QCN11Q
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Additivity of minimal output (von Neumann) entropy of quantum channels
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - ruskai-2007-additivity-minimal-output-entropy
origin: source-stated
posed: "2007"
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
For a quantum channel $\Phi$, the minimal output entropy
$$S_{\min}(\Phi) \;=\; \inf_{\gamma}\, S\!\bigl[\Phi(\gamma)\bigr]$$
quantifies the worst-case purity of the output. Subadditivity gives
$$S_{\min}(\Phi\otimes\Omega) \;\le\; S_{\min}(\Phi)+S_{\min}(\Omega),$$
and the question of *equality* — i.e., that entanglement across the input of $\Phi\otimes\Omega$ cannot reduce the output entropy below the product-state minimum — became the central conjecture of the multiplicativity programme.

Shor (*Commun. Math. Phys.* 246 (2004), 453-472; quant-ph/0305035) showed that this additivity statement is *globally equivalent* to a constellation of other long-standing conjectures: additivity of the Holevo (classical) capacity $\chi^*$, additivity of the entanglement of formation $E_F$, and the so-called strong superadditivity of $E_F$. As of mid-2007, after counter-examples to the stronger $p>1$ multiplicativity conjecture had been announced by Winter (arXiv:0707.0402) and Hayden (arXiv:0707.3291), Ruskai noted in §5.6 that "one can ask whether or not additivity itself holds. It is worth recalling that the equivalent capacity conjecture was stated in [Bennett-Fuchs-Smolin] in a form that seemed to favor superadditivity. Thus, the ultimate open question is still..." and stated it as Problem 22. Closely related reductions were given by Fukuda (arXiv:quant-ph/0608010) and Fukuda-Wolf (arXiv:0704.1092), and earlier infinite-dimensional implications by Shirokov (arXiv:quant-ph/0408009, arXiv:quant-ph/0608090).

The conjecture was resolved — *negatively* — by Hastings in 2009.
