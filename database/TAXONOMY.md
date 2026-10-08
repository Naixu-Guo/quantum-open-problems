# Classifying problems

`tags.json` is the canonical vocabulary. Classification changes must
preserve statements, evidence, statuses, identifiers, and aliases.

The Quantum Foundations field and the associated field and topic refinements
follow [issue #125](https://github.com/Naixu-Guo/quantum-open-problems/issues/125),
proposed by Yujie Zhang (University of Waterloo).

## Field boundaries

Use these exact spellings from `tags.json`. The requested spelling of
“Quantum algorithm” and “Quantum metrology” is retained; “Cryptography” and
“Resource Theory” correct the spelling in the request.

| Field | Scope in this catalog |
| --- | --- |
| Quantum algorithm | Algorithms, circuit and Hamiltonian complexity, computability, state preparation, simulation, and verification of quantum computation. |
| Quantum Communication | Transmission and compression, channel capacities and simulation, and their supporting channel structure, divergence, recovery, and entropy questions. |
| Quantum metrology | Parameter estimation, tomography, state and channel discrimination, measurement design for those tasks, and their statistical limits. |
| Quantum Cryptography | Secret-key distillation, private communication, device-independent security, and position-based protocols. |
| Quantum Resource Theory | Entanglement, magic, thermodynamic and optical resources, their structure and conversion; nonlocality, steering, and causal processes when their resource character is central to the question. |
| Quantum Error Correction | Code constructions and limitations, quantum LDPC codes, self-correcting memories, and AME existence questions with explicit coding formulations. |
| Quantum Foundations | The fundamental structure of quantum states, measurements, and other quantum processes, including Bell nonlocality, steering, contextuality, classical, quantum, and nonsignalling correlations, SIC-POVMs and mutually unbiased bases, uncertainty, and phase-space nonclassicality; quantum causal models, including higher-order quantum processes and indefinite causal order; interpretations of quantum mechanics; quantum reference frames; and quantum gravity. |

A problem can have two fields. Put its primary
field first. Add a second when it captures another central aspect of the
question, rather than a possible future application.

These are catalog conventions, not an assertion that all quantum information
subfields have a unique place in a seven-field classification. In particular:

- SIC existence and symmetry, mutually unbiased basis existence, Bell
  correlation geometry, steering thresholds, and process causality belong
  in Foundations. Optimizing a Bell test's measurements does not by itself
  place the question in Metrology.
- Add Resource Theory to a Foundations question when resource structure,
  simulation, or conversion is central, as in many-copy activation of Bell
  nonlocality or simulation with nonsignalling resources.
- Classical simulation of quantum correlations with an explicit communication
  budget can use Foundations first and Communication second. Secret-key
  generation from Bell-nonlocal behavior uses Cryptography first and
  Foundations second.
- Phase-space uncertainty and constraints on physical Wigner-positive states
  belong in Foundations. Whether classical entropy constraints hold for
  arbitrary quantum states can use Foundations first and Communication
  second under its supporting entropy scope.
- The trace-exponential matrix-word inequality (`op_6cb323ea3ec0b70e`) has
  no natural operational field among the seven. It is filed under Communication
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
- **Dynamical approximation:** use “Hamiltonian simulation” for rigorous approximation of Hamiltonian evolution, including the rotating-wave limit. “Hamiltonian complexity” concerns computational complexity of Hamiltonian problems.
- **Processes and operations:** quantum combs describe ordered multi-slot
  access; a general process matrix is not automatically a quantum comb.
  Use “Indefinite causal order” for the general causality question. Use
  “Quantum magic” for the magic-resource problem, while graph-state
  equivalence belongs under “Local unitary equivalence”.
- **Coding questions:** “Quantum LDPC codes” requires both bounded check
  weight and bounded qubit degree. A bounded-weight question allowing
  unbounded degree uses “Quantum coding theory”. Use “Decoding algorithms”
  when a decoder's construction or algorithmic performance is part of the
  question, rather than for code-family existence with arbitrary decoders.
- **Optical resources:** use “Optical nonclassicality” for nonclassical-state
  conversion under optical operations when the states or measurements need
  not be Gaussian. Use “Gaussian quantum information” when the Gaussian
  restriction is part of the question.

Dimension-only labels such as “Qubit systems” and “Qudit systems”, the generic
“Quantum channels”, and incidental tool tags such as “Combinatorics” or
“Convex optimization” are removed. Dimension and channel parameters remain
searchable in the authored statement. Avoid stacking bosonic,
continuous-variable, and Gaussian labels on the same capacity question.

Use an existing topic where it fits. Introduce a topic with its first actual
record only when it adds a useful distinction; a single-record topic is
reasonable for a distinct problem family. Keep the registered fields fixed unless
the maintainer requests a revision. Do not maintain a separate tag mirror
inside an adding skill or a private authoring folder.

After changing assignments, follow the synchronization and validation steps
in [CONTRIBUTING.md](../CONTRIBUTING.md). The generated ledger taxonomy and
metadata slugs must agree with this registry. Historical contract fixtures
exercise older formats and do not define today's catalog vocabulary.
