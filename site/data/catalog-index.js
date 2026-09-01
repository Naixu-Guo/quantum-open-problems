"use strict";

// Generated compact browser index. Full records live under api/v1/problems/.
window.QUANTUM_CATALOG_INDEX = {
  "meta": {
    "schemaVersion": 3,
    "title": "Quantum Open Problems",
    "audited": "2026-08-12",
    "updated": "2026-08-31",
    "asOf": "2026-08-31",
    "totalArchive": 58,
    "active": 38,
    "counts": {
      "open": 28,
      "partial": 10
    },
    "siteUrl": "https://naixu-guo.github.io/quantum-information-open-problems/",
    "repositoryUrl": "https://github.com/Naixu-Guo/quantum-information-open-problems",
    "note": "The catalog combines a 53-question quantum-information audit with two sensing questions found through GaugeForge and three TheoremDB entries checked against primary sources.",
    "apiVersion": "v1",
    "records": {
      "total": 58,
      "active": 38,
      "resolved": 20
    }
  },
  "taxonomy": {
    "areas": [
      {
        "id": "quantum-information",
        "label": "Quantum information",
        "description": "Entanglement, channels, nonlocality, information processing, error correction, and quantum designs."
      },
      {
        "id": "quantum-computation",
        "label": "Quantum computation",
        "description": "Complexity, algorithms, fault tolerance, and error correction."
      },
      {
        "id": "quantum-sensing",
        "label": "Quantum sensing",
        "description": "Precision limits, metrology protocols, and correlated sensing noise."
      },
      {
        "id": "quantum-field-theory",
        "label": "Quantum field theory",
        "description": "Rigorous construction, spectra, and nonperturbative quantum fields."
      },
      {
        "id": "quantum-topology",
        "label": "Quantum topology",
        "description": "Quantum invariants and their links to low-dimensional geometry."
      }
    ],
    "topics": [
      {
        "id": "bell-nonlocality",
        "label": "Bell nonlocality",
        "area": "quantum-information"
      },
      {
        "id": "entanglement-theory",
        "label": "Entanglement theory",
        "area": "quantum-information"
      },
      {
        "id": "quantum-channels",
        "label": "Quantum channels",
        "area": "quantum-information"
      },
      {
        "id": "quantum-complexity",
        "label": "Quantum complexity",
        "area": "quantum-information"
      },
      {
        "id": "quantum-designs",
        "label": "Quantum designs",
        "area": "quantum-information"
      },
      {
        "id": "quantum-error-correction",
        "label": "Quantum error correction",
        "area": "quantum-information"
      },
      {
        "id": "quantum-invariants",
        "label": "Quantum invariants and representability",
        "area": "quantum-information"
      },
      {
        "id": "quantum-metrology",
        "label": "Quantum metrology",
        "area": "quantum-sensing"
      },
      {
        "id": "local-hamiltonian-complexity",
        "label": "Local Hamiltonian complexity",
        "area": "quantum-computation"
      },
      {
        "id": "yang-mills-theory",
        "label": "Quantum Yang–Mills theory",
        "area": "quantum-field-theory"
      },
      {
        "id": "quantum-knot-invariants",
        "label": "Quantum knot invariants",
        "area": "quantum-topology"
      }
    ]
  },
  "collections": [
    {
      "id": "horodecki-2020",
      "label": "Horodecki",
      "aliases": [
        "Horodecki"
      ],
      "title": "Five open problems in theory of quantum information",
      "archiveSize": 5
    },
    {
      "id": "krueger-2005",
      "label": "Krueger–Werner",
      "aliases": [
        "Krueger"
      ],
      "title": "Some open problems in quantum information theory",
      "archiveSize": 29
    },
    {
      "id": "ruskai-2007",
      "label": "Ruskai",
      "aliases": [
        "Ruskai"
      ],
      "title": "Open problems in quantum information theory",
      "archiveSize": 19
    },
    {
      "id": "gaugeforge-2026",
      "label": "GaugeForge",
      "aliases": [
        "Quantum Open Problem Killer"
      ],
      "title": "Quantum Open Problem Killer: sensing additions",
      "archiveSize": 2,
      "url": "https://github.com/GaugeForge/Quantum_Open_Problem_Killer"
    },
    {
      "id": "theoremdb-2026",
      "label": "TheoremDB",
      "aliases": [
        "TheoremDB α"
      ],
      "title": "TheoremDB quantum entries accepted after primary-source review",
      "archiveSize": 3,
      "url": "https://www.theoremdb.org/"
    }
  ],
  "problems": [
    {
      "id": "horodecki-2020-mubs-dimension-six",
      "title": "Mutually unbiased bases in dimension six",
      "status": "open",
      "topic": "quantum-designs",
      "collection": "horodecki-2020",
      "proposed": "2020",
      "latest": "2026-04-01",
      "type": "Existence or impossibility",
      "summary": "Three mutually unbiased bases are known in dimension six. Neither a fourth basis nor an accepted proof excluding a complete set of seven is known.",
      "keywords": [
        "MUB",
        "dimension six",
        "complex Hadamard matrices",
        "Latin squares"
      ],
      "latestEvidence": {
        "date": "2026-04-01",
        "title": "Peer-reviewed composite-dimension review keeps the case open",
        "maturity": "Peer reviewed",
        "strength": "Status review"
      },
      "sourceTitle": "Five open problems in theory of quantum information",
      "sourceAuthors": [
        "Paweł Horodecki",
        "Łukasz Rudnicki",
        "Karol Życzkowski"
      ],
      "recordDigest": "d767330bb8f19b123905c1d58f53513f40d5cc1eeac9533a562eb27713399b85",
      "statementDigest": "a7c9f4f16b9a8be2f0b8204f4facca05419740decb5e078f337ebaa654b6a4e0",
      "detailUrl": "api/v1/problems/horodecki-2020-mubs-dimension-six.json"
    },
    {
      "id": "horodecki-2020-npt-bound-entanglement",
      "title": "NPT bound entanglement",
      "status": "open",
      "topic": "entanglement-theory",
      "collection": "horodecki-2020",
      "proposed": "2020",
      "latest": "2026-08-09",
      "type": "Existence",
      "summary": "No negative-partial-transpose state has been proved undistillable for every finite number of copies.",
      "keywords": [
        "NPT",
        "bound entanglement",
        "distillability",
        "Werner states"
      ],
      "latestEvidence": {
        "date": "2026-08-09",
        "title": "A candidate family is two-copy distillable in every dimension",
        "maturity": "Preprint",
        "strength": "Exact restricted theorem"
      },
      "sourceTitle": "Five open problems in theory of quantum information",
      "sourceAuthors": [
        "Paweł Horodecki",
        "Łukasz Rudnicki",
        "Karol Życzkowski"
      ],
      "recordDigest": "c03605e5446dc0ee317291e0bb84e97a95faa5d14da5e82685ca7bc3d953f0ed",
      "statementDigest": "5794ecb4f03e16ec60ebf8314d595902bd5bdce3ecbd4d0c9d7186bec31b51aa",
      "detailUrl": "api/v1/problems/horodecki-2020-npt-bound-entanglement.json"
    },
    {
      "id": "horodecki-2020-sic-povm-infinite-dimensions",
      "title": "SIC POVMs in infinitely many dimensions",
      "status": "open",
      "topic": "quantum-designs",
      "collection": "horodecki-2020",
      "proposed": "2020",
      "latest": "2026-05-31",
      "type": "Construction",
      "summary": "Exact SICs are known in many individual dimensions, but no unconditional construction covers an infinite sequence of dimensions.",
      "keywords": [
        "SIC-POVM",
        "Zauner conjecture",
        "equiangular lines",
        "Stark conjectures"
      ],
      "latestEvidence": {
        "date": "2026-05-31",
        "title": "Claimed all-dimension proof was withdrawn",
        "maturity": "Withdrawn",
        "strength": "Incorrect claim"
      },
      "sourceTitle": "Five open problems in theory of quantum information",
      "sourceAuthors": [
        "Paweł Horodecki",
        "Łukasz Rudnicki",
        "Karol Życzkowski"
      ],
      "recordDigest": "66aa45d9392755bea77803c546dd115f67d825cbee90a8737f41ded3755e9e26",
      "statementDigest": "5bd2d0214053ad35b60a5e61a53884f7d170480303e967561094798ef63031f0",
      "detailUrl": "api/v1/problems/horodecki-2020-sic-povm-infinite-dimensions.json"
    },
    {
      "id": "krueger-2005-all-bell-inequalities",
      "title": "Classify all Bell inequalities",
      "status": "open",
      "topic": "bell-nonlocality",
      "collection": "krueger-2005",
      "proposed": "1999-10-25",
      "latest": "2026-04-22",
      "type": "Classification",
      "summary": "Facet lists are complete only for small scenarios or restricted correlation spaces. No closed-form classification exists for arbitrary parties, settings and outcomes.",
      "keywords": [
        "Bell inequalities",
        "correlation polytope",
        "facets",
        "local realism"
      ],
      "latestEvidence": {
        "date": "2026-04-22",
        "title": "Polyhedral sampling scales by giving up completeness",
        "maturity": "Preprint",
        "strength": "Incomplete computational method"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "a408c76569426a03deb71bcd631a5c07603b3d5a55e2310e69368c64ed536e5a",
      "statementDigest": "6d9605761bd650b83d101beb42fbda316e9924499ef616d62689edcc9d49ebbc",
      "detailUrl": "api/v1/problems/krueger-2005-all-bell-inequalities.json"
    },
    {
      "id": "krueger-2005-bell-vacuum-correlations",
      "title": "Bell inequalities for long-range vacuum correlations",
      "status": "open",
      "topic": "bell-nonlocality",
      "collection": "krueger-2005",
      "proposed": "2002-01-22",
      "latest": "2004-12-14",
      "type": "Existence or locality",
      "summary": "Vacuum entanglement persists at arbitrary separation, but direct CHSH violation by bounded distant regions has not been proved or excluded.",
      "keywords": [
        "vacuum",
        "CHSH",
        "quantum field theory",
        "entanglement harvesting"
      ],
      "latestEvidence": {
        "date": "2004-12-14",
        "title": "Arbitrary-distance harvesting reveals hidden nonlocality",
        "maturity": "Peer reviewed",
        "strength": "Exact restricted protocol"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "2c26769804f73ebe810db146018c4216f92241018dd906d0711c9f4df0a6b176",
      "statementDigest": "085edb7f4f40b21def10f9c412f8caf73709eaa3f2a8a8bd153a4104e7a79c87",
      "detailUrl": "api/v1/problems/krueger-2005-bell-vacuum-correlations.json"
    },
    {
      "id": "krueger-2005-catalytic-majorization",
      "title": "Catalytic majorization",
      "status": "partial",
      "topic": "entanglement-theory",
      "collection": "krueger-2005",
      "proposed": "2000-12-18",
      "latest": "2026-03-19",
      "type": "Characterization",
      "summary": "Trumping has exact necessary-and-sufficient characterizations by infinite families of inequalities, but no finite efficient test comparable to Nielsen's partial-sum criterion is known.",
      "keywords": [
        "majorization",
        "catalysis",
        "trumping",
        "LOCC"
      ],
      "latestEvidence": {
        "date": "2026-03-19",
        "title": "A finite sufficient criterion is available",
        "maturity": "Peer reviewed",
        "strength": "Sufficient criterion"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "11aa6a73b042cb59546f4dbd740cc9f8f1bb526227937484666e3cae34387dc5",
      "statementDigest": "d2f7b36daa9d93cd1a8acfdb487f976e10c8be0dabcb1af63ce29ff2f995a4da",
      "detailUrl": "api/v1/problems/krueger-2005-catalytic-majorization.json"
    },
    {
      "id": "krueger-2005-cglmp-inequalities-power",
      "title": "The power of CGLMP inequalities",
      "status": "partial",
      "topic": "bell-nonlocality",
      "collection": "krueger-2005",
      "proposed": "2005-04-15",
      "latest": "2010-04-23",
      "type": "Classification and optimization",
      "summary": "The proposed facet completeness is false. The claimed necessity and simultaneous optimality of Fourier-plus-diagonal measurements remain open.",
      "keywords": [
        "CGLMP",
        "Bell facets",
        "Fourier measurements",
        "Kullback-Leibler divergence"
      ],
      "latestEvidence": {
        "date": "2010-04-23",
        "title": "Part A is refuted by a finite facet counterexample",
        "maturity": "Peer reviewed",
        "strength": "Exact counterexample"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "b2bff4d973ed9472af4c5989597da88cfdc5261c755196c633cb78b6680d6414",
      "statementDigest": "8f12b17a3c578728532169a85c04465f8ed9c18bfa7c3a32062381dcfa19500a",
      "detailUrl": "api/v1/problems/krueger-2005-cglmp-inequalities-power.json"
    },
    {
      "id": "krueger-2005-complexity-product-preparations",
      "title": "Complexity of product preparations",
      "status": "open",
      "topic": "quantum-complexity",
      "collection": "krueger-2005",
      "proposed": "2003-01-31",
      "latest": "2005-04-21",
      "type": "Asymptotic complexity",
      "summary": "No general asymptotic formula is known for the weighted Pauli-rotation cost of preparing many copies of a pure state.",
      "keywords": [
        "state preparation",
        "Pauli rotations",
        "asymptotic cost",
        "collective preparation"
      ],
      "latestEvidence": {
        "date": "2005-04-21",
        "title": "The archived weighted-cost problem remains unresolved",
        "maturity": "Archived source",
        "strength": "Open formulation"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "696f49146182ed87d0365d1af35ca45baf5d2fde6fcaeeaa783f8d2081573eda",
      "statementDigest": "4acb313cb6f1b572d00ddad662e1104fee42dcdb741ac70267da14380f3cd2a0",
      "detailUrl": "api/v1/problems/krueger-2005-complexity-product-preparations.json"
    },
    {
      "id": "krueger-2005-entanglement-formation-gaussian",
      "title": "Entanglement of formation for Gaussian states",
      "status": "partial",
      "topic": "entanglement-theory",
      "collection": "krueger-2005",
      "proposed": "2005-04-21",
      "latest": "2026-08-03",
      "type": "Equality of resource measures",
      "summary": "Gaussian and unrestricted entanglement of formation now coincide for every two-mode Gaussian state and for bisymmetric multimode states. Generic nonsymmetric multimode states remain open.",
      "keywords": [
        "Gaussian states",
        "entanglement of formation",
        "continuous variables",
        "convex roof"
      ],
      "latestEvidence": {
        "date": "2026-08-03",
        "title": "All two-mode Gaussian states are settled",
        "maturity": "Preprint",
        "strength": "Exact major subclass"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "0a3da2397d10ebc6800dc9b5cc605d8ad3d27584c9df79bcb49f6849c1705801",
      "statementDigest": "39add630f17c11577506f2ba6fb44834acdf68480c1077f8c538be7d1744536f",
      "detailUrl": "api/v1/problems/krueger-2005-entanglement-formation-gaussian.json"
    },
    {
      "id": "krueger-2005-lockable-entanglement-measures",
      "title": "Lockability of two-way distillable entanglement and key",
      "status": "open",
      "topic": "entanglement-theory",
      "collection": "krueger-2005",
      "proposed": "2005-03-15",
      "latest": "2021-07-22",
      "type": "Existence",
      "summary": "Several nearby measures and one-way distillable entanglement are lockable, but the requested two-way distillable entanglement and arbitrary-state distillable key questions remain unresolved.",
      "keywords": [
        "locking",
        "distillable entanglement",
        "distillable key",
        "private states"
      ],
      "latestEvidence": {
        "date": "2021-07-22",
        "title": "Non-lockability is proved for irreducible private states",
        "maturity": "Peer reviewed",
        "strength": "Restricted theorem"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "da5bbcb4a5cd84c1fe1d740e921319cd5f83d8c9678173af894874437b2df987",
      "statementDigest": "4759a7fcb022e32fe496ad71c71ac778f0e9ddeae9fc745dcb54d38a056f38f4",
      "detailUrl": "api/v1/problems/krueger-2005-lockable-entanglement-measures.json"
    },
    {
      "id": "krueger-2005-mutually-unbiased-bases",
      "title": "Mutually unbiased bases in general dimensions",
      "status": "open",
      "topic": "quantum-designs",
      "collection": "krueger-2005",
      "proposed": "2003-01-31",
      "latest": "2026-04-01",
      "type": "Existence and classification",
      "summary": "Complete sets exist in prime-power dimensions, but the maximum number is unknown in general composite dimensions. Dimension six is the first unresolved case.",
      "keywords": [
        "MUB",
        "prime powers",
        "composite dimensions",
        "complex Hadamard matrices"
      ],
      "latestEvidence": {
        "date": "2026-04-01",
        "title": "Current review confirms the composite-dimension gap",
        "maturity": "Peer reviewed",
        "strength": "Status review"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "e46fbc8423adddad4c87955e07ec4ced9c22c436cd1670b5ccacd444e0d845ec",
      "statementDigest": "6f4ea34d63cfff702c8f4ba68306ed6c371565b4d52124c13a201af7ec126184",
      "detailUrl": "api/v1/problems/krueger-2005-mutually-unbiased-bases.json"
    },
    {
      "id": "krueger-2005-qubit-relative-entropy-entanglement",
      "title": "Two-qubit relative entropy of entanglement",
      "status": "open",
      "topic": "entanglement-theory",
      "collection": "krueger-2005",
      "proposed": "2003-06-20",
      "latest": "2008-10-15",
      "type": "Closed formula",
      "summary": "Special families and an inverse closest-separable-state construction are known, but no closed formula covers every two-qubit mixed state.",
      "keywords": [
        "relative entropy of entanglement",
        "two qubits",
        "closest separable state",
        "convex optimization"
      ],
      "latestEvidence": {
        "date": "2008-10-15",
        "title": "The inverse closest-state problem is solved",
        "maturity": "Peer reviewed",
        "strength": "Exact inverse solution"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "2613af73723e5a2471bdbf4cb7a65618b4d9fd7091b962bab29eac80aff0109d",
      "statementDigest": "af4762c4be566a4ac7e6b74ec69ab6191f72092f45937b82370420369c71affc",
      "detailUrl": "api/v1/problems/krueger-2005-qubit-relative-entropy-entanglement.json"
    },
    {
      "id": "krueger-2005-reversible-entanglement-manipulation",
      "title": "Reversible entanglement manipulation",
      "status": "partial",
      "topic": "entanglement-theory",
      "collection": "krueger-2005",
      "proposed": "2005-02-08",
      "latest": "2023-01-20",
      "type": "Operational characterization",
      "summary": "Universal reversibility under PPT operations is false, and irreversibility survives even for exact non-entangling maps. The smallest meaningful reversible operation class is unknown.",
      "keywords": [
        "reversibility",
        "PPT operations",
        "non-entangling maps",
        "entanglement cost"
      ],
      "latestEvidence": {
        "date": "2023-01-20",
        "title": "Exact non-entangling maps remain irreversible",
        "maturity": "Peer reviewed",
        "strength": "Exact no-go theorem"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "ac70eb5513ec3d58674c7a69b15cadec09fa95dd9446daa1e5176c857017f678",
      "statementDigest": "aa17c9dd4d706ce6936db709ab0a87f86bdc077b4193df993e55d82ea45379d0",
      "detailUrl": "api/v1/problems/krueger-2005-reversible-entanglement-manipulation.json"
    },
    {
      "id": "krueger-2005-secret-key-entangled-states",
      "title": "Secret key from every entangled state",
      "status": "open",
      "topic": "entanglement-theory",
      "collection": "krueger-2005",
      "proposed": "2005-03-15",
      "latest": "2026-05-06",
      "type": "Universal dichotomy",
      "summary": "Many entangled states, including PPT examples, have positive distillable key. No proof covers every entangled state, and no entangled state is known with proved zero distillable key.",
      "keywords": [
        "distillable key",
        "private states",
        "bound entanglement",
        "quantum cryptography"
      ],
      "latestEvidence": {
        "date": "2026-05-06",
        "title": "Current key-cost theory still treats zero-key entanglement as unresolved",
        "maturity": "Peer reviewed",
        "strength": "Current status evidence"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "ade1598d4933ddfd1f5a438f384bff4b08a9a2b3054fea127ef3e68fb02e829c",
      "statementDigest": "b17ddafd9f886de605c0903bc9f045882acdcc9af3b1aa2bf4f84fc9770f01ce",
      "detailUrl": "api/v1/problems/krueger-2005-secret-key-entangled-states.json"
    },
    {
      "id": "krueger-2005-separability-from-spectrum",
      "title": "Separability from spectrum",
      "status": "partial",
      "topic": "entanglement-theory",
      "collection": "krueger-2005",
      "proposed": "2003-01-31",
      "latest": "2024-08-21",
      "type": "Spectral characterization",
      "summary": "Absolute separability is characterized for every 2-by-n system. A complete spectral criterion is unknown when both local dimensions are at least three.",
      "keywords": [
        "absolute separability",
        "APPT",
        "spectrum",
        "unitary orbit"
      ],
      "latestEvidence": {
        "date": "2024-08-21",
        "title": "A 4-by-n claim proves APPT, not absolute separability",
        "maturity": "Preprint",
        "strength": "Unaccepted scope claim"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "95a42598410681e7dc9a2c7b6dcf204de88a0f07815d96ad0c234cfbe5f833cb",
      "statementDigest": "c373f12f68a4584e6e71ed51b73738589848e1043304edd0d9a43dae4b309374",
      "detailUrl": "api/v1/problems/krueger-2005-separability-from-spectrum.json"
    },
    {
      "id": "krueger-2005-sic-povm-zauner-conjecture",
      "title": "SIC POVMs and Zauner's conjecture",
      "status": "open",
      "topic": "quantum-designs",
      "collection": "krueger-2005",
      "proposed": "2005-02-17",
      "latest": "2026-05-31",
      "type": "Existence and symmetry",
      "summary": "Unconditional SIC existence, Weyl-Heisenberg-covariant existence and Zauner-symmetric existence remain unproved in arbitrary dimension.",
      "keywords": [
        "SIC-POVM",
        "Zauner conjecture",
        "Weyl-Heisenberg covariance",
        "Stark units"
      ],
      "latestEvidence": {
        "date": "2026-05-31",
        "title": "An unconditional proof claim was withdrawn as incorrect",
        "maturity": "Withdrawn",
        "strength": "Incorrect claim"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "66be964458a51cfc68967b5745c09817b72bef2bc23472bbc204a10746337ded",
      "statementDigest": "e0991467568bc4b352565352ff7f374dcbd7d34afee814ae2bc09f2ef06a781a",
      "detailUrl": "api/v1/problems/krueger-2005-sic-povm-zauner-conjecture.json"
    },
    {
      "id": "krueger-2005-tough-error-models",
      "title": "Tough error models",
      "status": "open",
      "topic": "quantum-error-correction",
      "collection": "krueger-2005",
      "proposed": "2003-01-31",
      "latest": "1999-08-19",
      "type": "Extremal bound",
      "summary": "The universal correctable-code lower bound scales as n/e^4, while a simple worst-case upper bound scales as n/e. The gap is not closed.",
      "keywords": [
        "quantum error correction",
        "error algebra",
        "code dimension",
        "worst-case noise"
      ],
      "latestEvidence": {
        "date": "1999-08-19",
        "title": "A structure-free lower bound is proved",
        "maturity": "Peer reviewed",
        "strength": "Exact bound"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "c7e9bd1136186587ed3269d4c99ab7bbbfa6b13f77f596cace8011da2f0759a2",
      "statementDigest": "9d46c0640b48cefecab6c0d8f9cd893d99c341d9286bb0867c45e43f7e805bfe",
      "detailUrl": "api/v1/problems/krueger-2005-tough-error-models.json"
    },
    {
      "id": "krueger-2005-undistillability-implies-ppt",
      "title": "Does undistillability imply PPT?",
      "status": "open",
      "topic": "entanglement-theory",
      "collection": "krueger-2005",
      "proposed": "2000-03-02",
      "latest": "2026-08-09",
      "type": "Universal dichotomy",
      "summary": "The converse of PPT implies undistillable is unresolved in general finite dimensions. This is equivalent to the NPT bound-entanglement problem.",
      "keywords": [
        "NPT",
        "PPT",
        "distillability",
        "bound entanglement",
        "Werner states"
      ],
      "latestEvidence": {
        "date": "2026-08-09",
        "title": "Selected NPT candidates fail at two copies",
        "maturity": "Preprint",
        "strength": "Exact restricted theorem"
      },
      "sourceTitle": "Some open problems in quantum information theory",
      "sourceAuthors": [
        "O. Krüger",
        "R. F. Werner"
      ],
      "recordDigest": "86613e211818dd34dc368b509bfa38cfd37a3395d881f0039d4a3e16befd416e",
      "statementDigest": "3fc4dffa1562ff4d7f3c75ff6da78b1aff1ad1707f3c80923ce1f5c174aa70ae",
      "detailUrl": "api/v1/problems/krueger-2005-undistillability-implies-ppt.json"
    },
    {
      "id": "ruskai-2007-additivity-violation-power-m",
      "title": "Delayed-onset additivity violation",
      "status": "open",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2026",
      "type": "Existence",
      "summary": "No channel is known to be additive for every tensor power below a chosen m at least three, then first become nonadditive at m copies.",
      "keywords": [
        "additivity",
        "tensor powers",
        "minimum output entropy",
        "maximal output p-norm"
      ],
      "latestEvidence": {
        "date": "2026",
        "title": "Explicit self-channel violations expose a quantifier trap",
        "maturity": "Preprint",
        "strength": "Exact adjacent result"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "40a1f72721b2bd728e7df30264230a8df93659d7ba70ea8746020c05a56dd9ba",
      "statementDigest": "bf4bfc97b663cdce6203636f06c6ef6d4ae874955e2ba45773a9ce020de7a641",
      "detailUrl": "api/v1/problems/ruskai-2007-additivity-violation-power-m.json"
    },
    {
      "id": "ruskai-2007-cb-entropy-multiplicativity-counterexamples",
      "title": "CB entropy of multiplicativity counterexamples",
      "status": "open",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2006",
      "type": "Structural characterization",
      "summary": "Known examples are consistent with the proposed completely bounded entropy or coherent-information conditions, but no theorem covers every multiplicativity counterexample.",
      "keywords": [
        "CB entropy",
        "coherent information",
        "multiplicativity",
        "channel capacity"
      ],
      "latestEvidence": {
        "date": "2006",
        "title": "Completely bounded norms give forward additivity implications",
        "maturity": "Peer reviewed",
        "strength": "Foundational implication"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "eaf7a01c7f08ce1dd31055017d93a5b3c351cebf926feb3d4ade3ebe340a92ab",
      "statementDigest": "f0be07cfd86bab6db6b9930c841b68ca4be1d9dee0da6c167f607fa36fb62c6d",
      "detailUrl": "api/v1/problems/ruskai-2007-cb-entropy-multiplicativity-counterexamples.json"
    },
    {
      "id": "ruskai-2007-convex-decompositions-cpt-maps",
      "title": "Audenaert-Ruskai decompositions of CPT maps",
      "status": "partial",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2026-07-25",
      "type": "Convex decomposition",
      "summary": "The strong equal-weight conjecture holds for every qubit-input channel, cq and qc channels, and a positive-measure set in all dimensions. The weak form holds for qutrit endomorphisms.",
      "keywords": [
        "CPT maps",
        "convex decomposition",
        "Horn lemma",
        "Choi rank"
      ],
      "latestEvidence": {
        "date": "2026-07-25",
        "title": "Large channel classes satisfy the conjectured decomposition",
        "maturity": "Preprint",
        "strength": "Exact major subclasses"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "cb12c3dde9eb01909360e16953de105d85e10b1bedc831178679b49511ddcaaf",
      "statementDigest": "b90fc2a4038554c27b5437e4e3b5e0d01caf97e48c8f6caa5a43daea0897ec00",
      "detailUrl": "api/v1/problems/ruskai-2007-convex-decompositions-cpt-maps.json"
    },
    {
      "id": "ruskai-2007-extreme-points-cpt-maps",
      "title": "Extreme CPT maps beyond qubit input",
      "status": "partial",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2018",
      "type": "Classification and parameterization",
      "summary": "Higher-dimensional low-rank classifications and a general fixed-rank quotient parameterization now exist, but no qubit-style canonical classification covers arbitrary dimensions.",
      "keywords": [
        "extreme channels",
        "CPT maps",
        "Stiefel manifold",
        "Choi rank"
      ],
      "latestEvidence": {
        "date": "2018",
        "title": "Fixed-rank channels receive a quotient-manifold parameterization",
        "maturity": "Peer reviewed",
        "strength": "General parameterization"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "8c4f692e848f41fb7a40837a88893845fecbaab2618bbf546941d5f195b3be9c",
      "statementDigest": "1872dce6f4408d25266be8b259803852dd6154fb77e7a09f4878b04cd55c78bb",
      "detailUrl": "api/v1/problems/ruskai-2007-extreme-points-cpt-maps.json"
    },
    {
      "id": "ruskai-2007-local-invariants-n-representability",
      "title": "Local invariants and N-representability",
      "status": "partial",
      "topic": "quantum-invariants",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2011",
      "type": "Invariant classification",
      "summary": "Graph-indexed complete invariant families and a free stable invariant algebra are known. A finite-dimensional minimal set for arbitrary mixed two-particle states and the full N-representability constraints remain unknown.",
      "keywords": [
        "local invariants",
        "N-representability",
        "fermions",
        "symmetric states",
        "QMA"
      ],
      "latestEvidence": {
        "date": "2011",
        "title": "The stable invariant algebra has graph-indexed generators",
        "maturity": "Mixed",
        "strength": "Stable-regime characterization"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "a76b701a4b5cbe62b23f7b16e91498fcac68d566b78fbada579b178d145164d5",
      "statementDigest": "6216d9a5a0c63e0a378bda6ff4533f7de05da02a40f5ae590b188e41eccabf61",
      "detailUrl": "api/v1/problems/ruskai-2007-local-invariants-n-representability.json"
    },
    {
      "id": "ruskai-2007-multiplicativity-p2-channel-classes",
      "title": "Channel classes with multiplicativity at p = 2",
      "status": "partial",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2008",
      "type": "Positive-class program",
      "summary": "Many nontrivial channel classes have multiplicative maximal output 2-norm, including PPT-inducing channels tensored with arbitrary channels. No exhaustive characterization exists.",
      "keywords": [
        "maximal output norm",
        "multiplicativity",
        "PPT-inducing channels",
        "p=2"
      ],
      "latestEvidence": {
        "date": "2008",
        "title": "PPT-inducing channels form a broad positive class",
        "maturity": "Peer reviewed",
        "strength": "Exact channel class"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "d3ad4d71bbf8f031c2157cb57cedb3e99e1a4492475a1839b4a879e5e07aec90",
      "statementDigest": "50a635b5b3cefe16616539241d4f6b5a1ae3facaae125f4f2434590b9a5973b0",
      "detailUrl": "api/v1/problems/ruskai-2007-multiplicativity-p2-channel-classes.json"
    },
    {
      "id": "ruskai-2007-mutually-degradable-channels",
      "title": "Nontrivial mutually degradable channel pairs",
      "status": "open",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2008",
      "type": "Existence",
      "summary": "Trivial identity and identical-degradable pairs exist, but no distinct genuinely nontrivial pair of the intended kind has been identified.",
      "keywords": [
        "degradable channels",
        "complementary channels",
        "quantum capacity",
        "Choi rank"
      ],
      "latestEvidence": {
        "date": "2008",
        "title": "Structural theory sharply constrains degradable channels",
        "maturity": "Peer reviewed",
        "strength": "Structural constraints"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "346859af0c52cc6a7fbbd11d9417837d43b889cec23cac2d500118e229a9f2c1",
      "statementDigest": "65117e0d24210dbc6cef187270d9a8c5963fe3e1102f181a6040e42aca3b7110",
      "detailUrl": "api/v1/problems/ruskai-2007-mutually-degradable-channels.json"
    },
    {
      "id": "ruskai-2007-new-extreme-cpt-additivity",
      "title": "New extreme CPT classes with additivity",
      "status": "open",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2021",
      "type": "Positive-class program",
      "summary": "New families of extreme channels have been studied since 2007, but no decisive new structured class with the requested additivity theorem has been located.",
      "keywords": [
        "extreme channels",
        "additivity",
        "multiplicativity",
        "factorizable maps"
      ],
      "latestEvidence": {
        "date": "2021",
        "title": "New extreme channel families do not supply the requested theorem",
        "maturity": "Peer reviewed",
        "strength": "Related structural progress"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "e9e8ae271cdc8ddea7e1754a5e2c8dc711d39160ab2d2cff5c57e5e336990311",
      "statementDigest": "5cc2366d7e1f808e6985d9b7c3b0f1040fa7e22fdc333a77d88ad66f56407048",
      "detailUrl": "api/v1/problems/ruskai-2007-new-extreme-cpt-additivity.json"
    },
    {
      "id": "ruskai-2007-polarized-channel-multiplicativity",
      "title": "Polarized near-maximally-mixed channels",
      "status": "open",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2007",
      "type": "Structured multiplicativity",
      "summary": "General random-channel counterexamples do not settle the polarized family xI + (1-x)M_epsilon or give the requested parameter bounds.",
      "keywords": [
        "polarized channels",
        "near maximally mixed",
        "multiplicativity",
        "random channels"
      ],
      "latestEvidence": {
        "date": "2007",
        "title": "Random-channel violations motivate but do not settle the family",
        "maturity": "Peer reviewed",
        "strength": "General counterexamples"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "a13b0b2c37cc84b0cc75f8b68dbaed00b0168cbe715cd502a793b4febcb74ceb",
      "statementDigest": "6fffa1a864c29f79b4cdf6612d0ef75fdfe3ffc5a29cd6b29a82244702dfa903",
      "detailUrl": "api/v1/problems/ruskai-2007-polarized-channel-multiplicativity.json"
    },
    {
      "id": "ruskai-2007-random-subunitary-coherent-information",
      "title": "Coherent information of random sub-unitary channels",
      "status": "open",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2007",
      "type": "Channel analysis",
      "summary": "No complete degradability, coherent-information or capacity analysis is known for the intended normalized cyclic sub-unitary family.",
      "keywords": [
        "sub-unitary channels",
        "coherent information",
        "degradability",
        "quantum capacity"
      ],
      "latestEvidence": {
        "date": "2007",
        "title": "Bounded-Schmidt-rank tools address only the surrounding structure",
        "maturity": "Peer reviewed",
        "strength": "Related methods"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "d5b77f20bc8a851393f9a0f93e18e2ad8394154a6948c65cd83823649afceefa",
      "statementDigest": "73253408e993cc6236ee823b286bc1483b4579d5a18881f37957faa4e3e51727",
      "detailUrl": "api/v1/problems/ruskai-2007-random-subunitary-coherent-information.json"
    },
    {
      "id": "ruskai-2007-random-subunitary-counterexamples",
      "title": "Counterexamples among random sub-unitary channels",
      "status": "open",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2009",
      "type": "Existence",
      "summary": "General random channels violate multiplicativity, but no verified new counterexample has been found inside the intended cyclic sub-unitary family.",
      "keywords": [
        "sub-unitary channels",
        "multiplicativity",
        "random channels",
        "Werner-Holevo"
      ],
      "latestEvidence": {
        "date": "2009",
        "title": "Unrestricted random channels violate entropy additivity",
        "maturity": "Peer reviewed",
        "strength": "General counterexample"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "84c6e073c14bbd011aa4dfc8d628441965d941f1eb5ae728ad3d5b772e99e2b3",
      "statementDigest": "4245d41e5a1e616b64424dff8a6713fe979274babb36bfb1e479d0817d04d851",
      "detailUrl": "api/v1/problems/ruskai-2007-random-subunitary-counterexamples.json"
    },
    {
      "id": "ruskai-2007-random-subunitary-maxima-entangled",
      "title": "Maximally entangled relative maxima for sub-unitary channels",
      "status": "open",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2007",
      "type": "Optimization structure",
      "summary": "The maximally entangled input is analytically understood only in the Werner-Holevo special case. No theorem covers arbitrary unitaries in the intended family.",
      "keywords": [
        "maximally entangled inputs",
        "relative maxima",
        "sub-unitary channels",
        "output norm"
      ],
      "latestEvidence": {
        "date": "2007",
        "title": "The Werner-Holevo critical point is a special case only",
        "maturity": "Peer reviewed",
        "strength": "Exact special case"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "b9a02c8d36abacde237dea59968bee9ad9d23485bb1627953f35939d9fb40be0",
      "statementDigest": "854d336a72d1c7b508562f1fbd69e565d1228f736ab5ddae5c50232d9c0ee71f",
      "detailUrl": "api/v1/problems/ruskai-2007-random-subunitary-maxima-entangled.json"
    },
    {
      "id": "ruskai-2007-random-subunitary-multiplicativity-p2",
      "title": "Random sub-unitary multiplicativity at p = 2",
      "status": "open",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2007",
      "type": "Structured multiplicativity",
      "summary": "General 2-norm multiplicativity is false, but no proof or counterexample settles the intended random sub-unitary subclass.",
      "keywords": [
        "sub-unitary channels",
        "p=2",
        "multiplicativity",
        "maximal output norm"
      ],
      "latestEvidence": {
        "date": "2007",
        "title": "The closest positive theorem concerns another family",
        "maturity": "Peer reviewed",
        "strength": "Different structured class"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "9aef639cd5dbc39993f49a27ffe4fd45ea9dfcde6407a496f2371107d0c81d5d",
      "statementDigest": "2f2c6f68e3f5dad0373ea47278680d5f33a589b70ce8bf84b887f6f397727ac5",
      "detailUrl": "api/v1/problems/ruskai-2007-random-subunitary-multiplicativity-p2.json"
    },
    {
      "id": "ruskai-2007-two-pauli-qubit-multiplicativity",
      "title": "A direct proof for the two-Pauli qubit channel",
      "status": "open",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2006",
      "type": "Proof-method request",
      "summary": "Multiplicativity for this channel follows from King's unital-qubit theorem, but that proof uses exactly the negative-multiplier equivalence that the problem asks to avoid.",
      "keywords": [
        "two-Pauli channel",
        "qubit channels",
        "multiplicativity",
        "proof method"
      ],
      "latestEvidence": {
        "date": "2006",
        "title": "A nearby entropy proof does not establish the requested norm theorem",
        "maturity": "Preprint",
        "strength": "Different quantity"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "e753e6f47d0614292be1010ec25a96239d1c8420dd8a0cb5b19d3fa742e3b417",
      "statementDigest": "f7f54016d4e6b6bfcd7a00aae45e348223c79c077d3a68c6cb8baca564ee8859",
      "detailUrl": "api/v1/problems/ruskai-2007-two-pauli-qubit-multiplicativity.json"
    },
    {
      "id": "ruskai-2007-werner-holevo-channel-multiplicativity",
      "title": "Polarized Werner-Holevo multiplicativity",
      "status": "partial",
      "topic": "quantum-channels",
      "collection": "ruskai-2007",
      "proposed": "2007",
      "latest": "2007",
      "type": "Structured multiplicativity",
      "summary": "The identical polarized family is settled at p equals two, and the unpolarized endpoint is settled for one through two. The full polarized parameter range remains open.",
      "keywords": [
        "Werner-Holevo channel",
        "polarization",
        "multiplicativity",
        "maximal output norm"
      ],
      "latestEvidence": {
        "date": "2007",
        "title": "Every polarization is settled at p = 2",
        "maturity": "Peer reviewed",
        "strength": "Exact parameter slice"
      },
      "sourceTitle": "Open problems in quantum information theory",
      "sourceAuthors": [
        "Mary Beth Ruskai"
      ],
      "recordDigest": "d664414576b2612a20350632726143735c30409919006d017f8d8fe8400da9bb",
      "statementDigest": "04ce0a79ef13c7db3a88cb48214666af64a1687126f330722ce5327bade5d77d",
      "detailUrl": "api/v1/problems/ruskai-2007-werner-holevo-channel-multiplicativity.json"
    },
    {
      "id": "kurdzialek-2024-correlated-noise-bound-tightness",
      "title": "Tightness of metrology bounds under correlated noise",
      "status": "open",
      "topic": "quantum-metrology",
      "collection": "gaugeforge-2026",
      "proposed": "2024",
      "latest": "2025-09-22",
      "type": "Bound tightness",
      "summary": "Block-comb semidefinite programs bound the asymptotic precision under correlated noise, but no theorem shows that the best block bound equals the precision of a physical protocol.",
      "keywords": [
        "quantum sensing",
        "quantum metrology",
        "correlated noise",
        "quantum combs",
        "Fisher information",
        "semidefinite programming"
      ],
      "latestEvidence": {
        "date": "2025-09-22",
        "title": "The block hierarchy tightens without a convergence theorem",
        "maturity": "Peer reviewed",
        "strength": "Framework limitation"
      },
      "sourceTitle": "Universal bounds for quantum metrology in the presence of correlated noise",
      "sourceAuthors": [
        "Stanisław Kurdziałek",
        "Francesco Albarelli",
        "Rafał Demkowicz-Dobrzański"
      ],
      "recordDigest": "8d52c6f8bd597f59e237caf72931a3c04f17693673c83c1a70f470b432170d03",
      "statementDigest": "a6a6956d04d1c3b5c26f2ba92dc49a70273762da53cc3f62372d7edc05e6159b",
      "detailUrl": "api/v1/problems/kurdzialek-2024-correlated-noise-bound-tightness.json"
    },
    {
      "id": "mothe-2023-indefinite-causal-order-asymptotic-metrology",
      "title": "Asymptotic metrology with quantum-controlled causal order",
      "status": "open",
      "topic": "quantum-metrology",
      "collection": "gaugeforge-2026",
      "proposed": "2023",
      "latest": "2026-05-08",
      "type": "Asymptotic advantage",
      "summary": "Quantum-controlled causal order improves quantum Fisher information for some noisy channels at three uses. Its advantage at large numbers of channel uses remains unknown.",
      "keywords": [
        "quantum sensing",
        "quantum metrology",
        "indefinite causal order",
        "QC-QC",
        "quantum Fisher information",
        "process matrices"
      ],
      "latestEvidence": {
        "date": "2026-05-08",
        "title": "A spacetime theorem identifies QC-QC as the physical target class",
        "maturity": "Preprint",
        "strength": "Physical-scope theorem"
      },
      "sourceTitle": "Reassessing the advantage of indefinite causal orders for quantum metrology",
      "sourceAuthors": [
        "Raphaël Mothe",
        "Cyril Branciard",
        "Alastair A. Abbott"
      ],
      "recordDigest": "aea78889e43c659d042db391de7bd4e894429d328a08e494c738c552deeb6ba2",
      "statementDigest": "a0e8ee5cff5fd71bc038762cac0840a2955516d5e39bafa653504b867e7e4310",
      "detailUrl": "api/v1/problems/mothe-2023-indefinite-causal-order-asymptotic-metrology.json"
    },
    {
      "id": "theoremdb-p42-quantum-pcp-conjecture",
      "title": "Quantum PCP conjecture",
      "status": "open",
      "topic": "local-hamiltonian-complexity",
      "collection": "theoremdb-2026",
      "proposed": "2013",
      "latest": "2025-07-11",
      "type": "Complexity conjecture",
      "summary": "Inverse-polynomial-gap Local Hamiltonian is QMA-complete. It is unknown whether QMA-hardness persists when the energy gap is a fixed fraction of the number of terms.",
      "keywords": [
        "quantum PCP",
        "Local Hamiltonian",
        "QMA",
        "Hamiltonian complexity",
        "NLTS",
        "quantum LDPC"
      ],
      "latestEvidence": {
        "date": "2025-07-11",
        "title": "Quantum-PCP reductions leave constant-gap hardness open",
        "maturity": "Peer reviewed",
        "strength": "Structural restrictions"
      },
      "sourceTitle": "The Quantum PCP Conjecture",
      "sourceAuthors": [
        "Dorit Aharonov",
        "Itai Arad",
        "Thomas Vidick"
      ],
      "recordDigest": "46dfa9b527bdbdf32a11440b003332ab69b397eff586e25fac96beb87d505cd7",
      "statementDigest": "306b56d9bde766f3b5acfdc4d375bd039cb5dec34f4b5d8012827d1bc75e28e7",
      "detailUrl": "api/v1/problems/theoremdb-p42-quantum-pcp-conjecture.json"
    },
    {
      "id": "theoremdb-p36-yang-mills-mass-gap",
      "title": "Yang-Mills existence and mass gap",
      "status": "open",
      "topic": "yang-mills-theory",
      "collection": "theoremdb-2026",
      "proposed": "2000",
      "latest": "2026-08-31",
      "type": "Existence and spectral gap",
      "summary": "Mathematics lacks a construction of nontrivial four-dimensional quantum Yang-Mills theory satisfying the official axioms together with a proof of a positive mass gap.",
      "keywords": [
        "Yang-Mills",
        "mass gap",
        "quantum field theory",
        "constructive field theory",
        "gauge theory"
      ],
      "latestEvidence": {
        "date": "2026-08-31",
        "title": "Clay continues to list the problem as unsolved",
        "maturity": "Official status page",
        "strength": "Authoritative open status"
      },
      "sourceTitle": "Quantum Yang-Mills Theory",
      "sourceAuthors": [
        "Arthur Jaffe",
        "Edward Witten"
      ],
      "recordDigest": "d53f8cef2101486d399a378e036cfe581269d432421139685c8ab7486a522133",
      "statementDigest": "4c062770677148730a2c49f3fe6f5ae3949c7a54250730fc11d6afb5bddebce0",
      "detailUrl": "api/v1/problems/theoremdb-p36-yang-mills-mass-gap.json"
    },
    {
      "id": "theoremdb-p3114-kashaev-volume-conjecture",
      "title": "Kashaev volume conjecture for hyperbolic knots",
      "status": "open",
      "topic": "quantum-knot-invariants",
      "collection": "theoremdb-2026",
      "proposed": "1997",
      "latest": "2026-08-01",
      "type": "Asymptotic identity",
      "summary": "Kashaev's quantum knot invariant is conjectured to grow at a rate fixed by the hyperbolic volume of the knot complement.",
      "keywords": [
        "Kashaev invariant",
        "volume conjecture",
        "colored Jones polynomial",
        "hyperbolic knots",
        "quantum topology"
      ],
      "latestEvidence": {
        "date": "2026-08-01",
        "title": "The universal hyperbolic-knot statement remains open",
        "maturity": "Reviewed database record",
        "strength": "Dated status audit"
      },
      "sourceTitle": "The Hyperbolic Volume of Knots from the Quantum Dilogarithm",
      "sourceAuthors": [
        "Rinat M. Kashaev"
      ],
      "recordDigest": "b1d04ae357c94df359859925e152c0330052f6964aa7c015fc33bebb5548bf9a",
      "statementDigest": "68efefcb7a0d2174d7361e1ef6419aec49679ce23efbe2cae36ba3c649725a32",
      "detailUrl": "api/v1/problems/theoremdb-p3114-kashaev-volume-conjecture.json"
    }
  ],
  "watchlist": [
    {
      "problemId": "horodecki-2020-mubs-dimension-six",
      "tone": "warning",
      "label": "Proof gap",
      "title": "The 2025-2026 MUB claim is not accepted",
      "text": "The proposed dimension-reduction proof loses phase and projector information. A later peer-reviewed review still lists dimension six as open.",
      "sourceLabel": "arXiv:2511.03537 · reviewed against Quantum 2026",
      "featured": true
    },
    {
      "problemId": "horodecki-2020-sic-povm-infinite-dimensions",
      "tone": "withdrawn",
      "label": "Withdrawn",
      "title": "The claimed all-dimension SIC proof is incorrect",
      "text": "The author withdrew arXiv:2601.13475 on 31 May 2026 and stated that its proof is not correct. The separate 2025 construction remains conditional.",
      "sourceLabel": "arXiv withdrawal notice",
      "featured": true
    },
    {
      "problemId": "horodecki-2020-npt-bound-entanglement",
      "tone": "warning",
      "label": "Quantifier check",
      "title": "Two copies are not all copies",
      "text": "Four July preprints settle the two-copy Werner threshold, while August work eliminates selected candidates. Neither result constructs NPT bound entanglement or proves every NPT state distillable.",
      "sourceLabel": "July-August 2026 preprints"
    },
    {
      "problemId": "krueger-2005-entanglement-formation-gaussian",
      "tone": "",
      "label": "Major partial result",
      "title": "All two-mode Gaussian states are settled",
      "text": "A 3 August preprint proves equality with Gaussian entanglement of formation for all two-mode states and bisymmetric multimode states. Generic nonsymmetric multimode states remain.",
      "sourceLabel": "arXiv:2608.01909"
    },
    {
      "problemId": "ruskai-2007-random-subunitary-coherent-information",
      "tone": "warning",
      "label": "Source correction",
      "title": "Four archived channel questions need a corrected formula",
      "text": "The printed random sub-unitary Kraus operators are not trace preserving. The four entries use the intended normalized cyclic family and state that interpretation explicitly.",
      "sourceLabel": "Ruskai source equations 19-22"
    }
  ]
};
