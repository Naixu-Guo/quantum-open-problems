# Two three-qubit counterexamples to the ordinary-Petz CMI bound

**Counterexamples submitted by:** Peter, 10 September 2026 (UTC).  
**Editorial verification:** 12 September 2026.  
**Content license:** [CC BY 4.0](../../LICENSE-CONTENT), as explicitly selected with both project-inbox submissions. The note consolidates and edits those submissions and adds an independent verifier. No claim of historical priority or external peer review is made. The verifier is independently written project software under Apache-2.0.

This note resolves the universal inequality in
[op_87c77263c8bab523](https://qiqc-op.com/problem/op_87c77263c8bab523/).
It concerns the ordinary, unrotated Petz map with the compatible marginals of a
single tripartite state. All systems are qubits and all logarithms have base two.

For a state $\rho_{ABC}$, set

$$
I(A;B\mid C)_\rho=S(\rho_{AC})+S(\rho_{BC})-S(\rho_C)-S(\rho_{ABC}),
\qquad S(\tau)=-\operatorname{Tr}(\tau\log_2\tau).
$$

Define

$$
\mathcal P_{C\to AC}(X)=\rho_{AC}^{1/2}
 (I_A\otimes\rho_C^{-1/2}X\rho_C^{-1/2})\rho_{AC}^{1/2},
\qquad \sigma=(\operatorname{id}_B\otimes\mathcal P)(\rho_{BC}),
$$

with the output permuted into $ABC$ order, and use **squared** fidelity
$F(\rho,\sigma)=\|\sqrt\rho\sqrt\sigma\|_1^2$.
Both examples below satisfy

$$
\Delta:=I(A;B\mid C)_\rho+\log_2F(\rho,\sigma)<0.
$$

Consequently the conjectured universal bound $I(A;B\mid C)\geq-\log_2F$
is false. This does not contradict bounds using an optimized recovery map or
an average of rotated Petz maps.

## Rank-three example

In computational order $000,001,010,011,100,101,110,111$, let

$$
v_1=4|111\rangle,\qquad v_2=3(|011\rangle-|101\rangle),\qquad
v_3=5|001\rangle+|010\rangle+|100\rangle,
\qquad \rho=\frac{\sum_{j=1}^3|v_j\rangle\langle v_j|}{61}.
$$

The vectors are orthogonal with squared norms $16,18,27$. Thus $\rho$ is a
rank-three density matrix with nonzero spectrum $(16,18,27)/61$. Partial traces give

$$
\rho_{AC}=\rho_{BC}=\frac1{61}
\begin{pmatrix}1&0&0&0\\0&34&5&0\\0&5&1&0\\0&0&0&25\end{pmatrix},
\qquad \rho_C=\frac1{61}\operatorname{diag}(2,59).
$$

Both two-body marginals have spectrum
$\{1/61,25/61,(35-\sqrt{1189})/122,(35+\sqrt{1189})/122\}$.
All marginal eigenvalues are strictly positive.

Write $N=[v_1\ v_2\ v_3]$ and $K=N^\dagger\sigma N/61$.
Exact evaluation of the Petz map yields

$$
K=\operatorname{diag}\left(
\frac{10000}{219539},\quad
\frac{1256625}{18002198}-\frac{1125\sqrt{4838}}{9001099},\quad
\frac{1253419}{9001099}+\frac{950\sqrt{4838}}{9001099}
\right).
$$

Since $\rho=NN^\dagger/61$, the nonzero eigenvalues of
$\sqrt\rho\,\sigma\sqrt\rho$ equal those of $K$: apply the equality of the
nonzero spectra of $TT^\dagger$ and $T^\dagger T$, first to
$T=\sqrt\sigma\sqrt\rho$ and then to $T=\sqrt\sigma N/\sqrt{61}$.
Therefore $F=(\operatorname{Tr}\sqrt K)^2$.

The independent certificate encloses the quantities as follows; the decimal
endpoints are rounded outwards:

| Quantity | Lower bound | Upper bound |
| --- | --- | --- |
| $I(A;B\mid C)$ | 0.486653559757968335 | 0.486653559757968336 |
| $F$ | 0.711499762463045866 | 0.711499762463045867 |
| $-\log_2 F$ | 0.491064819784856878 | 0.491064819784856879 |
| $\Delta$ | -0.004411260026888543 | -0.004411260026888542 |

In particular, $-0.004412<\Delta<-0.0044<0$.

## Rank-two example

The earlier submission gives another counterexample:

$$
v=10|000\rangle+|011\rangle+|101\rangle,\qquad
w=|010\rangle-|100\rangle,\qquad
\rho=\frac{|v\rangle\langle v|+|w\rangle\langle w|}{104}.
$$

Here $v\perp w$ with squared norms $102,2$. The marginal matrices are

$$
\rho_{AC}=\rho_{BC}=\frac1{104}
\begin{pmatrix}101&0&0&10\\0&1&0&0\\0&0&1&0\\10&0&0&1\end{pmatrix},
\qquad \rho_C=\frac1{104}\operatorname{diag}(102,2).
$$

The nonzero spectra of $\rho$ and $\rho_C$ are both $\{51/52,1/52\}$;
the two-body marginal spectra are
$\{(51-10\sqrt{26})/104,(51+10\sqrt{26})/104,1/104,1/104\}$.
For $N=[v\ w]$, the exact fidelity matrix is

$$
\frac{N^\dagger\sigma N}{104}
=\operatorname{diag}\left(
\frac{13460851+5150\sqrt{1326}}{14342016},\quad
\frac{3251-50\sqrt{1326}}{14342016}\right).
$$

Applying the same fidelity reduction gives:

| Quantity | Lower bound | Upper bound |
| --- | --- | --- |
| $I(A;B\mid C)$ | 0.041249766078611949 | 0.041249766078611950 |
| $F$ | 0.971219850913972976 | 0.971219850913972977 |
| $-\log_2 F$ | 0.042130185523516769 | 0.042130185523516770 |
| $\Delta$ | -0.000880419444904821 | -0.000880419444904820 |

Thus $-0.000881<\Delta<-0.000880<0$. The first submission referenced a ZIP
archive that was not present in the inbox; verification here reconstructs this
example independently from its two displayed vectors.

## Reproducing the certificate

Run [the independent verifier](../../scripts/verify-petz-counterexamples.py):

```sh
python3 scripts/verify-petz-counterexamples.py
```

It requires SymPy; the recorded verification used version 1.14.0. Run without
Python's `-O` option so assertions remain enabled; the script refuses optimized
execution. The script starts only from the five vectors above. It recomputes
partial traces, positive square roots, canonical tensor ordering, the recovered
state, spectra and fidelity matrices. It checks normalization and positive
marginal spectra. The recovered state is positive because it is explicitly a
congruence of $I_A\otimes\rho_{BC}$, and the script checks its trace is one.

For each positive $2\times2$ block $M$, the square root is derived using
$(M+\sqrt{\det M}\,I)/\sqrt{\operatorname{Tr}M+2\sqrt{\det M}}$.
Its square and positive leading principal minors are checked exactly.

All final enclosures use `Fraction` arithmetic, with no floating-point sign
decision. For a positive rational $x$, integer square root supplies a bracket
$n/10^{40}\leq\sqrt{x}<(n+1)/10^{40}$; both inequalities are checked.
For logarithms, write $x=2^e y$ with $1\leq y<2$, and use

$$
\log_2x=e+\frac{\ln y}{\ln2},\qquad
\ln y=2\sum_{j=0}^{59}\frac{z^{2j+1}}{2j+1}+R,
\quad z=\frac{y-1}{y+1},\quad
0\leq R\leq\frac{2z^{121}}{121(1-z^2)}.
$$

The remainder bound follows by replacing all omitted denominators by 121 and
summing a geometric series. Interval arithmetic propagates these bounds through
the entropy, fidelity and gap. The final assertions certify the strict negative
rational bounds for both examples. This is a reproducible computer-assisted
certificate, not a proof-assistant kernel formalization.

## Literature and attribution

The precise ordinary-Petz conjecture is stated in K. P. Seshadreesan and
M. M. Wilde, *Fidelity of recovery, squashed entanglement, and measurement
recoverability*, Physical Review A **92**, 042321 (2015),
[DOI](https://doi.org/10.1103/PhysRevA.92.042321),
[arXiv:1410.1441](https://arxiv.org/abs/1410.1441), equations (1.4), (1.6)
and (1.7) in the arXiv version. Its title there includes “geometric”.

The counterexamples and rank-three symbolic reduction were supplied by Peter;
this note consolidates the submissions, corrects formatting, and supplies a
fresh verifier that also derives the rank-two reduction. Attribution identifies
the contributor as requested and does not assert novelty. The cited papers
retain their own rights and are not relicensed by this note.
