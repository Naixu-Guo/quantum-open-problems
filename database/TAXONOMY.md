# Classifying problems

`tags.json` is the canonical vocabulary. The September 2026 revision follows
a review of all 86 problem statements: six fields replace 16, and 53 topics
replace 146 (46 of the previous topics were unused). All remaining topics
have at least one record. The revision changes classification only; it
preserves statements, evidence, statuses, identifiers, and aliases.

## Field boundaries

Use these exact spellings from `tags.json`. The requested spelling of
“Quantum algorithm” and “Quantum metrology” is retained; “Cryptography” and
“Resource Theory” correct the spelling in the request.

| Field | Scope in this catalog | Records at revision |
| --- | --- | ---: |
| Quantum algorithm | Algorithms, circuit and Hamiltonian complexity, computability, state preparation, simulation, and verification of quantum computation. | 8 |
| Quantum Communication | Transmission and compression, channel capacities and simulation, and their supporting channel structure, divergence, recovery, and entropy questions. | 37 |
| Quantum metrology | Parameter estimation, measurement design, tomography, state and channel discrimination, and their statistical limits. | 13 |
| Quantum Cryptography | Secret-key distillation, private communication, device-independent security, and position-based protocols. | 5 |
| Quantum Resource Theory | Entanglement, nonlocality, steering, magic, thermodynamic and causal resources, their structure and conversion. | 41 |
| Quantum Error Correction | Code constructions and limitations, quantum LDPC codes, self-correcting memories, and AME existence questions with explicit coding formulations. | 7 |

The counts overlap because a problem can have two fields. Put its primary
field first. Add a second when it captures another central aspect of the
question, rather than a possible future application.

These are catalog conventions, not an assertion that all quantum information
subfields have a unique place in a six-field classification. In particular:

- SIC and mutually unbiased basis existence questions use metrology's
  measurement-design scope. They are not claims about a sensing protocol.
- Bell correlation geometry and process causality use resource theory's
  structural scope; their statements need not formulate a conversion rate.
- The trace-exponential matrix-word inequality (`op_6cb323ea3ec0b70e`) has
  no natural operational field among the six. It is filed under Communication
  as mathematical support, with the topic “Matrix and entropy inequalities”.
- General Petz recovery inequalities stay under Communication. Recovery in
  an information inequality alone does not make it an error-correcting code
  problem. Capacity-only questions likewise do not automatically receive the
  Error Correction field.

## Choosing topics

Assign one to five topics; one precise topic is enough. Read the statement
and its hypotheses, then use the progress and comment to distinguish nearby
variants. A topic should help someone find a family of related questions.
Topics have independent membership and may occur across several fields.

The revision makes these distinctions:

- **Operational tasks:** quantum capacity, classical capacity, private
  capacity, source coding, channel simulation, discrimination, secret-key
  distillation, and quantum recovery receive their own topics.
- **Resource questions:** distinguish entanglement cost, distillation, and
  measures; distinguish bound entanglement from separability testing. Use
  “Entanglement-assisted communication” for consumption of preshared
  entanglement in communication, rather than calling all consumption an
  entanglement-cost problem.
- **Structures that matter:** AME states, Bell-diagonal states, bosonic
  channels, channel degradability, SIC measurements, and mutually unbiased
  bases identify substantive families. “Quantum channel structure” is for
  structural classifications and decompositions, not every channel problem.
- **Limits and mathematical questions:** relative entropy, matrix and
  entropy inequalities, additivity and regularization, strong converses,
  and one-shot and finite-blocklength bounds identify the claim being asked.
  These tags should not be added merely because a formula uses an entropy.
- **Processes and operations:** quantum combs describe ordered multi-slot
  access; a general process matrix is not automatically a quantum comb.
  Use “Indefinite causal order” for the general causality question. Use
  “Quantum magic” for the magic-resource problem, while graph-state
  equivalence belongs under “Local unitary equivalence”.

Dimension-only labels such as “Qubit systems” and “Qudit systems”, the generic
“Quantum channels”, and incidental tool tags such as “Combinatorics” or
“Convex optimization” are removed. Dimension and channel parameters remain
searchable in the authored statement. Avoid stacking bosonic,
continuous-variable, and Gaussian labels on the same capacity question.

Use an existing topic where it fits. Introduce a topic with its first actual
record only when it adds a useful distinction; a single-record topic is
reasonable for a distinct problem family. Keep the six fields fixed unless
the maintainer requests a revision. Do not maintain a separate tag mirror
inside an adding skill or a private authoring folder.

After changing assignments, follow the synchronization and validation steps
in [CONTRIBUTING.md](../CONTRIBUTING.md). The generated ledger taxonomy and
metadata slugs must agree with this registry. Historical contract fixtures
exercise older formats and do not define today's catalog vocabulary.
