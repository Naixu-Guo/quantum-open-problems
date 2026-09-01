"use strict";

window.QUANTUM_OPEN_PROBLEMS = {
  meta: {
    schemaVersion: 3,
    title: "Quantum Open Problems",
    audited: "2026-08-12",
    updated: "2026-08-31",
    asOf: "2026-08-31",
    totalArchive: 58,
    active: 38,
    counts: { open: 28, partial: 10 },
    siteUrl: "https://naixu-guo.github.io/quantum-information-open-problems/",
    repositoryUrl: "https://github.com/Naixu-Guo/quantum-information-open-problems",
    note: "The catalog combines a 53-question quantum-information audit with two sensing questions found through GaugeForge and three TheoremDB entries checked against primary sources."
  },
  taxonomy: {
    areas: [
      {
        id: "quantum-information",
        label: "Quantum information",
        description: "Entanglement, channels, nonlocality, information processing, error correction, and quantum designs."
      },
      {
        id: "quantum-computation",
        label: "Quantum computation",
        description: "Complexity, algorithms, fault tolerance, and error correction."
      },
      {
        id: "quantum-sensing",
        label: "Quantum sensing",
        description: "Precision limits, metrology protocols, and correlated sensing noise."
      },
      {
        id: "quantum-field-theory",
        label: "Quantum field theory",
        description: "Rigorous construction, spectra, and nonperturbative quantum fields."
      },
      {
        id: "quantum-topology",
        label: "Quantum topology",
        description: "Quantum invariants and their links to low-dimensional geometry."
      }
    ],
    topics: [
      { id: "bell-nonlocality", label: "Bell nonlocality", area: "quantum-information" },
      { id: "entanglement-theory", label: "Entanglement theory", area: "quantum-information" },
      { id: "quantum-channels", label: "Quantum channels", area: "quantum-information" },
      { id: "quantum-complexity", label: "Quantum complexity", area: "quantum-information" },
      { id: "quantum-designs", label: "Quantum designs", area: "quantum-information" },
      { id: "quantum-error-correction", label: "Quantum error correction", area: "quantum-information" },
      { id: "quantum-invariants", label: "Quantum invariants and representability", area: "quantum-information" },
      { id: "quantum-metrology", label: "Quantum metrology", area: "quantum-sensing" },
      { id: "local-hamiltonian-complexity", label: "Local Hamiltonian complexity", area: "quantum-computation" },
      { id: "yang-mills-theory", label: "Quantum Yang–Mills theory", area: "quantum-field-theory" },
      { id: "quantum-knot-invariants", label: "Quantum knot invariants", area: "quantum-topology" }
    ]
  },
  collections: [
    {
      id: "horodecki-2020",
      label: "Horodecki",
      aliases: ["Horodecki"],
      title: "Five open problems in theory of quantum information",
      archiveSize: 5
    },
    {
      id: "krueger-2005",
      label: "Krueger–Werner",
      aliases: ["Krueger"],
      title: "Some open problems in quantum information theory",
      archiveSize: 29
    },
    {
      id: "ruskai-2007",
      label: "Ruskai",
      aliases: ["Ruskai"],
      title: "Open problems in quantum information theory",
      archiveSize: 19
    },
    {
      id: "gaugeforge-2026",
      label: "GaugeForge",
      aliases: ["Quantum Open Problem Killer"],
      title: "Quantum Open Problem Killer: sensing additions",
      archiveSize: 2,
      url: "https://github.com/GaugeForge/Quantum_Open_Problem_Killer"
    },
    {
      id: "theoremdb-2026",
      label: "TheoremDB",
      aliases: ["TheoremDB α"],
      title: "TheoremDB quantum entries accepted after primary-source review",
      archiveSize: 3,
      url: "https://www.theoremdb.org/"
    }
  ],
  problems: [
    {
      id: "horodecki-2020-mubs-dimension-six",
      title: "Mutually unbiased bases in dimension six",
      status: "open",
      topic: "quantum-designs",
      collection: "horodecki-2020",
      proposed: "2020",
      type: "Existence or impossibility",
      summary: "Three mutually unbiased bases are known in dimension six. Neither a fourth basis nor an accepted proof excluding a complete set of seven is known.",
      importance: "Dimension six is the smallest case where the prime-power construction fails. A solution would clarify how finite geometry controls complementary quantum measurements.",
      remaining: "Construct at least four MUBs in dimension six, or prove that a complete set of seven cannot exist.",
      latest: "2026-04-01",
      keywords: ["MUB", "dimension six", "complex Hadamard matrices", "Latin squares"],
      progress: [
        {
          date: "2026-04-01",
          title: "Peer-reviewed composite-dimension review keeps the case open",
          detail: "McNulty and Weigert report that dimension six still has only three known MUBs and no accepted impossibility proof.",
          maturity: "Peer reviewed",
          strength: "Status review",
          url: "https://doi.org/10.22331/q-2026-04-01-2051",
          label: "Quantum 2026"
        },
        {
          date: "2026-01-22",
          title: "Claimed proof excluding seven MUBs is not accepted",
          detail: "Joka's v3 preprint loses phase and projector data in its moment-map step, then uses that missing structure in an unsupported reduction argument.",
          maturity: "Preprint",
          strength: "Unaccepted claim",
          url: "https://arxiv.org/abs/2511.03537",
          label: "Claim preprint"
        },
        {
          date: "2025-04-17",
          title: "Comment identifies an error in an earlier structural lemma",
          detail: "The peer-reviewed Comment invalidates support for three dependent theorems. A Reply salvages restricted statements, not the MUB existence problem.",
          maturity: "Peer reviewed",
          strength: "Proof correction",
          url: "https://arxiv.org/abs/2504.13067",
          label: "Comment"
        }
      ],
      watch: [
        {
          label: "Recent claim",
          text: "Do not treat arXiv:2511.03537 as a solution. Its proof gaps are substantive, and the later peer-reviewed review still lists the problem as open.",
          url: "https://arxiv.org/abs/2511.03537"
        }
      ],
      related: ["krueger-2005-mutually-unbiased-bases"]
    },
    {
      id: "horodecki-2020-npt-bound-entanglement",
      title: "NPT bound entanglement",
      status: "open",
      topic: "entanglement-theory",
      collection: "horodecki-2020",
      proposed: "2020",
      type: "Existence",
      summary: "No negative-partial-transpose state has been proved undistillable for every finite number of copies.",
      importance: "The answer determines whether the PPT test marks the exact boundary between distillable and bound entanglement. It also controls tensor-stable positivity questions for quantum maps.",
      remaining: "Construct an NPT state that is undistillable for all tensor powers, or prove that every NPT state is distillable.",
      latest: "2026-08-09",
      keywords: ["NPT", "bound entanglement", "distillability", "Werner states"],
      progress: [
        {
          date: "2026-08-09",
          title: "A candidate family is two-copy distillable in every dimension",
          detail: "Tabia, Chen and Hsieh prove two-copy distillability for selected one-copy-undistillable NPT states in every local dimension at least three. This removes candidates rather than producing bound entanglement.",
          maturity: "Preprint",
          strength: "Exact restricted theorem",
          url: "https://arxiv.org/abs/2608.08836",
          label: "Candidate ruled out"
        },
        {
          date: "2026-07-27",
          title: "The two-copy Werner threshold is exact",
          detail: "Four concurrent preprints prove that a Werner state is two-copy distillable exactly when it is one-copy distillable. Three-copy and all-copy distillability remain unresolved.",
          maturity: "Preprint",
          strength: "Exact two-copy theorem",
          url: "https://arxiv.org/abs/2607.24479",
          label: "Two-copy result"
        }
      ],
      watch: [
        {
          label: "Scope",
          text: "Finite-copy theorems do not settle all-copy undistillability. The July and August 2026 manuscripts are recent preprints at the audit cutoff.",
          url: "https://arxiv.org/abs/2608.08836"
        }
      ],
      related: ["krueger-2005-undistillability-implies-ppt"]
    },
    {
      id: "horodecki-2020-sic-povm-infinite-dimensions",
      title: "SIC POVMs in infinitely many dimensions",
      status: "open",
      topic: "quantum-designs",
      collection: "horodecki-2020",
      proposed: "2020",
      type: "Construction",
      summary: "Exact SICs are known in many individual dimensions, but no unconditional construction covers an infinite sequence of dimensions.",
      importance: "A SIC gives a minimal d²-outcome scheme for quantum-state tomography and forms a complex projective 2-design. An infinite exact family would expose the arithmetic mechanism behind known examples.",
      remaining: "Give an unconditional exact SIC construction in infinitely many dimensions.",
      latest: "2026-05-31",
      keywords: ["SIC-POVM", "Zauner conjecture", "equiangular lines", "Stark conjectures"],
      progress: [
        {
          date: "2026-05-31",
          title: "Claimed all-dimension proof was withdrawn",
          detail: "The arXiv withdrawal notice for Joka's manuscript states that the proof is incorrect.",
          maturity: "Withdrawn",
          strength: "Incorrect claim",
          url: "https://arxiv.org/abs/2601.13475",
          label: "Withdrawal notice"
        },
        {
          date: "2025-03-17",
          title: "Uniform construction remains conditional",
          detail: "Appleby, Flammia and Kopp obtain all dimensions only under two unproved arithmetic and special-value conjectures.",
          maturity: "Preprint",
          strength: "Conditional theorem",
          url: "https://arxiv.org/abs/2501.03970",
          label: "Conditional construction"
        }
      ],
      watch: [
        {
          label: "Withdrawn claim",
          text: "The 2026 all-dimension claim is explicitly withdrawn as incorrect. The 2025 construction is conditional, so neither closes this problem.",
          url: "https://arxiv.org/abs/2601.13475"
        }
      ],
      related: ["krueger-2005-sic-povm-zauner-conjecture"]
    },
    {
      id: "krueger-2005-all-bell-inequalities",
      title: "Classify all Bell inequalities",
      status: "open",
      topic: "bell-nonlocality",
      collection: "krueger-2005",
      proposed: "1999-10-25",
      type: "Classification",
      summary: "Facet lists are complete only for small scenarios or restricted correlation spaces. No closed-form classification exists for arbitrary parties, settings and outcomes.",
      importance: "Facet inequalities give the complete linear tests for classical locality in a fixed experiment. A general classification would organize Bell tests and identify which constraints can show quantum violations.",
      remaining: "Classify the facets of the local correlation polytope for general numbers of parties, settings and outcomes.",
      latest: "2026-04-22",
      keywords: ["Bell inequalities", "correlation polytope", "facets", "local realism"],
      progress: [
        {
          date: "2026-04-22",
          title: "Polyhedral sampling scales by giving up completeness",
          detail: "Staufenbiel's sampling method finds millions of classes in large scenarios but explicitly does not enumerate every facet.",
          maturity: "Preprint",
          strength: "Incomplete computational method",
          url: "https://arxiv.org/abs/2604.22859",
          label: "Sampling method"
        },
        {
          date: "2001-02-05",
          title: "A full-correlation subclass is completely classified",
          detail: "Werner and Wolf enumerate all full-correlation facets for arbitrary parties with two dichotomic observables per site, not the full probability polytope for arbitrary scenarios.",
          maturity: "Peer reviewed",
          strength: "Exact restricted theorem",
          url: "https://arxiv.org/abs/quant-ph/0102024",
          label: "Restricted classification"
        }
      ]
    },
    {
      id: "krueger-2005-bell-vacuum-correlations",
      title: "Bell inequalities for long-range vacuum correlations",
      status: "open",
      topic: "bell-nonlocality",
      collection: "krueger-2005",
      proposed: "2002-01-22",
      type: "Existence or locality",
      summary: "Vacuum entanglement persists at arbitrary separation, but direct CHSH violation by bounded distant regions has not been proved or excluded.",
      importance: "The problem separates long-range vacuum entanglement from Bell nonlocality that localized observers can test. It probes the operational content of correlations in algebraic quantum field theory.",
      remaining: "Prove a direct CHSH violation at arbitrarily large distance, or prove Bell locality beyond a finite separation.",
      latest: "2004-12-14",
      keywords: ["vacuum", "CHSH", "quantum field theory", "entanglement harvesting"],
      progress: [
        {
          date: "2004-12-14",
          title: "Arbitrary-distance harvesting reveals hidden nonlocality",
          detail: "Reznik, Retzker and Silman obtain entanglement at arbitrary separation. Their detector state violates CHSH only after local filtering and postselection, not directly.",
          maturity: "Peer reviewed",
          strength: "Exact restricted protocol",
          url: "https://arxiv.org/abs/quant-ph/0310058",
          label: "Filtered protocol"
        }
      ],
      interpretation: "Entanglement, failure of a PPT analogue and postselected hidden nonlocality are weaker than the direct bounded-region CHSH statement in the archived problem."
    },
    {
      id: "krueger-2005-catalytic-majorization",
      title: "Catalytic majorization",
      status: "partial",
      topic: "entanglement-theory",
      collection: "krueger-2005",
      proposed: "2000-12-18",
      type: "Characterization",
      summary: "Trumping has exact necessary-and-sufficient characterizations by infinite families of inequalities, but no finite efficient test comparable to Nielsen's partial-sum criterion is known.",
      importance: "Catalysts enlarge the set of pure-state transformations possible under LOCC without being consumed. A finite criterion would turn that resource conversion rule into a practical decision procedure.",
      remaining: "Find a finite, tractable necessary-and-sufficient criterion for catalytic majorization, or prove that no such reduction exists.",
      latest: "2026-03-19",
      keywords: ["majorization", "catalysis", "trumping", "LOCC"],
      progress: [
        {
          date: "2026-03-19",
          title: "A finite sufficient criterion is available",
          detail: "The new finite test certifies catalytic transformations but is not necessary, so it does not replace the infinite exact characterization.",
          maturity: "Peer reviewed",
          strength: "Sufficient criterion",
          url: "https://www.nature.com/articles/s42005-026-02583-x",
          label: "Communications Physics"
        },
        {
          date: "2007-09-24",
          title: "Klimesh gives an exact infinite characterization",
          detail: "A family of strict inequalities is necessary and sufficient for trumping under the theorem's support conditions.",
          maturity: "Preprint",
          strength: "Exact characterization",
          url: "https://arxiv.org/abs/0709.3680",
          label: "Klimesh theorem"
        },
        {
          date: "2007-07-03",
          title: "Turgut derives independent exact conditions",
          detail: "Power means and entropy give another necessary-and-sufficient infinite criterion for catalytic conversion.",
          maturity: "Peer reviewed",
          strength: "Exact characterization",
          url: "https://arxiv.org/abs/0707.0444",
          label: "Turgut theorem"
        }
      ]
    },
    {
      id: "krueger-2005-cglmp-inequalities-power",
      title: "The power of CGLMP inequalities",
      status: "partial",
      topic: "bell-nonlocality",
      collection: "krueger-2005",
      proposed: "2005-04-15",
      type: "Classification and optimization",
      summary: "The proposed facet completeness is false. The claimed necessity and simultaneous optimality of Fourier-plus-diagonal measurements remain open.",
      importance: "The remaining claim would identify the measurement architecture that extracts the strongest and most noise-resistant CGLMP evidence from a maximally entangled state.",
      remaining: "For a fixed maximally entangled state, prove or refute necessity of Fourier-plus-diagonal measurements and their simultaneous white-noise and Kullback-Leibler optimality in every outcome dimension.",
      latest: "2010-04-23",
      keywords: ["CGLMP", "Bell facets", "Fourier measurements", "Kullback-Leibler divergence"],
      progress: [
        {
          date: "2010-04-23",
          title: "Part A is refuted by a finite facet counterexample",
          detail: "Bancal, Gisin and Pironio find two-party, two-setting, four-outcome facets that are neither CGLMP inequalities nor lower-outcome liftings.",
          maturity: "Peer reviewed",
          strength: "Exact counterexample",
          url: "https://arxiv.org/abs/1004.4146",
          label: "Part A refuted"
        },
        {
          date: "2008-03-27",
          title: "Numerics clarify the optimizer but do not prove Part B",
          detail: "Global optimization shows that nonmaximally entangled states can outperform maximally entangled ones. The archived measurement claim must therefore retain its fixed-state qualifier.",
          maturity: "Peer reviewed",
          strength: "Numerical evidence",
          url: "https://doi.org/10.1103/PhysRevLett.100.120406",
          label: "Optimization study"
        }
      ],
      interpretation: "Part B fixes the maximally entangled state. A better global strategy using a nonmaximally entangled state does not by itself answer that fixed-state measurement question."
    },
    {
      id: "krueger-2005-complexity-product-preparations",
      title: "Complexity of product preparations",
      status: "open",
      topic: "quantum-complexity",
      collection: "krueger-2005",
      proposed: "2003-01-31",
      type: "Asymptotic complexity",
      summary: "No general asymptotic formula is known for the weighted Pauli-rotation cost of preparing many copies of a pure state.",
      importance: "The answer decides whether state-preparation complexity is extensive or whether a collective circuit can amortize the cost of producing repeated quantum resources.",
      remaining: "Determine the scaling of the weighted rotation cost for many copies and whether collective preparation gives a strict asymptotic saving per copy.",
      latest: "2005-04-21",
      keywords: ["state preparation", "Pauli rotations", "asymptotic cost", "collective preparation"],
      progress: [
        {
          date: "2005-04-21",
          title: "The archived weighted-cost problem remains unresolved",
          detail: "The cost is the infimum of the sum of absolute rotation angles. Modern Clifford-plus-T gate counts use a different resource measure.",
          maturity: "Archived source",
          strength: "Open formulation",
          url: "https://arxiv.org/abs/quant-ph/0504166",
          label: "Source problem"
        }
      ],
      interpretation: "Do not substitute gate count for the source's weighted continuous-angle cost."
    },
    {
      id: "krueger-2005-entanglement-formation-gaussian",
      title: "Entanglement of formation for Gaussian states",
      status: "partial",
      topic: "entanglement-theory",
      collection: "krueger-2005",
      proposed: "2005-04-21",
      type: "Equality of resource measures",
      summary: "Gaussian and unrestricted entanglement of formation now coincide for every two-mode Gaussian state and for bisymmetric multimode states. Generic nonsymmetric multimode states remain open.",
      importance: "Gaussian decompositions are computable from covariance data, while the unrestricted convex roof is hard. Equality would give the exact entanglement cost for a broad class of continuous-variable states.",
      remaining: "Prove or refute equality with Gaussian entanglement of formation for arbitrary nonsymmetric multimode Gaussian states.",
      latest: "2026-08-03",
      keywords: ["Gaussian states", "entanglement of formation", "continuous variables", "convex roof"],
      progress: [
        {
          date: "2026-08-03",
          title: "All two-mode Gaussian states are settled",
          detail: "Adesso proves equality for every two-mode Gaussian state and for bisymmetric multimode states, but not for generic nonsymmetric multimode states.",
          maturity: "Preprint",
          strength: "Exact major subclass",
          url: "https://arxiv.org/abs/2608.01909",
          label: "Two-mode theorem"
        }
      ],
      watch: [
        {
          label: "Very recent",
          text: "This was a first-version preprint nine days old at the audit cutoff. Its theorem is a major partial result, not a solution for all multimode states.",
          url: "https://arxiv.org/abs/2608.01909"
        }
      ]
    },
    {
      id: "krueger-2005-lockable-entanglement-measures",
      title: "Lockability of two-way distillable entanglement and key",
      status: "open",
      topic: "entanglement-theory",
      collection: "krueger-2005",
      proposed: "2005-03-15",
      type: "Existence",
      summary: "Several nearby measures and one-way distillable entanglement are lockable, but the requested two-way distillable entanglement and arbitrary-state distillable key questions remain unresolved.",
      importance: "An affirmative answer would show that losing one qubit can destroy an unbounded amount of recoverable entanglement or secret key. That behavior sets a sharp limit on the robustness of these resources.",
      remaining: "Decide whether discarding one qubit held by Alice can reduce two-way distillable entanglement or distillable key by an arbitrarily large amount.",
      latest: "2021-07-22",
      keywords: ["locking", "distillable entanglement", "distillable key", "private states"],
      progress: [
        {
          date: "2021-07-22",
          title: "Non-lockability is proved for irreducible private states",
          detail: "The result controls two-way distillable key on a restricted family, not arbitrary bipartite states.",
          maturity: "Peer reviewed",
          strength: "Restricted theorem",
          url: "https://arxiv.org/abs/2107.10737",
          label: "Private-state subclass"
        },
        {
          date: "2006-08-25",
          title: "Eve-side information obeys a different non-locking result",
          detail: "The theorem concerns information held by an eavesdropper, not loss of a local qubit by Alice or Bob.",
          maturity: "Peer reviewed",
          strength: "Different operational model",
          url: "https://arxiv.org/abs/quant-ph/0608199",
          label: "Model distinction"
        },
        {
          date: "2004-04-16",
          title: "Several other entanglement measures can be locked",
          detail: "One qubit can lock entanglement of formation, entanglement cost, logarithmic negativity and one-way distillable entanglement.",
          maturity: "Peer reviewed",
          strength: "Exact nearby result",
          url: "https://arxiv.org/abs/quant-ph/0404096",
          label: "Foundational result"
        }
      ],
      interpretation: "Alice-or-Bob loss of a subsystem is not the same operational model as changing an eavesdropper's side information."
    },
    {
      id: "krueger-2005-mutually-unbiased-bases",
      title: "Mutually unbiased bases in general dimensions",
      status: "open",
      topic: "quantum-designs",
      collection: "krueger-2005",
      proposed: "2003-01-31",
      type: "Existence and classification",
      summary: "Complete sets exist in prime-power dimensions, but the maximum number is unknown in general composite dimensions. Dimension six is the first unresolved case.",
      importance: "MUBs supply complementary measurements for tomography and uncertainty relations. Their existence pattern also tests how far finite-field constructions extend into composite dimensions.",
      remaining: "Determine the maximum number of MUBs in non-prime-power dimensions, beginning with dimension six.",
      latest: "2026-04-01",
      keywords: ["MUB", "prime powers", "composite dimensions", "complex Hadamard matrices"],
      progress: [
        {
          date: "2026-04-01",
          title: "Current review confirms the composite-dimension gap",
          detail: "The peer-reviewed review records no general formula and keeps dimension six open.",
          maturity: "Peer reviewed",
          strength: "Status review",
          url: "https://doi.org/10.22331/q-2026-04-01-2051",
          label: "Quantum 2026"
        },
        {
          date: "2026-01-22",
          title: "A dimension-six impossibility claim is not accepted",
          detail: "The claimed MUB-to-Latin-square reduction loses essential phase and projector structure and does not establish the advertised result.",
          maturity: "Preprint",
          strength: "Unaccepted claim",
          url: "https://arxiv.org/abs/2511.03537",
          label: "Claim preprint"
        }
      ],
      watch: [
        {
          label: "Recent claim",
          text: "The 2025-2026 dimension-six claim does not supply an accepted solution to the general MUB problem.",
          url: "https://arxiv.org/abs/2511.03537"
        }
      ],
      related: ["horodecki-2020-mubs-dimension-six"]
    },
    {
      id: "krueger-2005-qubit-relative-entropy-entanglement",
      title: "Two-qubit relative entropy of entanglement",
      status: "open",
      topic: "entanglement-theory",
      collection: "krueger-2005",
      proposed: "2003-06-20",
      type: "Closed formula",
      summary: "Special families and an inverse closest-separable-state construction are known, but no closed formula covers every two-qubit mixed state.",
      importance: "Two qubits form the smallest mixed-state entanglement problem, yet this distance-based measure lacks a direct formula there. A solution would make the measure computable without a convex optimization.",
      remaining: "Find a closed expression that maps an arbitrary two-qubit density matrix to its relative entropy of entanglement.",
      latest: "2008-10-15",
      keywords: ["relative entropy of entanglement", "two qubits", "closest separable state", "convex optimization"],
      progress: [
        {
          date: "2008-10-15",
          title: "The inverse closest-state problem is solved",
          detail: "Miranowicz and Ishizaka construct entangled states from a prescribed closest separable state and solve special families, but not the forward problem for arbitrary input states.",
          maturity: "Peer reviewed",
          strength: "Exact inverse solution",
          url: "https://arxiv.org/abs/0805.3134",
          label: "Inverse construction"
        }
      ]
    },
    {
      id: "krueger-2005-reversible-entanglement-manipulation",
      title: "Reversible entanglement manipulation",
      status: "partial",
      topic: "entanglement-theory",
      collection: "krueger-2005",
      proposed: "2005-02-08",
      type: "Operational characterization",
      summary: "Universal reversibility under PPT operations is false, and irreversibility survives even for exact non-entangling maps. The smallest meaningful reversible operation class is unknown.",
      importance: "A reversible class would give mixed-state entanglement a single exchange rate analogous to entropy for pure states. Its operation set would mark the cost of removing irreversibility.",
      remaining: "Identify the smallest physically meaningful class of operations that makes asymptotic mixed-state entanglement manipulation reversible.",
      latest: "2023-01-20",
      keywords: ["reversibility", "PPT operations", "non-entangling maps", "entanglement cost"],
      progress: [
        {
          date: "2023-01-20",
          title: "Exact non-entangling maps remain irreversible",
          detail: "Lami and Regula prove a separation between entanglement cost and distillation even under operations that generate no entanglement exactly.",
          maturity: "Peer reviewed",
          strength: "Exact no-go theorem",
          url: "https://arxiv.org/abs/2111.02438",
          label: "Nature Physics"
        },
        {
          date: "2017-10-06",
          title: "PPT-assisted universal reversibility is refuted",
          detail: "Wang and Duan exhibit states whose PPT entanglement cost exceeds PPT distillable entanglement.",
          maturity: "Peer reviewed",
          strength: "Exact counterexample",
          url: "https://arxiv.org/abs/1606.09421",
          label: "PPT counterexample"
        }
      ]
    },
    {
      id: "krueger-2005-secret-key-entangled-states",
      title: "Secret key from every entangled state",
      status: "open",
      topic: "entanglement-theory",
      collection: "krueger-2005",
      proposed: "2005-03-15",
      type: "Universal dichotomy",
      summary: "Many entangled states, including PPT examples, have positive distillable key. No proof covers every entangled state, and no entangled state is known with proved zero distillable key.",
      importance: "The answer decides whether entanglement and cryptographic usefulness have the same zero boundary. A zero-key entangled state would separate the two resources.",
      remaining: "Prove that every entangled bipartite state has positive distillable key, or exhibit an entangled state with zero distillable key.",
      latest: "2026-05-06",
      keywords: ["distillable key", "private states", "bound entanglement", "quantum cryptography"],
      progress: [
        {
          date: "2026-05-06",
          title: "Current key-cost theory still treats zero-key entanglement as unresolved",
          detail: "The peer-reviewed analysis states its conclusions conditionally on whether entangled states with zero distillable key exist.",
          maturity: "Peer reviewed",
          strength: "Current status evidence",
          url: "https://quantum-journal.org/papers/q-2026-05-06-2098/",
          label: "Quantum 2026"
        },
        {
          date: "2003-09-12",
          title: "Some PPT bound-entangled states contain secret key",
          detail: "Horodecki and collaborators construct bound-entangled states with positive distillable key, a major positive subclass that does not settle the universal quantifier.",
          maturity: "Peer reviewed",
          strength: "Exact positive subclass",
          url: "https://arxiv.org/abs/quant-ph/0309110",
          label: "Bound-entangled key"
        }
      ]
    },
    {
      id: "krueger-2005-separability-from-spectrum",
      title: "Separability from spectrum",
      status: "partial",
      topic: "entanglement-theory",
      collection: "krueger-2005",
      proposed: "2003-01-31",
      type: "Spectral characterization",
      summary: "Absolute separability is characterized for every 2-by-n system. A complete spectral criterion is unknown when both local dimensions are at least three.",
      importance: "Absolute separability identifies mixed states whose eigenvalues forbid entanglement under any global change of basis. A spectral criterion would decide this property without optimizing over unitaries.",
      remaining: "Characterize spectra that remain separable under every global unitary in all higher local dimensions.",
      latest: "2024-08-21",
      keywords: ["absolute separability", "APPT", "spectrum", "unitary orbit"],
      progress: [
        {
          date: "2024-08-21",
          title: "A 4-by-n claim proves APPT, not absolute separability",
          detail: "The theorem establishes an absolute-PPT criterion but does not prove that APPT equals absolute separability in this dimension.",
          maturity: "Preprint",
          strength: "Unaccepted scope claim",
          url: "https://arxiv.org/abs/2408.11684",
          label: "Claim audit"
        },
        {
          date: "2013-09-08",
          title: "Every qubit-qudit spectrum is characterized",
          detail: "Johnston proves that APPT and absolute separability coincide for 2-by-n systems and gives the complete criterion there.",
          maturity: "Peer reviewed",
          strength: "Exact major subclass",
          url: "https://arxiv.org/abs/1309.2006",
          label: "Qubit-qudit theorem"
        }
      ],
      watch: [
        {
          label: "Terminology",
          text: "APPT is necessary for absolute separability, but the two sets are not known to coincide in general higher dimensions.",
          url: "https://arxiv.org/abs/2408.11684"
        }
      ]
    },
    {
      id: "krueger-2005-sic-povm-zauner-conjecture",
      title: "SIC POVMs and Zauner's conjecture",
      status: "open",
      topic: "quantum-designs",
      collection: "krueger-2005",
      proposed: "2005-02-17",
      type: "Existence and symmetry",
      summary: "Unconditional SIC existence, Weyl-Heisenberg-covariant existence and Zauner-symmetric existence remain unproved in arbitrary dimension.",
      importance: "SICs give minimal tomography and optimal projective designs. Zauner symmetry links their existence to finite groups and algebraic number theory, offering a route to exact constructions.",
      remaining: "Prove or refute the nested all-dimension SIC, covariance and Zauner-symmetry conjectures without unproved arithmetic assumptions.",
      latest: "2026-05-31",
      keywords: ["SIC-POVM", "Zauner conjecture", "Weyl-Heisenberg covariance", "Stark units"],
      progress: [
        {
          date: "2026-05-31",
          title: "An unconditional proof claim was withdrawn as incorrect",
          detail: "The arXiv record for Joka's claimed all-dimension construction explicitly says the proof is not correct.",
          maturity: "Withdrawn",
          strength: "Incorrect claim",
          url: "https://arxiv.org/abs/2601.13475",
          label: "Withdrawal notice"
        },
        {
          date: "2025-03-17",
          title: "A uniform construction is conditional on two conjectures",
          detail: "Appleby, Flammia and Kopp require an order-one abelian Stark conjecture and a special-value identity for a modular cocycle.",
          maturity: "Preprint",
          strength: "Conditional theorem",
          url: "https://arxiv.org/abs/2501.03970",
          label: "Conditional construction"
        }
      ],
      watch: [
        {
          label: "Claim status",
          text: "A withdrawn proof and a theorem conditional on two open conjectures do not establish Zauner's conjecture.",
          url: "https://arxiv.org/abs/2601.13475"
        }
      ],
      related: ["horodecki-2020-sic-povm-infinite-dimensions"]
    },
    {
      id: "krueger-2005-tough-error-models",
      title: "Tough error models",
      status: "open",
      topic: "quantum-error-correction",
      collection: "krueger-2005",
      proposed: "2003-01-31",
      type: "Extremal bound",
      summary: "The universal correctable-code lower bound scales as n/e^4, while a simple worst-case upper bound scales as n/e. The gap is not closed.",
      importance: "The function c(e,n) gives the code dimension guaranteed against an arbitrary e-dimensional error space. Closing the gap would establish the worst-case rate available without assuming a noise model.",
      remaining: "Determine the exact asymptotics of c(e,n), or give matching lower bounds and explicit worst-case error models.",
      latest: "1999-08-19",
      keywords: ["quantum error correction", "error algebra", "code dimension", "worst-case noise"],
      progress: [
        {
          date: "1999-08-19",
          title: "A structure-free lower bound is proved",
          detail: "Knill, Laflamme and Viola show c(e,n) is greater than n divided by e squared times e squared plus one. No matching construction is known.",
          maturity: "Peer reviewed",
          strength: "Exact bound",
          url: "https://arxiv.org/abs/quant-ph/9908066",
          label: "KLV bound"
        }
      ],
      interpretation: "The correct denominator is e^2(e^2+1), not e^2(e+1)."
    },
    {
      id: "krueger-2005-undistillability-implies-ppt",
      title: "Does undistillability imply PPT?",
      status: "open",
      topic: "entanglement-theory",
      collection: "krueger-2005",
      proposed: "2000-03-02",
      type: "Universal dichotomy",
      summary: "The converse of PPT implies undistillable is unresolved in general finite dimensions. This is equivalent to the NPT bound-entanglement problem.",
      importance: "The implication would make the partial-transpose test the exact criterion for whether bipartite entanglement can yield singlets. A counterexample would establish NPT bound entanglement.",
      remaining: "Prove that every NPT state is distillable, or construct an NPT state undistillable for all copy numbers.",
      latest: "2026-08-09",
      keywords: ["NPT", "PPT", "distillability", "bound entanglement", "Werner states"],
      progress: [
        {
          date: "2026-08-09",
          title: "Selected NPT candidates fail at two copies",
          detail: "An exact all-dimension theorem proves two-copy distillability for selected one-copy-undistillable candidates.",
          maturity: "Preprint",
          strength: "Exact restricted theorem",
          url: "https://arxiv.org/abs/2608.08836",
          label: "Candidate elimination"
        },
        {
          date: "2026-07-27",
          title: "Two-copy Werner distillability is completely classified",
          detail: "Four concurrent proofs settle two copies in every dimension but do not control three or more copies.",
          maturity: "Preprint",
          strength: "Exact two-copy theorem",
          url: "https://arxiv.org/abs/2607.24479",
          label: "Two-copy boundary"
        }
      ],
      watch: [
        {
          label: "Quantifier",
          text: "One-copy, two-copy and restricted three-copy results do not settle undistillability for all tensor powers.",
          url: "https://arxiv.org/abs/2608.08836"
        }
      ],
      related: ["horodecki-2020-npt-bound-entanglement"]
    },
    {
      id: "ruskai-2007-additivity-violation-power-m",
      title: "Delayed-onset additivity violation",
      status: "open",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Existence",
      summary: "No channel is known to be additive for every tensor power below a chosen m at least three, then first become nonadditive at m copies.",
      importance: "A delayed violation would show that testing one or two copies cannot certify an additive channel law. It would expose a new level of regularization in channel-output entropy.",
      remaining: "Construct a genuine delayed-onset example with m at least three, or prove that two-copy additivity forces all-copy additivity in the relevant setting.",
      latest: "2026",
      keywords: ["additivity", "tensor powers", "minimum output entropy", "maximal output p-norm"],
      progress: [
        {
          date: "2026",
          title: "Explicit self-channel violations expose a quantifier trap",
          detail: "Derksen and Lovitz give self-channel two-copy violations for every p greater than one. This solves the literal m equals two wording, but not delayed onset at m at least three.",
          maturity: "Preprint",
          strength: "Exact adjacent result",
          url: "https://arxiv.org/abs/2510.07547",
          label: "Self-channel examples"
        },
        {
          date: "2009",
          title: "Hastings violations already appear at two copies",
          detail: "The random-channel counterexample to minimum-output-entropy additivity does not remain additive through lower nontrivial tensor powers.",
          maturity: "Peer reviewed",
          strength: "General counterexample",
          url: "https://arxiv.org/abs/0809.3972",
          label: "Hastings theorem"
        }
      ],
      interpretation: "The intended problem must require m at least three. Otherwise the one-copy equality is tautological and any self-channel two-copy violation answers it."
    },
    {
      id: "ruskai-2007-cb-entropy-multiplicativity-counterexamples",
      title: "CB entropy of multiplicativity counterexamples",
      status: "open",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Structural characterization",
      summary: "Known examples are consistent with the proposed completely bounded entropy or coherent-information conditions, but no theorem covers every multiplicativity counterexample.",
      importance: "A universal entropy signature would explain why known output-norm counterexamples work and connect multiplicativity failure to coherent information.",
      remaining: "Prove the requested CB-entropy or coherent-information structure for all maximal-output-norm counterexamples, or give a counterexample to that structure.",
      latest: "2006",
      keywords: ["CB entropy", "coherent information", "multiplicativity", "channel capacity"],
      progress: [
        {
          date: "2006",
          title: "Completely bounded norms give forward additivity implications",
          detail: "Devetak, Junge, King and Ruskai establish the foundational CB-norm connection, but not the converse classification requested here.",
          maturity: "Peer reviewed",
          strength: "Foundational implication",
          url: "https://arxiv.org/abs/quant-ph/0506196",
          label: "CB-norm framework"
        }
      ],
      interpretation: "A statement that coherent information is zero must specify whether this is an input value, the channel maximum, or a capacity."
    },
    {
      id: "ruskai-2007-convex-decompositions-cpt-maps",
      title: "Audenaert-Ruskai decompositions of CPT maps",
      status: "partial",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Convex decomposition",
      summary: "The strong equal-weight conjecture holds for every qubit-input channel, cq and qc channels, and a positive-measure set in all dimensions. The weak form holds for qutrit endomorphisms.",
      importance: "The conjecture is a channel analogue of decomposing a matrix into controlled low-rank pieces. A proof would reduce arbitrary channels to equal mixtures of low-Choi-rank maps and sharpen the convex geometry of quantum operations.",
      remaining: "Prove or refute the strong decomposition conjecture for arbitrary input and output dimensions.",
      latest: "2026-07-25",
      keywords: ["CPT maps", "convex decomposition", "Horn lemma", "Choi rank"],
      progress: [
        {
          date: "2026-07-25",
          title: "Large channel classes satisfy the conjectured decomposition",
          detail: "Kumar and Wolf prove the strong form for qubit input, cq and qc channels, and a nonzero-measure set in every dimension; the general case remains open.",
          maturity: "Preprint",
          strength: "Exact major subclasses",
          url: "https://arxiv.org/abs/2607.23066",
          label: "Kumar-Wolf"
        }
      ],
      watch: [
        {
          label: "Very recent",
          text: "This substantial advance was an unrefereed first-version preprint at the audit cutoff and does not prove the arbitrary-dimensional conjecture.",
          url: "https://arxiv.org/abs/2607.23066"
        }
      ]
    },
    {
      id: "ruskai-2007-extreme-points-cpt-maps",
      title: "Extreme CPT maps beyond qubit input",
      status: "partial",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Classification and parameterization",
      summary: "Higher-dimensional low-rank classifications and a general fixed-rank quotient parameterization now exist, but no qubit-style canonical classification covers arbitrary dimensions.",
      importance: "Extreme channels are the irreducible building blocks of the convex set of quantum operations. A canonical parameterization would support channel optimization without redundant mixtures.",
      remaining: "Give a useful complete classification or canonical parameterization of the closure of extreme CPT maps for arbitrary input dimension above two.",
      latest: "2018",
      keywords: ["extreme channels", "CPT maps", "Stiefel manifold", "Choi rank"],
      progress: [
        {
          date: "2018",
          title: "Fixed-rank channels receive a quotient-manifold parameterization",
          detail: "Iten and Colbeck describe fixed-Kraus-rank channel sets as Stiefel quotients and identify smooth submanifolds of extreme channels.",
          maturity: "Peer reviewed",
          strength: "General parameterization",
          url: "https://arxiv.org/abs/1610.02513",
          label: "Quotient description"
        },
        {
          date: "2014",
          title: "Important low-dimensional extreme maps are classified",
          detail: "Friedland and Loewy settle qubit-to-qubit and qutrit-to-qubit cases and derive broader generic conditions.",
          maturity: "Peer reviewed",
          strength: "Exact low-dimensional classes",
          url: "https://arxiv.org/abs/1309.5898",
          label: "Low-dimensional theorem"
        }
      ]
    },
    {
      id: "ruskai-2007-local-invariants-n-representability",
      title: "Local invariants and N-representability",
      status: "partial",
      topic: "quantum-invariants",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Invariant classification",
      summary: "Graph-indexed complete invariant families and a free stable invariant algebra are known. A finite-dimensional minimal set for arbitrary mixed two-particle states and the full N-representability constraints remain unknown.",
      importance: "Local invariants provide basis-independent coordinates for two-particle states. Expressing N-representability in those coordinates would connect orbit classification to the quantum marginal problem.",
      remaining: "Find a finite-dimensional minimal complete invariant set for mixed symmetric or antisymmetric two-particle states and express N-representability in those invariants.",
      latest: "2011",
      keywords: ["local invariants", "N-representability", "fermions", "symmetric states", "QMA"],
      progress: [
        {
          date: "2011",
          title: "The stable invariant algebra has graph-indexed generators",
          detail: "Vrana constructs systematic complete families and a free stable algebra, without solving the finite-dimensional minimal mixed-state problem.",
          maturity: "Mixed",
          strength: "Stable-regime characterization",
          url: "https://arxiv.org/abs/1107.2438",
          label: "Stable invariant algebra"
        },
        {
          date: "2007",
          title: "General two-body N-representability is QMA-complete",
          detail: "The complexity theorem gives a strong obstruction to any efficient general criterion, but does not identify the requested minimal invariants.",
          maturity: "Peer reviewed",
          strength: "Complexity classification",
          url: "https://arxiv.org/abs/quant-ph/0609125",
          label: "QMA-completeness"
        }
      ]
    },
    {
      id: "ruskai-2007-multiplicativity-p2-channel-classes",
      title: "Channel classes with multiplicativity at p = 2",
      status: "partial",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Positive-class program",
      summary: "Many nontrivial channel classes have multiplicative maximal output 2-norm, including PPT-inducing channels tensored with arbitrary channels. No exhaustive characterization exists.",
      importance: "A structural classification would locate the boundary where tensor products preserve maximal output purity. That boundary organizes the positive cases left after general multiplicativity failed.",
      remaining: "Identify further positive classes or give an exhaustive structural characterization of channels satisfying multiplicativity at p equals two.",
      latest: "2008",
      keywords: ["maximal output norm", "multiplicativity", "PPT-inducing channels", "p=2"],
      progress: [
        {
          date: "2008",
          title: "PPT-inducing channels form a broad positive class",
          detail: "Dierckx, Fannes and Vandenplas prove 2-norm multiplicativity when one tensor factor is PPT-inducing and the other is arbitrary.",
          maturity: "Peer reviewed",
          strength: "Exact channel class",
          url: "https://arxiv.org/abs/0803.0479",
          label: "PPT-inducing class"
        }
      ]
    },
    {
      id: "ruskai-2007-mutually-degradable-channels",
      title: "Nontrivial mutually degradable channel pairs",
      status: "open",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Existence",
      summary: "Trivial identity and identical-degradable pairs exist, but no distinct genuinely nontrivial pair of the intended kind has been identified.",
      importance: "Mutual degradability means that each channel output can simulate the other channel's environment. Nontrivial examples would expose new structures governing coherent information and capacity.",
      remaining: "Construct distinct mutually degradable channels, preferably with neither channel individually degradable, or prove such pairs cannot exist under natural rank conditions.",
      latest: "2008",
      keywords: ["degradable channels", "complementary channels", "quantum capacity", "Choi rank"],
      progress: [
        {
          date: "2008",
          title: "Structural theory sharply constrains degradable channels",
          detail: "Cubitt, Ruskai and Smith formalize the relevant channel structure and rank restrictions without producing the requested nontrivial pair.",
          maturity: "Peer reviewed",
          strength: "Structural constraints",
          url: "https://arxiv.org/abs/0802.1360",
          label: "Degradable-channel structure"
        }
      ],
      interpretation: "Without a nontriviality qualifier, identity/arbitrary and identical-degradable pairs answer the literal wording."
    },
    {
      id: "ruskai-2007-new-extreme-cpt-additivity",
      title: "New extreme CPT classes with additivity",
      status: "open",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Positive-class program",
      summary: "New families of extreme channels have been studied since 2007, but no decisive new structured class with the requested additivity theorem has been located.",
      importance: "Since universal additivity is false, structured channel families with exact tensor-product laws define the remaining positive theory. Extreme channels are the sharpest place to search for such laws.",
      remaining: "Find a genuinely new class of extreme CPT maps for which minimum-output-entropy additivity or output-norm multiplicativity can be proved.",
      latest: "2021",
      keywords: ["extreme channels", "additivity", "multiplicativity", "factorizable maps"],
      progress: [
        {
          date: "2021",
          title: "New extreme channel families do not supply the requested theorem",
          detail: "Haagerup, Musat and Ruskai develop relevant extreme maps, but this does not yield a new positive additivity class answering the program.",
          maturity: "Peer reviewed",
          strength: "Related structural progress",
          url: "https://arxiv.org/abs/2006.03414",
          label: "Extreme-map families"
        }
      ]
    },
    {
      id: "ruskai-2007-polarized-channel-multiplicativity",
      title: "Polarized near-maximally-mixed channels",
      status: "open",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Structured multiplicativity",
      summary: "General random-channel counterexamples do not settle the polarized family xI + (1-x)M_epsilon or give the requested parameter bounds.",
      importance: "This family tests the stability of multiplicativity near the maximally mixed output channel. Parameter bounds would show how much polarization a positive tensor-product law can tolerate.",
      remaining: "Determine ranges of polarization, deviation and p that guarantee or violate multiplicativity for this structured near-mixed family.",
      latest: "2007",
      keywords: ["polarized channels", "near maximally mixed", "multiplicativity", "random channels"],
      progress: [
        {
          date: "2007",
          title: "Random-channel violations motivate but do not settle the family",
          detail: "Winter and Hayden disprove general multiplicativity for p greater than one using random constructions, without analyzing the specified polarized interpolation.",
          maturity: "Peer reviewed",
          strength: "General counterexamples",
          url: "https://arxiv.org/abs/0707.3291",
          label: "Random-channel result"
        }
      ],
      interpretation: "The source does not specify the norm used to define near-maximally-mixed channels; a modern formulation should fix that convention."
    },
    {
      id: "ruskai-2007-random-subunitary-coherent-information",
      title: "Coherent information of random sub-unitary channels",
      status: "open",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Channel analysis",
      summary: "No complete degradability, coherent-information or capacity analysis is known for the intended normalized cyclic sub-unitary family.",
      importance: "The cyclic low-rank Kraus structure offers a controlled testbed for degradability and superadditive coherent information. A solution would give exact capacities for a nontrivial noisy-channel family.",
      remaining: "Classify degradability and determine coherent-information additivity and quantum capacity for the intended random sub-unitary channel class.",
      latest: "2007",
      keywords: ["sub-unitary channels", "coherent information", "degradability", "quantum capacity"],
      progress: [
        {
          date: "2007",
          title: "Bounded-Schmidt-rank tools address only the surrounding structure",
          detail: "Sub-unitary and generic-channel methods provide context, but no full theorem for this cyclic family.",
          maturity: "Peer reviewed",
          strength: "Related methods",
          url: "https://arxiv.org/abs/0706.0705",
          label: "Subspace methods"
        }
      ],
      interpretation: "The printed Kraus formula is not trace preserving. The research question is interpreted for the intended normalized cyclic family with varying input supports."
    },
    {
      id: "ruskai-2007-random-subunitary-counterexamples",
      title: "Counterexamples among random sub-unitary channels",
      status: "open",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Existence",
      summary: "General random channels violate multiplicativity, but no verified new counterexample has been found inside the intended cyclic sub-unitary family.",
      importance: "The problem tests whether the rigid cyclic Kraus structure can support the multiplicativity violations known for less structured random channels.",
      remaining: "Construct a multiplicativity counterexample in the corrected random sub-unitary class, or prove a positive theorem excluding one in a stated p-range.",
      latest: "2009",
      keywords: ["sub-unitary channels", "multiplicativity", "random channels", "Werner-Holevo"],
      progress: [
        {
          date: "2009",
          title: "Unrestricted random channels violate entropy additivity",
          detail: "Hastings settles the general conjecture negatively, but his construction is not a family-specific solution to this structured search.",
          maturity: "Peer reviewed",
          strength: "General counterexample",
          url: "https://arxiv.org/abs/0809.3972",
          label: "Hastings theorem"
        }
      ],
      interpretation: "The source's displayed Kraus operators do not define a trace-preserving map as printed; the status concerns the intended corrected family."
    },
    {
      id: "ruskai-2007-random-subunitary-maxima-entangled",
      title: "Maximally entangled relative maxima for sub-unitary channels",
      status: "open",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Optimization structure",
      summary: "The maximally entangled input is analytically understood only in the Werner-Holevo special case. No theorem covers arbitrary unitaries in the intended family.",
      importance: "Maximally entangled inputs form the standard ansatz for two-copy channel optimization. Confirming or rejecting that ansatz in this family would locate the states responsible for output-norm extrema.",
      remaining: "Decide whether maximally entangled inputs are always among the relative maxima of the two-copy output p-norm for the corrected family.",
      latest: "2007",
      keywords: ["maximally entangled inputs", "relative maxima", "sub-unitary channels", "output norm"],
      progress: [
        {
          date: "2007",
          title: "The Werner-Holevo critical point is a special case only",
          detail: "Nathanson proves an analytic critical-point statement for the Werner-Holevo channel; private numerical evidence about relative maxima does not extend to arbitrary family parameters.",
          maturity: "Peer reviewed",
          strength: "Exact special case",
          url: "https://arxiv.org/abs/quant-ph/0611106",
          label: "Werner-Holevo analysis"
        }
      ],
      interpretation: "The source formula requires a trace-preserving normalization and rotating input support before this optimization problem is well posed."
    },
    {
      id: "ruskai-2007-random-subunitary-multiplicativity-p2",
      title: "Random sub-unitary multiplicativity at p = 2",
      status: "open",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Structured multiplicativity",
      summary: "General 2-norm multiplicativity is false, but no proof or counterexample settles the intended random sub-unitary subclass.",
      importance: "At p = 2 the output norm measures purity and often permits matrix methods unavailable at other p. This subclass can reveal which Kraus structures preserve purity under tensor products.",
      remaining: "Prove maximal-output 2-norm multiplicativity for every channel in the corrected family, or exhibit a family-specific counterexample.",
      latest: "2007",
      keywords: ["sub-unitary channels", "p=2", "multiplicativity", "maximal output norm"],
      progress: [
        {
          date: "2007",
          title: "The closest positive theorem concerns another family",
          detail: "Michalakis proves the p equals two case for identical polarized Werner-Holevo channels, not for arbitrary random sub-unitary channels.",
          maturity: "Peer reviewed",
          strength: "Different structured class",
          url: "https://arxiv.org/abs/0707.1722",
          label: "Polarized WH theorem"
        }
      ],
      interpretation: "The archived Kraus formula is malformed. This entry tracks the intended normalized cyclic family rather than the literal non-channel formula."
    },
    {
      id: "ruskai-2007-two-pauli-qubit-multiplicativity",
      title: "A direct proof for the two-Pauli qubit channel",
      status: "open",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Proof-method request",
      summary: "Multiplicativity for this channel follows from King's unital-qubit theorem, but that proof uses exactly the negative-multiplier equivalence that the problem asks to avoid.",
      importance: "A direct proof would isolate the property of the two-Pauli channel that enforces multiplicativity. That mechanism could apply beyond reductions to the full unital-qubit theorem.",
      remaining: "Give a proof for the two-Pauli channel that does not pass through unitary equivalence to channels with negative multipliers.",
      latest: "2006",
      keywords: ["two-Pauli channel", "qubit channels", "multiplicativity", "proof method"],
      progress: [
        {
          date: "2006",
          title: "A nearby entropy proof does not establish the requested norm theorem",
          detail: "Amosov proves minimum-output-entropy additivity for the channel, not the direct maximal-output p-norm argument requested here.",
          maturity: "Preprint",
          strength: "Different quantity",
          url: "https://arxiv.org/abs/quant-ph/0605177",
          label: "Entropy result"
        },
        {
          date: "2002",
          title: "The theorem itself is known for every unital qubit channel",
          detail: "King proves multiplicativity broadly, but via the sign-changing unitary-equivalence route excluded by this method-specific problem.",
          maturity: "Peer reviewed",
          strength: "Theorem with excluded method",
          url: "https://doi.org/10.1063/1.1500791",
          label: "Unital-qubit theorem"
        }
      ],
      interpretation: "This remains open only as a request for a different proof. The underlying multiplicativity statement is already known."
    },
    {
      id: "ruskai-2007-werner-holevo-channel-multiplicativity",
      title: "Polarized Werner-Holevo multiplicativity",
      status: "partial",
      topic: "quantum-channels",
      collection: "ruskai-2007",
      proposed: "2007",
      type: "Structured multiplicativity",
      summary: "The identical polarized family is settled at p equals two, and the unpolarized endpoint is settled for one through two. The full polarized parameter range remains open.",
      importance: "Werner-Holevo channels are a canonical stress test for output-norm conjectures. Resolving the polarized family would map the positive and negative regions of a central example.",
      remaining: "Prove or refute multiplicativity for polarized Werner-Holevo channels throughout the remaining x and p values in the interval from one to two.",
      latest: "2007",
      keywords: ["Werner-Holevo channel", "polarization", "multiplicativity", "maximal output norm"],
      progress: [
        {
          date: "2007",
          title: "Every polarization is settled at p = 2",
          detail: "Michalakis proves maximal-output 2-norm multiplicativity for two identical depolarized Werner-Holevo channels in all dimensions.",
          maturity: "Peer reviewed",
          strength: "Exact parameter slice",
          url: "https://arxiv.org/abs/0707.1722",
          label: "p = 2 theorem"
        },
        {
          date: "2004",
          title: "The unpolarized endpoint is settled through p = 2",
          detail: "Datta proves multiplicativity for the Werner-Holevo endpoint throughout the interval from one to two.",
          maturity: "Peer reviewed",
          strength: "Exact endpoint",
          url: "https://arxiv.org/abs/quant-ph/0410063",
          label: "Unpolarized theorem"
        }
      ]
    },
    {
      id: "kurdzialek-2024-correlated-noise-bound-tightness",
      title: "Tightness of metrology bounds under correlated noise",
      status: "open",
      topic: "quantum-metrology",
      collection: "gaugeforge-2026",
      proposed: "2024",
      type: "Bound tightness",
      summary: "Block-comb semidefinite programs bound the asymptotic precision under correlated noise, but no theorem shows that the best block bound equals the precision of a physical protocol.",
      importance: "Metrology bounds guide claims about attainable precision under memory noise. Tightness would certify that the block semidefinite programs predict a physical protocol rather than an unattainable relaxation.",
      remaining: "Prove that the block hierarchy converges to the achievable asymptotic comb quantum Fisher information, or construct a finite-dimensional correlated model with a strict gap.",
      latest: "2025-09-22",
      verified: "2026-08-31",
      keywords: ["quantum sensing", "quantum metrology", "correlated noise", "quantum combs", "Fisher information", "semidefinite programming"],
      origin: {
        kind: "derived",
        label: "Derived research question",
        note: "The source paper states that its bounds are not generally tight and that larger blocks tighten them. The convergence problem is an audited formalization of that limitation, not a conjecture quoted from the authors."
      },
      progress: [
        {
          date: "2025-09-22",
          title: "The block hierarchy tightens without a convergence theorem",
          detail: "Kurdziałek, Albarelli and Demkowicz-Dobrzański derive asymptotic bounds for correlated-noise combs and show how larger blocks improve them. They state that the bounds are not generally tight and prove no limit equality with the physical optimum.",
          maturity: "Peer reviewed",
          strength: "Framework limitation",
          url: "https://doi.org/10.1103/jy3v-wkcb",
          label: "Physical Review Letters"
        }
      ],
      interpretation: "The defensible open problem is the tightness of the asymptotic coefficient. The broader scaling-dichotomy formulation in the lead repository goes beyond the explicit claim in the source paper.",
      related: ["mothe-2023-indefinite-causal-order-asymptotic-metrology"]
    },
    {
      id: "mothe-2023-indefinite-causal-order-asymptotic-metrology",
      title: "Asymptotic metrology with quantum-controlled causal order",
      status: "open",
      topic: "quantum-metrology",
      collection: "gaugeforge-2026",
      proposed: "2023",
      type: "Asymptotic advantage",
      summary: "Quantum-controlled causal order improves quantum Fisher information for some noisy channels at three uses. Its advantage at large numbers of channel uses remains unknown.",
      importance: "Finite-use gains from quantum-controlled order matter only if they survive as resources grow. The answer determines whether causal control changes asymptotic sensing limits or only small-instance performance.",
      remaining: "Prove that QC-QC strategies become asymptotically equivalent to parallel strategies for every smooth finite-dimensional channel family, or give a noisy family with a persistent advantage.",
      latest: "2026-05-08",
      verified: "2026-08-31",
      keywords: ["quantum sensing", "quantum metrology", "indefinite causal order", "QC-QC", "quantum Fisher information", "process matrices"],
      origin: {
        kind: "source-stated",
        label: "Source-stated question",
        note: "Mothe, Branciard and Abbott explicitly ask whether QC-QC strategies can provide an asymptotic advantage after proving strict finite-use advantages."
      },
      progress: [
        {
          date: "2026-05-08",
          title: "A spacetime theorem identifies QC-QC as the physical target class",
          detail: "Salzger and Vilasini show that protocols satisfying their classical-spacetime and closed-laboratory assumptions are behaviorally equivalent to QC-QC. The theorem narrows the physical scope but gives no asymptotic metrology bound.",
          maturity: "Preprint",
          strength: "Physical-scope theorem",
          url: "https://arxiv.org/abs/2605.08351",
          label: "Spacetime characterization"
        },
        {
          date: "2024-06-25",
          title: "QC-QC has a strict advantage at three channel uses",
          detail: "Mothe, Branciard and Abbott find noisy channel families for which QC-QC outperforms causal superpositions and fixed-order circuits at finite N. Their discussion leaves the large-N behavior open.",
          maturity: "Peer reviewed",
          strength: "Finite-use separation",
          url: "https://doi.org/10.1103/PhysRevA.109.062435",
          label: "Physical Review A"
        },
        {
          date: "2023-08-30",
          title: "Parallel, adaptive and causal-superposition strategies coincide asymptotically",
          detail: "Kurdziałek and coauthors prove asymptotic equivalence through causal superpositions. Their proof does not cover dynamical quantum control of causal order.",
          maturity: "Peer reviewed",
          strength: "Exact lower-class theorem",
          url: "https://doi.org/10.1103/PhysRevLett.131.090801",
          label: "Physical Review Letters"
        }
      ],
      watch: [
        {
          label: "Finite versus asymptotic",
          text: "The strict three-use separation proves a finite-resource advantage only. It does not determine the scaling exponent or leading asymptotic coefficient."
        }
      ],
      related: ["kurdzialek-2024-correlated-noise-bound-tightness"]
    },
    {
      id: "theoremdb-p42-quantum-pcp-conjecture",
      title: "Quantum PCP conjecture",
      status: "open",
      topic: "local-hamiltonian-complexity",
      collection: "theoremdb-2026",
      proposed: "2013",
      type: "Complexity conjecture",
      summary: "Inverse-polynomial-gap Local Hamiltonian is QMA-complete. It is unknown whether QMA-hardness persists when the energy gap is a fixed fraction of the number of terms.",
      importance: "Constant-gap hardness would connect quantum proof verification to ground-energy approximation at finite energy density. It also sets the complexity barrier for approximating local many-body Hamiltonians.",
      remaining: "Prove QMA-hardness of constant-gap bounded-locality Local Hamiltonian for fixed constants, or refute it through an algorithm or incompatible complexity containment.",
      latest: "2025-07-11",
      verified: "2026-08-31",
      keywords: ["quantum PCP", "Local Hamiltonian", "QMA", "Hamiltonian complexity", "NLTS", "quantum LDPC"],
      origin: {
        kind: "source-stated",
        label: "Source-stated question",
        note: "TheoremDB P42 records the standard constant-gap Local Hamiltonian conjecture and links it to the primary quantum-PCP literature."
      },
      progress: [
        {
          date: "2025-07-11",
          title: "Quantum-PCP reductions leave constant-gap hardness open",
          detail: "Buhrman, Helsen and Weggemans prove reductions among quantum-PCP formulations and oracle barriers. Their results do not establish QMA-hardness for constant-gap Local Hamiltonian.",
          maturity: "Peer reviewed",
          strength: "Structural restrictions",
          url: "https://doi.org/10.22331/q-2025-07-11-1791",
          label: "Quantum"
        },
        {
          date: "2023",
          title: "NLTS Hamiltonians exist",
          detail: "Anshu, Breuckmann and Nirkhe construct NLTS Hamiltonians from good quantum LDPC codes. NLTS supplies a required entanglement phenomenon but not the constant-gap QMA-hardness reduction.",
          maturity: "Peer reviewed",
          strength: "Necessary structural milestone",
          url: "https://doi.org/10.1145/3564246.3585114",
          label: "STOC 2023"
        }
      ],
      watch: [
        {
          label: "NLTS is not quantum PCP",
          text: "The proof of NLTS does not prove the complexity-theoretic hardness statement."
        }
      ],
      interpretation: "This entry uses the Local Hamiltonian formulation. Statements about multi-prover games require separate hypotheses after MIP* = RE."
    },
    {
      id: "theoremdb-p36-yang-mills-mass-gap",
      title: "Yang-Mills existence and mass gap",
      status: "open",
      topic: "yang-mills-theory",
      collection: "theoremdb-2026",
      proposed: "2000",
      type: "Existence and spectral gap",
      summary: "Mathematics lacks a construction of nontrivial four-dimensional quantum Yang-Mills theory satisfying the official axioms together with a proof of a positive mass gap.",
      importance: "The problem asks mathematics to construct the four-dimensional quantum gauge theory used in particle physics and derive its positive particle-mass scale from the axioms.",
      remaining: "Construct the theory on four-dimensional Euclidean space for every compact simple gauge group under the official axioms and prove a positive mass gap.",
      latest: "2026-08-31",
      verified: "2026-08-31",
      keywords: ["Yang-Mills", "mass gap", "quantum field theory", "constructive field theory", "gauge theory"],
      origin: {
        kind: "source-stated",
        label: "Source-stated question",
        note: "TheoremDB P36 restates the official Clay Mathematics Institute Millennium Prize problem."
      },
      progress: [
        {
          date: "2026-08-31",
          title: "Clay continues to list the problem as unsolved",
          detail: "The official Clay page says that experiments and simulations support a mass gap but no proof meeting the mathematical problem is known.",
          maturity: "Official status page",
          strength: "Authoritative open status",
          url: "https://www.claymath.org/millennium/yang-mills-the-maths-gap/",
          label: "Clay Mathematics Institute"
        },
        {
          date: "2026-06-09",
          title: "A new preprint claims a four-dimensional construction",
          detail: "Faizal and Shabir claim a reflection-positive SU(N) continuum construction with a mass gap. The paper is unrefereed, and the official problem remains listed as unsolved.",
          maturity: "Preprint",
          strength: "Unverified resolution claim",
          url: "https://arxiv.org/abs/2606.19362",
          label: "arXiv:2606.19362"
        }
      ],
      watch: [
        {
          label: "Unreviewed claim",
          text: "Do not mark the problem solved from arXiv:2606.19362. The claim has not passed journal or Clay review, and its SU(N) scope must be checked against the full official statement.",
          url: "https://arxiv.org/abs/2606.19362"
        }
      ]
    },
    {
      id: "theoremdb-p3114-kashaev-volume-conjecture",
      title: "Kashaev volume conjecture for hyperbolic knots",
      status: "open",
      topic: "quantum-knot-invariants",
      collection: "theoremdb-2026",
      proposed: "1997",
      type: "Asymptotic identity",
      summary: "Kashaev's quantum knot invariant is conjectured to grow at a rate fixed by the hyperbolic volume of the knot complement.",
      importance: "The conjecture would let quantum knot invariants recover a geometric quantity of the knot complement. It links representation-theoretic data to three-dimensional hyperbolic geometry.",
      remaining: "Prove the volume-limit identity for every hyperbolic knot, or give a hyperbolic knot for which the limit fails or has the wrong value.",
      latest: "2026-08-01",
      verified: "2026-08-31",
      keywords: ["Kashaev invariant", "volume conjecture", "colored Jones polynomial", "hyperbolic knots", "quantum topology"],
      origin: {
        kind: "source-stated",
        label: "Source-stated question",
        note: "TheoremDB P3114 records Kashaev's universal hyperbolic-knot conjecture and cites the original papers."
      },
      progress: [
        {
          date: "2026-08-01",
          title: "The universal hyperbolic-knot statement remains open",
          detail: "TheoremDB's dated review found proofs for selected knots and families but no proof or counterexample for every hyperbolic knot.",
          maturity: "Reviewed database record",
          strength: "Dated status audit",
          url: "https://www.theoremdb.org/statements/P3114/",
          label: "TheoremDB P3114"
        },
        {
          date: "2001",
          title: "Colored Jones polynomials give an equivalent formulation",
          detail: "Murakami and Murakami identify Kashaev's invariant with a root-of-unity specialization of the colored Jones polynomial and state the volume conjecture in that language.",
          maturity: "Peer reviewed",
          strength: "Equivalent formulation",
          url: "https://doi.org/10.1007/BF02392716",
          label: "Acta Mathematica"
        }
      ]
    }
  ],
  watchlist: [
    {
      problemId: "horodecki-2020-mubs-dimension-six",
      tone: "warning",
      label: "Proof gap",
      title: "The 2025-2026 MUB claim is not accepted",
      text: "The proposed dimension-reduction proof loses phase and projector information. A later peer-reviewed review still lists dimension six as open.",
      sourceLabel: "arXiv:2511.03537 · reviewed against Quantum 2026",
      featured: true
    },
    {
      problemId: "horodecki-2020-sic-povm-infinite-dimensions",
      tone: "withdrawn",
      label: "Withdrawn",
      title: "The claimed all-dimension SIC proof is incorrect",
      text: "The author withdrew arXiv:2601.13475 on 31 May 2026 and stated that its proof is not correct. The separate 2025 construction remains conditional.",
      sourceLabel: "arXiv withdrawal notice",
      featured: true
    },
    {
      problemId: "horodecki-2020-npt-bound-entanglement",
      tone: "warning",
      label: "Quantifier check",
      title: "Two copies are not all copies",
      text: "Four July preprints settle the two-copy Werner threshold, while August work eliminates selected candidates. Neither result constructs NPT bound entanglement or proves every NPT state distillable.",
      sourceLabel: "July-August 2026 preprints"
    },
    {
      problemId: "krueger-2005-entanglement-formation-gaussian",
      tone: "",
      label: "Major partial result",
      title: "All two-mode Gaussian states are settled",
      text: "A 3 August preprint proves equality with Gaussian entanglement of formation for all two-mode states and bisymmetric multimode states. Generic nonsymmetric multimode states remain.",
      sourceLabel: "arXiv:2608.01909"
    },
    {
      problemId: "ruskai-2007-random-subunitary-coherent-information",
      tone: "warning",
      label: "Source correction",
      title: "Four archived channel questions need a corrected formula",
      text: "The printed random sub-unitary Kraus operators are not trace preserving. The four entries use the intended normalized cyclic family and state that interpretation explicitly.",
      sourceLabel: "Ruskai source equations 19-22"
    }
  ]
};
