# A flagged-state counterexample to the ordinary-Petz CMI bound

**Construction date:** 10 September 2026.

**Independent implementation audit:** 13 September 2026.

**Content license:** [CC BY 4.0](../../LICENSE-CONTENT). The accompanying
verification software is contributed under Apache-2.0.

This note gives a three-qubit counterexample to the universal inequality in
[op_87c77263c8bab523](https://qiqc-op.com/problem/op_87c77263c8bab523/).
It is structurally distinct from the two counterexamples already recorded in
the catalog: system B is a classical flag, and the calculation reduces to two
qubit branches. No claim of novelty, priority, or external peer review is made.
All logarithms have base two.

## Exact witness

Let $V$ map one qubit into $AC$ by

$$
V|0\rangle=|00\rangle_{AC},\qquad V|1\rangle=|11\rangle_{AC}.
$$

Define

$$
\rho=
\begin{pmatrix}
3/4&\sqrt3/4\\
\sqrt3/4&1/4
\end{pmatrix},\qquad
\sigma=
\begin{pmatrix}
1/2000&-1/75\\
-1/75&1999/2000
\end{pmatrix},
\qquad p=\frac{3000}{3001},\quad q=\frac1{3001}.
$$

Here $\rho$ is the projector onto
$(\sqrt3|0\rangle+|1\rangle)/2$, while

$$
\det\sigma=\frac{11591}{36000000}>0.
$$

Thus both matrices are density operators. In canonical ABC order, set

$$
\omega_{ABC}
=p|0\rangle\!\langle0|_B\otimes(V\sigma V^\dagger)_{AC}
+q|1\rangle\!\langle1|_B\otimes(V\rho V^\dagger)_{AC}.
$$

In the basis $|000\rangle,|001\rangle,\ldots,|111\rangle$, its only nonzero
entries are

$$
\begin{aligned}
\omega_{000,000}&=\frac3{6002},&
\omega_{000,101}=\omega_{101,000}&=-\frac{40}{3001},&
\omega_{101,101}&=\frac{5997}{6002},\\
\omega_{010,010}&=\frac3{12004},&
\omega_{010,111}=\omega_{111,010}&=\frac{\sqrt3}{12004},&
\omega_{111,111}&=\frac1{12004}.
\end{aligned}
$$

The matrix is therefore the direct sum of $p\sigma$, $q\rho$, and zero
blocks. It is a rank-three density operator.

## Petz-map reduction

Let $\Delta$ denote computational-basis dephasing and put

$$
\tau=p\sigma+q\rho
=\frac1{12004}
\begin{pmatrix}
9&\sqrt3-160\\
\sqrt3-160&11995
\end{pmatrix}.
$$

The required marginals are

$$
\omega_{AC}=V\tau V^\dagger,\qquad
\omega_C=\Delta(\tau)=\frac1{12004}\operatorname{diag}(9,11995),
$$

and

$$
\omega_{BC}=p|0\rangle\!\langle0|_B\otimes\Delta(\sigma)
+q|1\rangle\!\langle1|_B\otimes\Delta(\rho).
$$

Moreover,

$$
\det\tau=\frac{82352+320\sqrt3}{12004^2}>0,
$$

so $\omega_C$ is invertible. The ordinary, unrotated Petz map has Kraus
operators

$$
K_a=\sqrt{\omega_{AC}}
 (|a\rangle_A\otimes\omega_C^{-1/2}),\qquad a\in\{0,1\}.
$$

They obey

$$
\sum_aK_a^\dagger K_a
=\omega_C^{-1/2}(\operatorname{Tr}_A\omega_{AC})\omega_C^{-1/2}
=I_C.
$$

Consequently this is a completely positive trace-preserving realization of
the map in the problem statement, including on off-diagonal inputs.

For $X\in\{\sigma,\rho\}$, define

$$
T=\sqrt\tau
=\frac{\tau+\sqrt{\det\tau}\,I}{\sqrt{1+2\sqrt{\det\tau}}},
\qquad
R_X=T
\begin{pmatrix}
X_{00}/\tau_{00}&0\\
0&X_{11}/\tau_{11}
\end{pmatrix}T.
$$

Direct substitution gives

$$
(\operatorname{id}_B\otimes\mathcal P_{C\to AC})(\omega_{BC})
=p|0\rangle\!\langle0|_B\otimes(VR_\sigma V^\dagger)
+q|1\rangle\!\langle1|_B\otimes(VR_\rho V^\dagger).
$$

No rotated, pinched, averaged, or optimized recovery map is used.

## Scalar certificate

For a real qubit state $X$, set

$$
s(X)=h_2\!\left(
\frac{1+\sqrt{(X_{00}-X_{11})^2+4X_{01}^2}}2
\right),\qquad d(X)=h_2(X_{00}),
$$

where $h_2$ is binary entropy. Cancellation of the classical flag entropy
gives

$$
I(A;B\mid C)_\omega
=s(\tau)-p s(\sigma)-q s(\rho)
-d(\tau)+p d(\sigma)+q d(\rho).
$$

Here $s(\rho)=0$ because $\rho$ is a rank-one projector. Fidelity of matching
classical blocks satisfies

$$
\sqrt{F(\omega,\widehat\omega)}
=p\sqrt{F(\sigma,R_\sigma)}+q\sqrt{F(\rho,R_\rho)},
$$

where $\widehat\omega$ is the recovered state and squared qubit fidelity is

$$
F(X,Y)=\operatorname{Tr}(XY)+2\sqrt{\det X\det Y}.
$$

The script
[`verify-petz-flagged-counterexample.py`](../../scripts/verify-petz-flagged-counterexample.py)
evaluates these formulas with Arb real-ball arithmetic. Every input is built
from integers, rational operations, or an Arb enclosure of $\sqrt3$. At
256-bit precision, the enclosing balls have midpoints

$$
\begin{aligned}
I(A;B\mid C)_\omega
  &=0.0004344032356834737046396057452285155\ldots,\\
-\log_2 F(\omega,\widehat\omega)
  &=0.0004662358861763881520238977805169354\ldots,\\
I(A;B\mid C)_\omega+\log_2F(\omega,\widehat\omega)
  &=-0.0000318326504929144473842920352884199\ldots.
\end{aligned}
$$

Whole-ball comparisons, rather than midpoint comparisons, certify

$$
I(A;B\mid C)_\omega<\frac{435}{10^6}
<\frac{466}{10^6}
<-\log_2F(\omega,\widehat\omega),
$$

and also

$$
I(A;B\mid C)_\omega+\log_2F(\omega,\widehat\omega)
<-\frac{31}{10^6}.
$$

The first chain disproves the proposed universal inequality.

## Independent full-matrix audit

[`audit-petz-flagged-counterexample.py`](../../scripts/audit-petz-flagged-counterexample.py)
starts only from the six printed entries of the sparse $8\times8$ state. It
recomputes the partial traces by basis-index summation, constructs the Petz
map through its Kraus operators, evaluates all four entropy spectra, and
computes fidelity by a full-matrix singular-value decomposition. It does not
import the scalar reduction or the Arb verifier.

At 100 decimal digits this second path gives

| Quantity | Value |
| --- | --- |
| $S(AC)$ | 0.00702607711029351956847675589876 bits |
| $S(BC)$ | 0.0108021120495461350935661858495 bits |
| $S(C)$ | 0.00886463762889149345850112849133 bits |
| $S(ABC)$ | 0.00852914829526468749890220751171 bits |
| $I(A;B\mid C)$ | 0.000434403235683473704639605745229 bits |
| $-\log_2F$ | 0.000466235886176388152023897780517 bits |
| gap | -0.0000318326504929144473842920352884 bits |

The Kraus completeness residual is below $1.5\times10^{-101}$, and the
largest discarded null-space eigenvalue is below $2.7\times10^{-105}$. These
are high-precision diagnostics, not interval proofs; the strict sign is
supplied by the Arb calculation.

## Reproduction and scope

The recorded runs used Python 3.11 and the pinned packages in
[`requirements-petz-flagged.txt`](../../scripts/requirements-petz-flagged.txt).
From the repository root, run

```sh
python3 -m pip install -r scripts/requirements-petz-flagged.txt
python3 scripts/verify-petz-flagged-counterexample.py
python3 scripts/audit-petz-flagged-counterexample.py
```

The certificate is relative to the displayed analytic reduction, Python, and
the `python-flint` bindings to Arb. The independent matrix calculation reduces
the risk of a shared implementation error, but neither calculation is a
proof-assistant kernel verification or external peer review. The result only
concerns the ordinary, unrotated Petz map; established bounds using rotated,
averaged, pinched, universal, or optimized recovery maps are unaffected.
