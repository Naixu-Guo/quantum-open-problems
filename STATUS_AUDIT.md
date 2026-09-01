# Quantum open-problem status audit

**Cutoff:** 12 August 2026
**Scope:** the original 53-entry quantum-information corpus
**Baseline result:** 20 solved, 10 partially solved, 23 open

## Additions after the baseline audit

On 31 August 2026, the GaugeForge catalog comparison found two problems absent from this repository. Both concern quantum sensing and remain open after a check of the primary papers and later results.

| Added entry | Provenance | Audit finding |
|---|---|---|
| `kurdzialek-2024-correlated-noise-bound-tightness` | Derived question | Kurdziałek, Albarelli, and Demkowicz-Dobrzański state that their correlated-noise bounds need not be tight and that larger blocks improve them. The added entry asks whether the block hierarchy converges to the achievable asymptotic precision. This narrower statement is an audit formulation, not a conjecture quoted from the authors ([Phys. Rev. Lett. 135, 130801](https://doi.org/10.1103/jy3v-wkcb)). |
| `mothe-2023-indefinite-causal-order-asymptotic-metrology` | Source-stated question | Mothe, Branciard, and Abbott explicitly leave open whether quantum-controlled causal order can retain a metrological advantage asymptotically. Their strict separation uses three channel calls and does not settle the large-use limit ([Phys. Rev. A 109, 062435](https://doi.org/10.1103/PhysRevA.109.062435)). |

After the GaugeForge additions, the catalog had 55 entries: 25 open, 10 partially solved, and 20 solved. These additions do not change the 12 August baseline classifications below.

## TheoremDB review and taxonomy correction

The 31 August review searched TheoremDB's full 2,124-entry public index, then checked each quantum candidate against its linked sources. Three entries met the catalog's source and status requirements:

| Added entry | Field | Audit finding |
|---|---|---|
| `theoremdb-p42-quantum-pcp-conjecture` | Quantum computation | The standard constant-gap Local Hamiltonian conjecture remains open. NLTS is proved, but it does not give the required QMA-hardness theorem ([Buhrman, Helsen, and Weggemans](https://arxiv.org/abs/2403.04841); [Anshu, Breuckmann, and Nirkhe](https://arxiv.org/abs/2206.13228)). |
| `theoremdb-p36-yang-mills-mass-gap` | Quantum field theory | Clay lists the official existence-and-mass-gap problem as unsolved. The June 2026 arXiv resolution claim has not completed journal or Clay review ([Clay Mathematics Institute](https://www.claymath.org/millennium/yang-mills-the-maths-gap/); [arXiv:2606.19362](https://arxiv.org/abs/2606.19362)). |
| `theoremdb-p3114-kashaev-volume-conjecture` | Quantum topology | Kashaev's volume formula is proved for selected knots and families, but no universal proof or counterexample for hyperbolic knots was located ([Kashaev](https://doi.org/10.1023/A:1007364912784); [TheoremDB P3114](https://www.theoremdb.org/statements/P3114/)). |

Four candidates were not imported:

| TheoremDB entry | Decision |
|---|---|
| `P46` Zauner's conjecture | Duplicate of `krueger-2005-sic-povm-zauner-conjecture`. |
| `P3566` Uniform Exponential Quantum Parallel Repetition | TheoremDB records a complete answer awaiting independent review and gives no external mathematical reference. |
| `P11578` Twice-prime XX-chain momentum sums | The record gives no external mathematical reference. |
| `P3668` Petersen-graph Heisenberg ground polynomial | The record says its status remains unverified and gives no external mathematical reference. |

The earlier field split also overstated the source material. All active entries inherited from the Horodecki, Krueger–Werner, and Ruskai quantum-information lists now belong to `Quantum information`. Their topic labels remain available for filtering. Entries from separate sensing, computation, field-theory, and quantum-topology sources use their respective fields.

The current catalog has 58 entries: 28 open, 10 partially solved, and 20 solved. The website displays 38 active entries across five research fields.

## How the labels were assigned

- **Solved** means the exact statement in the archived problem has a proof or counterexample. A negative answer counts as solved.
- **Partially solved** means a genuine part of a multi-part problem, or a major precisely stated subclass, is settled while the full statement remains undecided.
- **Open** means the exact universal, existential, or construction question still has neither a proof nor a counterexample. Related examples do not turn a universal yes/no question into “partial.”

Primary papers and journal versions were preferred. Recent arXiv claims were checked against their actual theorem statements, revision or withdrawal notices, and later peer-reviewed literature. A current arXiv preprint is not treated as peer reviewed merely because it has an arXiv DOI.

Of the 20 solved entries, 19 rest on peer-reviewed results or an elementary consequence of peer-reviewed results. The exception is the two-copy Werner-state problem. It is labeled solved at preprint level because four concurrent July 2026 manuscripts give exact proofs of the same sharp theorem. The label and the individual entry state that none had completed journal review by the cutoff.

## Status changes

The archive began with 12 solved, 7 partially solved, and 34 open entries. Fifteen labels changed:

| Entry | Old | Audited | Reason |
|---|---:|---:|---|
| `horodecki-2020-werner-2-copy-distillability` | open | solved | Four concurrent exact July 2026 proofs |
| `krueger-2005-bell-inequalities-all-quantum-states` | open | solved | Both subproblems have finite exact counterexamples |
| `krueger-2005-cglmp-inequalities-power` | open | partially solved | Part A is false; Part B remains open |
| `krueger-2005-continuity-quantum-channel-capacity` | partially solved | solved | Ordinary unassisted quantum capacity is continuous in finite dimension |
| `krueger-2005-maximally-entangled-mixed-states` | open | solved | Universal maximizer disproved |
| `krueger-2005-qubit-bi-negativity` | open | solved | Exact two-qubit positivity theorem |
| `krueger-2005-reversible-entanglement-manipulation` | open | partially solved | PPT reversibility is false; smallest reversible class is unresolved |
| `krueger-2005-secret-key-entangled-states` | partially solved | open | The exact universal yes/no question remains undecided |
| `krueger-2005-stronger-bell-werner-states` | open | solved | Many-setting inequality improves on CHSH |
| `ruskai-2007-convex-decompositions-cpt-maps` | open | partially solved | Major input-dimension and channel-class subcases proved |
| `ruskai-2007-explicit-multiplicativity-violations` | partially solved | solved | The literal request for an explicit example is met |
| `ruskai-2007-extreme-points-cpt-maps` | open | partially solved | General quotient parameterization and low-dimensional classifications exist |
| `ruskai-2007-local-invariants-n-representability` | open | partially solved | Stable graph-indexed invariant families exist; finite mixed problem remains |
| `ruskai-2007-multiplicativity-p2-channel-classes` | open | partially solved | Significant positive channel classes are known |
| `ruskai-2007-multiplicativity-violation-both-sides` | open | solved | A fixed Hastings pair works on both sides of (p=1) by continuity |

## Horodecki problems

| Problem | Status | Detailed finding and decisive evidence |
|---|---:|---|
| MUBs in dimension six | **Open** | Neither a fourth MUB nor an accepted proof excluding seven is known. A peer-reviewed 2026 review still states both questions as open ([McNulty and Weigert](https://arxiv.org/abs/2410.23997)). Joka's [arXiv:2511.03537](https://arxiv.org/abs/2511.03537) claim is unrefereed and has concrete gaps discussed below. |
| NPT bound entanglement | **Open** | The July two-copy Werner theorem does not decide three or more copies or all-copy undistillability. The newest relevant manuscript, [arXiv:2608.08836](https://arxiv.org/abs/2608.08836), proves that selected candidates become distillable at two copies; it removes candidates rather than constructs NPT bound entanglement. |
| Quantum Latin squares of order six | **Solved** | Rather et al. give an exact pair of orthogonal quantum Latin squares, an AME\((4,6)\) state, and a 2-unitary matrix ([arXiv:2104.05122](https://arxiv.org/abs/2104.05122), PRL 128, 080507). Numerical iteration was the discovery method; the published construction and verification are exact. |
| SIC-POVMs in infinitely many dimensions | **Open** | Appleby, Flammia and Kopp's all-dimension construction is conditional on two unproved arithmetic conjectures ([arXiv:2501.03970](https://arxiv.org/abs/2501.03970)). Joka's claimed proof was withdrawn with an explicit notice that its proof is incorrect ([arXiv:2601.13475](https://arxiv.org/abs/2601.13475)). |
| Two-copy distillability of \(\rho(4,-1/2)\) | **Solved, preprint-level** | Fu, Gao and Park prove that a Werner state is two-copy distillable exactly when it is one-copy distillable ([arXiv:2607.21367](https://arxiv.org/abs/2607.21367)). Three other July manuscripts prove the same threshold: [Song and Chen](https://arxiv.org/abs/2607.23416), [Fraser et al.](https://arxiv.org/abs/2607.24309), and [Bharti et al.](https://arxiv.org/abs/2607.24479). This settles two copies only. |

## Krueger problems

| Problem | Status | Detailed finding and decisive evidence |
|---|---:|---|
| Additivity of classical capacity and related quantities | **Solved, negative** | Hastings disproved universal minimum-output-entropy additivity ([arXiv:0809.3972](https://arxiv.org/abs/0809.3972)); Shor's equivalence theorem transfers the universal failure to the Holevo/additivity questions ([quant-ph/0305035](https://arxiv.org/abs/quant-ph/0305035)). This is an existence statement, not a claim that every channel is nonadditive. |
| Additivity of entanglement of formation | **Solved, negative** | Shor's universal equivalence plus Hastings settles the universal statement. It does not supply a simple hand-written state in the Hastings paper itself. |
| All Bell inequalities | **Open** | Complete facet enumeration is known only in small or restricted scenarios. A 2026 sampling paper explicitly sacrifices completeness because general enumeration is intractable ([arXiv:2604.22859](https://arxiv.org/abs/2604.22859)). Werner-Wolf classifies only a restricted full-correlation, two-dichotomic-setting family ([quant-ph/0102024](https://arxiv.org/abs/quant-ph/0102024)). |
| Asymptotic cloning versus state estimation | **Solved** | Bae and Acín prove equality of optimal asymptotic cloning fidelity and measure-and-prepare/state-estimation fidelity for arbitrary pure-state ensembles ([quant-ph/0603078](https://arxiv.org/abs/quant-ph/0603078)). Their fixed-input-copy theorem covers the archived limit. |
| Bell inequalities holding for all quantum states | **Solved, negative** | Part A is refuted by Slofstra's binary-output Clifford-algebra games, whose optimal correlations require local dimension above the outcome number ([arXiv:1007.2248](https://arxiv.org/abs/1007.2248)). Part B is refuted by tight GYNI inequalities with quantum value equal to the classical value but a larger no-signalling value ([arXiv:1003.3844](https://arxiv.org/abs/1003.3844), [arXiv:1112.3238](https://arxiv.org/abs/1112.3238)). |
| Bell inequalities for distant vacuum regions | **Open** | Entanglement harvesting at arbitrary separation and hidden nonlocality after local filtering do not prove direct CHSH violation by bounded distant regions. Reznik, Retzker and Silman require filtering for the Bell violation ([quant-ph/0310058](https://arxiv.org/abs/quant-ph/0310058)). |
| Bell violation by tensoring | **Solved** | Navascués and Vértesi construct CHSH-local states whose tensor product violates CHSH, including self-activation examples ([arXiv:1010.5191](https://arxiv.org/abs/1010.5191)). |
| Catalytic majorization | **Partially solved** | Klimesh and Turgut give exact necessary-and-sufficient infinite families for trumping ([arXiv:0709.3680](https://arxiv.org/abs/0709.3680), [arXiv:0707.0444](https://arxiv.org/abs/0707.0444)). The archive asks for a similarly efficient criterion. A 2026 paper supplies finite sufficient tests and explicitly contrasts them with computationally infeasible exact tests ([Communications Physics](https://www.nature.com/articles/s42005-026-02583-x)). |
| Power of CGLMP inequalities | **Partially solved** | Bancal, Gisin and Pironio found genuine four-outcome facets in the \((2,2,4)\) scenario that are neither CGLMP nor lower-outcome liftings, refuting Part A ([arXiv:1004.4146](https://arxiv.org/abs/1004.4146)). The full Fourier-measurement and simultaneous-optimality statement in Part B remains open. |
| Complexity of product preparations | **Open** | No general asymptotic formula or strict collective per-copy saving is known in Knill's actual cost model, \(\inf\sum_j|\phi_j|\) for Pauli rotations \(e^{i\phi_j\sigma_{u_j}}\). Ordinary Clifford+T or gate-count results use a different resource measure. |
| Continuity of quantum channel capacity | **Solved** | Leung and Smith prove global finite-dimensional continuity of ordinary unassisted quantum capacity in diamond norm ([arXiv:0810.4931](https://arxiv.org/abs/0810.4931), CMP 2009). In finite dimension this matches the dual cb-norm formulation. Caveats for two-way or feedback-assisted capacities are different questions. |
| Entanglement of formation for Gaussian states | **Partially solved** | Adesso's 3 August 2026 v1 proves equality with Gaussian entanglement of formation for every two-mode state and bisymmetric multimode states ([arXiv:2608.01909](https://arxiv.org/abs/2608.01909)). Generic nonsymmetric multimode Gaussian states remain open. This is a recent unrefereed preprint. |
| Local equivalence of graph states | **Solved, negative** | Ji et al. give an exact 27-qubit LU-equivalent but non-LC-equivalent pair ([arXiv:0709.1266](https://arxiv.org/abs/0709.1266)). Claudet's March 2026 preprint claims and proves minimality through 26 qubits ([arXiv:2603.25219](https://arxiv.org/abs/2603.25219)); that refinement is not yet peer reviewed. |
| Lockable two-way distillable entanglement and key | **Open** | Locking of one-way distillable entanglement, Eve-side information, or restricted irreducible private states does not settle Alice/Bob locking of two-way \(D\) and arbitrary-state \(K_D\). HHHO's nearby results are in [quant-ph/0404096](https://arxiv.org/abs/quant-ph/0404096); the distinction is explicit in [quant-ph/0608199](https://arxiv.org/abs/quant-ph/0608199). |
| Maximally entangled mixed states for a fixed spectrum | **Solved, negative** | De Vicente gives a rank-two two-qubit spectrum for which no state is convertible to every isospectral state even by non-entangling operations, ruling out one state that maximizes every monotone ([arXiv:2402.05673](https://arxiv.org/abs/2402.05673), PRL 2024). A 2026 peer-reviewed extension is [arXiv:2511.08285](https://arxiv.org/abs/2511.08285). |
| Mutually unbiased bases in general | **Open** | The maximal number in non-prime-power dimensions is unknown. Dimension six remains the first unresolved case; the recent claim audit is the same as in the Horodecki MUB row. |
| Nice error bases | **Solved, negative** | Klappenecker and Rötteler construct nice error bases not equivalent to any shift-and-multiply basis ([quant-ph/0301078](https://arxiv.org/abs/quant-ph/0301078)). Equivalence includes conjugation, rephasing and relabeling. |
| Polynomial entanglement invariants | **Solved for completeness** | Compact-group invariant theory implies polynomial invariants separate finite-dimensional local-unitary orbits; the source itself records Sudbery's solution. Practical minimal generators and a single separability polynomial are separate requests. The four-qubit SLOCC result has nine families with continuous parameters, not nine individual orbits ([quant-ph/0109033](https://arxiv.org/abs/quant-ph/0109033)). |
| Qubit binegativity | **Solved, affirmative** | Ishizaka proves \(|\rho^{T_B}|^{T_B}\ge0\) for every two-qubit state ([quant-ph/0308056](https://arxiv.org/abs/quant-ph/0308056), PRA 69, 020301(R)). This is operator positivity, not merely nonnegativity of a scalar negativity. |
| Two-qubit relative entropy of entanglement | **Open** | No general closed formula for arbitrary two-qubit mixed states is known. Miranowicz and Ishizaka solve an inverse construction and special families ([arXiv:0805.3134](https://arxiv.org/abs/0805.3134)); PPT and separable minimizations coincide in \(2\times2\). |
| Reduction criterion implies majorization | **Solved** | Hiroshima proves the implication exactly ([quant-ph/0303057](https://arxiv.org/abs/quant-ph/0303057)). |
| Reversibility of entanglement-assisted channel coding | **Solved** | The quantum reverse Shannon theorem establishes reversibility in the intended memoryless, entanglement-assisted resource model ([arXiv:0912.5537](https://arxiv.org/abs/0912.5537), [arXiv:0912.3805](https://arxiv.org/abs/0912.3805)). Under the source's convention, \(C_E(T,S)=C_E(S)/C_E(T)\); the archived explanation had the ratio reversed. |
| Reversible entanglement manipulation | **Partially solved** | PPT operations are not universally reversible: Wang and Duan give PPT cost greater than PPT distillable entanglement ([arXiv:1606.09421](https://arxiv.org/abs/1606.09421)). Irreversibility persists even under exact non-entangling maps ([arXiv:2111.02438](https://arxiv.org/abs/2111.02438), Nature Physics 2023). The smallest meaningful reversible class remains uncharacterized. |
| Secret key from every entangled state | **Open** | No proof says every entangled state has \(K_D>0\), and no entangled state is known with a proved \(K_D=0\). Positive-key PPT states were background, not a partial resolution of the universal quantifier. A peer-reviewed 2026 paper still treats zero-key entangled states as unresolved ([Quantum 2026](https://quantum-journal.org/papers/q-2026-05-06-2098/)). |
| Separability from spectrum | **Partially solved** | Johnston characterizes absolute separability for every \(2\times n\) system and proves APPT equals absolute separability there ([arXiv:1309.2006](https://arxiv.org/abs/1309.2006)). General \(m,n\ge3\) remains open. The 2024 \(4\times n\) claim proves an APPT criterion but silently substitutes absolute separability, so it is not accepted ([arXiv:2408.11684](https://arxiv.org/abs/2408.11684)). |
| SIC-POVMs and Zauner's conjecture | **Open** | Unconditional SIC existence, Weyl-Heisenberg-covariant existence, and Zauner-symmetric existence in every dimension remain unproved. The 2025 construction is conditional and the 2026 claimed proof was withdrawn; see the Horodecki SIC row. |
| Stronger Bell inequalities for Werner states | **Solved** | Vértesi gives a many-setting inequality violated by two-qubit Werner states for \(p>0.7056\), below the CHSH threshold \(1/\sqrt2\) ([arXiv:0806.0096](https://arxiv.org/abs/0806.0096), PRA 78, 032112). |
| Tough error models | **Open** | No exact \(c(e,n)\) or matching worst-case construction is known. The source lower bound is \(n/[e^2(e^2+1)]\), of order \(n/e^4\), not the previously transcribed \(n/[e^2(e+1)]\). The upper bound remains \(\lceil n/e\rceil\) ([quant-ph/9908066](https://arxiv.org/abs/quant-ph/9908066)). |
| Undistillability implies PPT | **Open** | This is the NPT-bound-entanglement problem. The July two-copy Werner solution and August special-family results do not establish all-copy undistillability. See [arXiv:2608.02647](https://arxiv.org/abs/2608.02647), [arXiv:2608.03710](https://arxiv.org/abs/2608.03710), and [arXiv:2608.08836](https://arxiv.org/abs/2608.08836) for the precise restricted advances. |

## Ruskai problems

| Problem | Status | Detailed finding and decisive evidence |
|---|---:|---|
| Additivity of minimum output von Neumann entropy | **Solved, negative** | Hastings gives a strict finite-dimensional counterexample ([arXiv:0809.3972](https://arxiv.org/abs/0809.3972), Nature Physics 2009). The entangled input used in the proof witnesses the violation; it need not be described as a proved unique global minimizer. |
| Additivity until the \(m\)-th tensor power | **Open, intended \(m\ge3\) form** | No delayed-onset example is known. The local wording was corrected to \(m\ge3\): at \(m=2\), the only required equality is the tautological one-copy equality, and any self-channel two-copy counterexample solves the literal version. Derksen and Lovitz give such explicit self-channel examples for all \(p>1\) ([arXiv:2510.07547](https://arxiv.org/abs/2510.07547), unrefereed). |
| CB entropy and coherent information of multiplicativity counterexamples | **Open** | Devetak, Junge, King and Ruskai define the CB quantities and prove forward implications, not the requested converse structure of every counterexample ([quant-ph/0506196](https://arxiv.org/abs/quant-ph/0506196)). “Zero coherent information” must specify whether it means a channel maximum, an input value, or capacity. |
| Audenaert-Ruskai convex decomposition of CPT maps | **Partially solved** | Kumar and Wolf prove the strong equal-weight form for every qubit-input channel, cq and qc channels, and a nonzero-measure set in all dimensions, plus the weak form for \(3\to3\) channels ([arXiv:2607.23066](https://arxiv.org/abs/2607.23066), 25 July 2026 v1). The general conjecture remains open. |
| Explicit multiplicativity violations | **Solved** | The literal problem asks for an explicit example at some \(p\ne1\). Werner-Holevo already supplies one at large \(p\); Cubitt et al. give a peer-reviewed explicit \(p=0\) example ([arXiv:0712.3628](https://arxiv.org/abs/0712.3628)); constructive \(p>2\) families appear in [arXiv:0911.2515](https://arxiv.org/abs/0911.2515). Derksen-Lovitz now gives explicit same-channel examples for every \(p>1\), but remains unrefereed. |
| Classify or parameterize extreme CPT maps | **Partially solved** | Friedland and Loewy classify important low-dimensional cases ([arXiv:1309.5898](https://arxiv.org/abs/1309.5898)). Iten and Colbeck give a general fixed-rank Stiefel-quotient parameterization and smooth-manifold description ([arXiv:1610.02513](https://arxiv.org/abs/1610.02513)). A useful qubit-style canonical classification for arbitrary dimensions is still absent. |
| Local invariants and \(N\)-representability | **Partially solved** | Vrana constructs systematic dimension-stable invariant families and a graph-indexed free stable algebra ([arXiv:1007.0163](https://arxiv.org/abs/1007.0163), [arXiv:1107.2438](https://arxiv.org/abs/1107.2438)). These do not give a finite-dimensional minimal complete set for arbitrary mixed symmetric or antisymmetric two-particle density matrices, nor solve \(N\)-representability. |
| More multiplicativity counterexamples | **Solved** | Hayden and Winter prove counterexamples for every \(p>1\), including \(p=2\), in the final peer-reviewed paper ([arXiv:0807.4753](https://arxiv.org/abs/0807.4753)). Restricted channel-class questions survive. |
| Channel classes with multiplicativity at \(p=2\) | **Partially solved** | This is an open-ended classification program. A substantial post-survey class is PPT-inducing channels tensored with an arbitrary channel ([arXiv:0803.0479](https://arxiv.org/abs/0803.0479), PRA 2008). No exhaustive classification exists, and general \(p=2\) multiplicativity is false. |
| One pair violating Rényi additivity on both sides of \(p=1\) | **Solved** | Let \(G(p)\) be the additivity gap for a fixed finite-dimensional Hastings pair. Minimum output Rényi entropy is continuous jointly through \(p=1\), and minimization over a compact input set preserves continuity. Since \(G(1)<0\), the same pair has \(G(p)<0\) for \(p<1\) and \(p>1\) sufficiently close to one. [arXiv:2607.15210](https://arxiv.org/abs/2607.15210) records the observation and proves wider existence ranges, but the continuity argument needs only Hastings. |
| Mutually degradable channel pairs | **Open, intended nontrivial form** | Literal wording has trivial identity/arbitrary and identical-degradable pairs. No distinct nontrivial pair of the intended kind, preferably with neither channel individually degradable, was located. Cubitt, Ruskai and Smith formalize the related structure and leave nontrivial examples open ([arXiv:0802.1360](https://arxiv.org/abs/0802.1360)). |
| New extreme CPT classes with additivity | **Open** | New extreme families have been studied, but no decisive new class with the requested output-entropy additivity theorem was found. General counterexamples do not answer this positive-class search. Haagerup, Musat and Ruskai give relevant newer extreme families without the requested resolution ([arXiv:2006.03414](https://arxiv.org/abs/2006.03414)). |
| Polarized near-maximally-mixed channels | **Open** | General random-channel counterexamples do not settle the structured family \(x\mathcal I+(1-x)M_\epsilon\) or the requested dependence on \(x,\epsilon,p\). The norm hidden in the source's definition of “near” is itself unspecified. |
| Random sub-unitary coherent information | **Open under intended formulation** | No full degradability, coherent-information or capacity analysis was located for the intended cyclic rank-\((d-1)\) family. The source's printed Kraus formula is not trace preserving; see the convention note below. |
| Counterexamples inside the random sub-unitary family | **Open under intended formulation** | Counterexamples among unrestricted random channels do not show that this structured family contains new ones. No verified family-specific construction was located. The printed Kraus formula must first be interpreted as its intended normalized cyclic construction. |
| Maximally entangled relative maxima for random sub-unitary channels | **Open under intended formulation** | Nathanson's analytical critical-point result and Shor's private numerical relative-maximum evidence concern the Werner-Holevo special case only ([quant-ph/0611106](https://arxiv.org/abs/quant-ph/0611106)). They do not settle arbitrary \(U_k\). |
| Random sub-unitary multiplicativity at \(p=2\) | **Open under intended formulation** | No full-family proof or counterexample was found. Michalakis proves \(p=2\) only for two identical polarized Werner-Holevo channels, a different structured family ([arXiv:0707.1722](https://arxiv.org/abs/0707.1722)). |
| Direct proof for the two-Pauli qubit channel | **Open as a proof-method request** | King's unital-qubit theorem already proves multiplicativity, but by the negative-multiplier unitary-equivalence route that this problem excludes. No alternative proof of the requested type was located. Amosov's [quant-ph/0605177](https://arxiv.org/abs/quant-ph/0605177) proves a von Neumann-entropy statement, not the requested maximal-output \(p\)-norm theorem. |
| Polarized Werner-Holevo multiplicativity | **Partially solved** | Michalakis proves two identical polarized channels at \(p=2\) ([arXiv:0707.1722](https://arxiv.org/abs/0707.1722)); Datta proves the unpolarized endpoint for \(1\le p\le2\) ([quant-ph/0410063](https://arxiv.org/abs/quant-ph/0410063)). The full polarized \((x,p)\) range remains open. |

## Recent-claim watchlist

### Accepted as a resolution, with an explicit maturity warning

- **Two-copy Werner-state distillability:** four concurrent exact July 2026 proofs agree on the all-dimension threshold. Song and Chen state that their key theorem was completed before they learned of Fu, Gao and Park. The other teams describe concurrent or complementary work and some communication. The careful description is “four concurrent exact proofs, with author-reported independent prior completion by Song and Chen,” not “four demonstrably independent discoveries.” All four were preprints at the cutoff.

### Important partial results that do not solve the parent problem

- **Gaussian entanglement of formation:** [arXiv:2608.01909](https://arxiv.org/abs/2608.01909) covers all two-mode and bisymmetric multimode states, not arbitrary nonsymmetric multimode states.
- **Audenaert-Ruskai decomposition:** [arXiv:2607.23066](https://arxiv.org/abs/2607.23066) proves large subclasses, not all input and output dimensions.
- **Three-copy Werner endpoint:** [arXiv:2608.02647](https://arxiv.org/abs/2608.02647) treats specified rank-two and support sectors, not the full three-copy problem.
- **Special rank-five NPT states:** [arXiv:2608.03710](https://arxiv.org/abs/2608.03710) proves one-copy undistillability over an interval and gives a two-copy obstruction plus numerics, not all-copy undistillability.
- **Two-copy-distillable NPT candidates:** [arXiv:2608.08836](https://arxiv.org/abs/2608.08836) rules out candidates in every dimension, rather than exhibiting NPT bound entanglement.
- **LU-LC minimality:** [arXiv:2603.25219](https://arxiv.org/abs/2603.25219) is a useful unrefereed refinement; the older 27-qubit counterexample already settled the problem.

### Claims not accepted as solutions

- **MUBs in dimension six:** [arXiv:2511.03537](https://arxiv.org/abs/2511.03537) treats a decomposition of operator/MASA space as if it were a decomposition of projective state space; its moment-map step loses phases and collapses the projectors of a basis; its identity-coordinate reassignment and dimension-reduction induction are not justified. A later peer-reviewed review still says the problem is open.
- **SICs in every dimension:** [arXiv:2601.13475](https://arxiv.org/abs/2601.13475) was withdrawn on 31 May 2026. The author's notice says the proof is incorrect.
- **Conditional SIC construction:** [arXiv:2501.03970](https://arxiv.org/abs/2501.03970) assumes two unproved arithmetic conjectures. It is a conditional theorem, not an unconditional solution.
- **Absolute separability in \(4\times n\):** [arXiv:2408.11684](https://arxiv.org/abs/2408.11684) proves an APPT spectral criterion in its theorem, then substitutes absolute separability in prose without proving APPT equals ASEP in that dimension. It does not solve general separability from spectrum.
- **MUB 2025 lemma dispute:** the [Comment](https://arxiv.org/abs/2504.13067) identifies an error that invalidates support for three theorems; the [Reply](https://arxiv.org/abs/2504.15576) salvages restricted statements, not the full MUB problem.
- **Yu-Ying Rényi claim:** [arXiv:1006.1733](https://arxiv.org/abs/1006.1733) was withdrawn for a crucial error and is not used here.

## Source and convention corrections that affect interpretation

### Ruskai's Rényi and output-norm equations

The source has two typographical inconsistencies. The standard definitions are

\[
\nu_p(\Phi)=\sup_\rho\|\Phi(\rho)\|_p,
\qquad
S_p(\rho)=\frac{1}{1-p}\log\operatorname{Tr}\rho^p.
\]

For \(p>1\), minimizing Rényi entropy corresponds to maximizing the output \(p\)-norm. For \(0<p<1\), it corresponds to minimizing the output \(p\)-quasinorm. Thus Problem 18's minimum-output Rényi statement is solved by continuity across \(p=1\); a conventional maximal-output-quasinorm question below one would be a different problem.

### Ruskai's random sub-unitary equations

Equations (19) to (22) in the source do not define trace-preserving maps as printed. For

\[
A_k=cX^k
\begin{pmatrix}U_k&0\\0&0\end{pmatrix},
\]

all \(A_k^\dagger A_k\) have the same rank-\((d-1)\) input support, so their sum cannot be the identity for any scalar \(c\). The coefficient also lacks square-root normalization. The four entries now state that they concern the intended normalized cyclic family with varying input supports. One natural mathematical repair is

\[
A_k=\frac1{\sqrt{d-1}}X^k
\begin{pmatrix}U_k&0\\0&0\end{pmatrix}X^{-k},
\]

but it is identified only as a natural repair, not asserted to be the author's confirmed intended formula.

### Other corrected source transcriptions

- Quantum reverse Shannon convention: if \(rn\) copies of \(T\) are simulated by \(n\) copies of \(S\), then \(C_E(T,S)=C_E(S)/C_E(T)\), not the inverse ratio printed in the earlier local explanation.
- Tough-error lower bound: \(c(e,n)>n/[e^2(e^2+1)]\), not \(n/[e^2(e+1)]\).
- Two-copy Werner matrix normalization: \(\operatorname{Tr}(A^\dagger A)+\operatorname{Tr}(B^\dagger B)=1/4\), not each term separately equal to \(1/4\).
- Product-preparation complexity: the cost is \(\inf\sum_j|\phi_j|\), not the number of Pauli-rotation gates.
- Mutually degradable channels and delayed-onset additivity require nontriviality qualifiers; otherwise both archived statements have immediate or tautological answers.

## Repository changes made by this audit

- Every `metadata.json` now carries the audited status.
- Every `problem.md` has a visible dated audit label immediately below its title.
- Every entry is marked “Last verified: 2026-08-12.”
- Entries affected by new results, rejected claims, or source errors contain the detailed evidence and caveats summarized above.
