# Classifying problems

`tags.json` is the canonical vocabulary. Classification changes must
preserve statements, evidence, statuses, identifiers, and aliases.

The Quantum Foundations field and the associated field and topic refinements
follow [issue #125](https://github.com/Naixu-Guo/quantum-open-problems/issues/125),
proposed by Yujie Zhang (University of Waterloo).

## Field boundaries

Use the exact names from `tags.json`. Put the primary field first. Add a
second field when it captures another central aspect of the question.

| Field | Scope in this catalog |
| --- | --- |
| Quantum Computation | Algorithms, computability, circuit and Hamiltonian complexity, gate structure, state preparation, quantum simulation, and verification of quantum computation. |
| Quantum Information Theory | Channel capacities, information transmission and compression, channel simulation and structure, information measures, entropy and divergence inequalities, and recoverability. |
| Quantum Statistical Inference | State and channel discrimination, hypothesis testing, parameter estimation, tomography, Hamiltonian learning, and the measurements and statistical limits of these tasks. |
| Quantum Cryptography | Secret-key distillation and agreement, private communication, privacy amplification, device-independent security, position-based protocols, and computational primitives such as pseudorandom unitaries and one-way state generators. |
| Quantum Resource Theory | The structure, quantification, and conversion of entanglement, magic, thermodynamic and optical resources, and the resource aspects of nonlocality, steering, and causal processes. |
| Quantum Error Correction | Code constructions and limitations, encoders and decoders, quantum LDPC codes, fault-tolerant logical gates, self-correcting memories, and AME existence with an explicit coding formulation. |
| Quantum Foundations | The fundamental structure of quantum states, measurements, and processes, including Bell nonlocality, steering, contextuality, classical, quantum, and nonsignalling correlations, SIC-POVMs, mutually unbiased bases, uncertainty, and phase-space nonclassicality. Quantum causal models, including higher-order processes and indefinite causal order, interpretations of quantum mechanics, quantum reference frames, and quantum gravity also belong here. |
| Quantum Dynamics and Many-Body Theory | Physical evolution and its approximations, open quantum systems, continuous monitoring and control, thermalization and Gibbs sampling, and tensor-network representations of many-body states. |

- Generic discrimination and estimation belong in Statistical Inference.
  A physical sensing or precision-measurement objective also earns the topic
  “Quantum sensing and metrology”. Efficient decoding of a communication
  code can use Computation and Information Theory with the discrimination
  topic. A generalized Stein lemma with specified free channel families can
  use Resource Theory first and Statistical Inference second.
- Classify structural measurement questions in Foundations, including SIC
  existence and symmetry, mutually unbiased basis existence, and Gaussian
  POVM representation. Place statistical Bell tests in Foundations with
  hypothesis testing as a topic when the test criterion drives the question.
  Quantum causal models and steering thresholds also belong in Foundations.
- Add Resource Theory to a Foundations question when resource structure,
  simulation, or conversion is central, as in many-copy activation of Bell
  nonlocality or simulation with nonsignalling resources.
- Classical simulation of quantum correlations with an explicit communication
  budget can use Foundations first and Information Theory second. Secret-key
  generation from Bell-nonlocal behavior uses Cryptography first and
  Foundations second.
- Phase-space uncertainty and constraints on physical Wigner-positive states
  belong in Foundations. Use Foundations first and Information Theory second
  for the quantum Zhang–Yeung question about extending classical entropy
  constraints to arbitrary quantum states. General entropy and recovery
  inequalities, including Petz recovery, belong in Information Theory.
  Use Error Correction when an explicit code construction or limitation is
  part of the question.
- The trace-exponential matrix-word inequality (`op_6cb323ea3ec0b70e`) is
  included as supporting mathematics under Information Theory, with the
  topic “Matrix and entropy inequalities”.
- Use Dynamics and Many-Body Theory for rigorous effective models, stationary
  squeezing, monitoring, and thermal-state representations. Add Computation
  when a preparation or simulation algorithm is central, as in Gibbs-sampler
  mixing. Use Resource Theory when a resource cost or conversion under
  specified operations drives the question.
- The bipartite classical secret-key superactivation question is an explicit
  comparator to the quantum state and channel variants. It uses Cryptography
  with the topic “Classical secret-key agreement”.

## Choosing topics

Assign one to five topics. One precise topic is enough. Read the statement
and its hypotheses, then use the progress and comment to distinguish nearby
variants. Topics have independent membership and can appear across fields.

- **Operational tasks.** Use distinct topics for communication capacities,
  source coding, channel simulation, discrimination, privacy amplification,
  and quantum recovery. “Quantum hypothesis testing” applies when error
  tradeoffs, exponents, or composite hypotheses drive the question. A channel
  Stein problem can carry both hypothesis testing and channel discrimination.
- **Estimation and learning.** Use “Quantum tomography” for reconstruction of
  states, channels, or a list of observable expectations. Use “Hamiltonian
  learning” for identifying unknown interactions. “Quantum estimation” covers
  other estimation tasks such as attaining precision bounds for a parameter.
- **Cryptography.** Use “Private capacity” for private message transmission,
  “Secret-key capacity” for key agreement over channels, “Secret-key
  distillation” for extracting keys from shared resources, and “Privacy
  amplification” for secrecy extracted by hashing against side information.
  “Quantum pseudorandomness” and “One-way state generators” identify distinct
  computational primitives.
- **Resource questions.** Distinguish entanglement cost, distillation, and
  measures, and distinguish bound entanglement from separability testing. Use
  “Entanglement-assisted communication” when preshared entanglement is
  consumed to communicate.
- **Structures that matter.** AME states, Bell-diagonal states, bosonic
  channels, channel degradability, SIC measurements, and mutually unbiased
  bases identify substantive families. Use “Quantum channel structure” for
  structural classifications and decompositions.
- **Limits and mathematical questions.** Relative entropy, matrix and
  entropy inequalities, additivity and regularization, strong converses,
  and one-shot and finite-blocklength bounds should identify the claim being
  asked. Tag the mathematical property investigated by the statement.
- **Dynamics and circuits.** Use “Hamiltonian simulation” for implementing a
  target evolution by a simulator or algorithm. Use “Rotating-wave
  approximation” for the validity of the effective model and “Tensor
  networks” for representation questions. “Random quantum circuits” covers
  questions such as mixing of random unitaries. “Random circuit sampling”
  concerns sampling the output distributions of random circuits.
- **Processes and operations.** Quantum combs describe ordered multi-slot
  access. Use “Indefinite causal order” for the general causality question.
  Use “Quantum magic” for the magic-resource problem and “Local unitary
  equivalence” for graph-state equivalence.
- **Coding questions.** “Quantum LDPC codes” requires both bounded check
  weight and bounded qubit degree. A bounded-weight question allowing
  unbounded degree uses “Quantum coding theory”. Use “Decoding algorithms”
  when a decoder’s construction or algorithmic performance is part of the
  question.
- **Optical resources and phase space.** Use “Optical nonclassicality” for
  nonclassical-state conversion under optical operations. Use “Gaussian
  quantum information” when a Gaussian restriction is part of the question
  and “Wigner functions” for assumptions about or properties of those
  functions, such as positivity.

Use an existing topic where it fits. Introduce a topic with its first actual
record when it adds a useful distinction. Dimension and channel parameters
are searchable in statements. Reserve topics for substantive families and
avoid overlapping tags for the same setting.

After changing assignments, follow [CONTRIBUTING.md](../CONTRIBUTING.md) to
synchronize and check the registry, metadata, TeX mirrors, and ledger.
Field renames also need [field aliases](../shared/field-aliases.json) for
existing links and filters. Historical contract fixtures exercise older
formats and retain their original vocabulary.
