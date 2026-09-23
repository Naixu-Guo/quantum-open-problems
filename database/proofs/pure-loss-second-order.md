# Fixed-photon condensate codes refute the candidate pure-loss second-order converse

**Result by:** Yue Tu and Yifan Jing (University of Michigan), 23 September 2026.  
**Content license:** [CC BY 4.0](../../LICENSE-CONTENT), selected by both contributors.
No external peer review and no claim of historical priority is asserted.

This note resolves [op_89fb664ba06ba5de](https://qiqc-op.com/problem/op_89fb664ba06ba5de/)
negatively. For every $0<\eta<1$, $N_S>0$, $c>0$ and $0<\varepsilon<\tfrac12$, the
candidate upper bound

$$
\log_2 M^*_{\rm occ}\le ng(\eta N_S)+\sqrt{n\,v(\eta N_S)}\,\Phi^{-1}(\varepsilon)+O(\log n)
$$

fails. The reason is that the occupation-constrained dispersion is
$V_{\rm occ}=\frac{1-\eta}{1+\eta N_S}\,v(\eta N_S)<v(\eta N_S)$. Codewords with an
exact photon number remove the input photon-number fluctuations of the thermal ensemble.

## Machine-checked part

The disproof, meaning the achievability half below with any $\sqrt n$ coefficient strictly
between $\sqrt{v}\,\Phi^{-1}(\varepsilon)$ and $\sqrt{V_{\rm occ}}\,\Phi^{-1}(\varepsilon)$,
is formally verified in Lean 4 with Mathlib:
[Ivann1242/pure-loss-second-order-lean](https://github.com/Ivann1242/pure-loss-second-order-lean/tree/af47f65fba5bd3c81d5e8f0bec45c8ce331e1d83) (commit `af47f65fba5bd3c81d5e8f0bec45c8ce331e1d83`), theorem `QIQCOP.conjecture_false_all`.
The build has no `sorry` and no custom axioms. `#print axioms` lists only `propext`,
`Classical.choice` and `Quot.sound`. The formal statement quantifies over all codes whose input
states lie in the $\le\lceil nN_S\rceil$-photon subspace. Such codes satisfy the occupation
constraint with $\delta_n=0$, so each gives a lower bound on $M^*_{\rm occ}$ for every $c>0$.

The formal proof differs from the paper argument below in three places, and none of them
affects the conclusion:

- the pure-loss channel is defined by its standard Fock-basis Kraus operators
  $A_\ell|m\rangle=\prod_j\sqrt{\binom{m_j}{\ell_j}\eta^{m_j-\ell_j}(1-\eta)^{\ell_j}}\,|m-\ell\rangle$
  (trace preservation is proved; equivalence with the beam-splitter definition is the
  textbook derivation and is not formalized);
- Haar-random directions are replaced by a finite ensemble (amplitudes $\sqrt{r_j/R}$ over
  compositions $r$ of $R$, phases in the $N$th roots of unity), whose overlap moment is at most
  $e/D_{n,t}$;
- Berry–Esseen is replaced by the de Moivre–Laplace limit (characteristic functions, Lévy
  continuity and Portmanteau from Mathlib), which suffices for a strict gap in the $\sqrt n$
  coefficient.

The exact expansion (T) with an $O(\log n)$ remainder, and the matching converse of §§3–4, are
proved on paper only.

## Theorem (paper proof)

Fix transmissivity $0<\eta<1$, energy parameter $N_S>0$, error $0<\varepsilon<1$, and leakage exponent $c>0$. Put

$$
x=\eta N_S,\qquad
V_{\rm occ}=\eta(1-\eta)N_S\left[\log_2(1+1/x)\right]^2.
$$

For the maximum message count in the question,

$$
\boxed{\log_2 M^*_{\rm occ}(n,\eta,N_S,\varepsilon,c)
=ng(x)+\sqrt{nV_{\rm occ}}\,\Phi^{-1}(\varepsilon)+O(\log n).}
\tag{T}
$$

The constants in the remainder may depend on the four fixed parameters. Here $g(x)=(x+1)\log_2(x+1)-x\log_2 x$.

In comparison, the proposed thermal coefficient is

$$
v(x)=x(x+1)\left[\log_2(1+1/x)\right]^2,
\qquad \frac{V_{\rm occ}}{v(x)}=\frac{1-\eta}{1+\eta N_S}<1.
$$

For every fixed $0<\varepsilon<1/2$, the normal quantile is negative. Thus (T) exceeds the proposed upper-bound expression by a positive constant times $\sqrt n$, up to $O(\log n)$. No choice of the conjectured logarithmic remainder can repair this. For $\varepsilon>1/2$ the proposed coefficient instead gives a looser upper bound; at $\varepsilon=1/2$ the second-order terms vanish.

## 1. Photon sectors and a finite-block coding bound

Write $L=\lceil nN_S\rceil$, and let $K\sim\operatorname{Bin}(L,\eta)$. The sector of exactly $k$ photons in $n$ modes has dimension

$$
D_{n,k}=\binom{n+k-1}{k}.
$$

For each unit vector $u\in\mathbb C^n$, define the normalized condensate state

$$
|u;k\rangle=\frac{(\sum_{j=1}^n u_j a_j^\dagger)^k}{\sqrt{k!}}|0\rangle.
\tag{1}
$$

Choose codeword directions $u_1,\ldots,u_M$ independently and uniformly on the complex unit sphere, and send $|u_m;L\rangle$. Every codeword has exactly $L$ photons. In particular, the required occupation constraint holds with $\delta_n=0$, for every $c>0$.

Identical pure loss in all modes acts as

$$
\mathcal N_\eta^{\otimes n}(|u;L\rangle\langle u;L|)
=\sum_{k=0}^L\binom Lk\eta^k(1-\eta)^{L-k}
 |u;k\rangle\langle u;k|.
\tag{2}
$$

To verify (2), the beam splitter sends the populated input mode creation operator to $\sqrt\eta\,a_u^\dagger+\sqrt{1-\eta}\,e_u^\dagger$. Expand its $L$th power and trace the environment. Terms with different environment photon numbers are orthogonal. Conditioned on $k$ surviving photons, the receiver therefore has the pure state $|u;k\rangle$, with a message-independent binomial probability.

For two independent directions,

$$
\langle u;k|v;k\rangle=\langle u|v\rangle^k,
\qquad
\mathbb E|\langle u;k|v;k\rangle|^2=\frac1{D_{n,k}}.
\tag{3}
$$

For $n\ge2$, the last identity is the elementary beta integral

$$
(n-1)\int_0^1 t^k(1-t)^{n-2}\,dt
=\frac{k!(n-1)!}{(n+k-1)!}.
$$

The asymptotic theorem only uses $n\ge2$; the overlap identity also holds for $n=1$.

### A self-contained square-root measurement estimate

For arbitrary normalized vectors $\psi_1,\ldots,\psi_M$, let $G_{ij}=\langle\psi_i|\psi_j\rangle$. The square-root measurement, using the inverse on the support of $\sum_i|\psi_i\rangle\langle\psi_i|$, has mean success

$$
P_{\rm s}=\frac1M\sum_i (\sqrt G)_{ii}^2.
$$

This holds also when the Gram matrix is singular, by polar decomposition of the matrix with columns $\psi_i$. Complete the measurement arbitrarily on its unused orthogonal complement. Since $\operatorname{Tr}G=M$,

$$
\begin{aligned}
P_{\rm e}
&\le \frac2M\sum_i[1-(\sqrt G)_{ii}]\\
&=\frac1M\|\sqrt G-I\|_F^2\\
&\le\frac1M\|G-I\|_F^2
=\frac1M\sum_{i\ne j}|G_{ij}|^2.
\end{aligned}
\tag{4}
$$

The first inequality uses $1-a^2\le2(1-a)$; the second uses $(\sqrt\lambda-1)^2\le(\lambda-1)^2$ for every $\lambda\ge0$.

The receiver first measures total output photon number. In sectors $k\ge t$, apply the square-root measurement for that sector's codewords; in smaller sectors output any label. By (3)–(4), the expected error of this *single common codebook* obeys

$$
\mathbb E P_{\rm e}
\le\Pr\{K<t\}+(M-1)\sum_{k=t}^L\frac{\Pr\{K=k\}}{D_{n,k}}
\le\Pr\{K<t\}+\frac{M-1}{D_{n,t}}.
\tag{5}
$$

The second inequality uses monotonicity of $D_{n,k}$ in $k$. Averaging over the codebook proves existence of a deterministic finite code attaining this bound. The decoder is a valid single POVM obtained by the direct sum of the sector measurements. Neither shared randomness nor postselection at the transmitter is required.

Equation (5) is a nonasymptotic achievability bound.

## 2. Extracting the achievable second-order coefficient

Set $\gamma_n=n^{-1/2}$, and take sufficiently large $n$ so that $\varepsilon-\gamma_n>0$. Let

$$
t_n=\min\{k:\Pr\{K\le k\}\ge\varepsilon-\gamma_n\}.
$$

Then $\Pr\{K<t_n\}<\varepsilon-\gamma_n$. Choose

$$
M_n=\left\lfloor\gamma_n D_{n,t_n}\right\rfloor.
$$

For large $n$ this is positive and (5) gives error at most $\varepsilon$. The binomial central limit estimate with uniform $O(L^{-1/2})$ distribution-function error gives

$$
t_n=\eta L+\sqrt{L\eta(1-\eta)}\,\Phi^{-1}(\varepsilon)+O(1).
\tag{6}
$$

For completeness, the $O(1)$ quantile remainder follows because the normal density is positive in a fixed neighborhood of the fixed quantile. Both the Berry–Esseen CDF error and the probability shift $\gamma_n$ are $O(n^{-1/2})$; inversion therefore changes the standardized quantile by $O(n^{-1/2})$, or the unstandardized integer threshold by $O(1)$.

For $k=nx+O(\sqrt n)$, Stirling's formula gives

$$
\log_2 D_{n,k}=ng(k/n)+O(\log n)
=ng(x)+(k-nx)g'(x)+O(\log n),
\tag{7}
$$

where $g'(x)=\log_2(1+1/x)$; the quadratic Taylor remainder is $O(1)$. Substituting (6), using $L=nN_S+O(1)$, and accounting for $\log_2\gamma_n=-\tfrac12\log_2 n$ and integer rounding yields

$$
\log_2 M_n
\ge ng(x)+\sqrt{nV_{\rm occ}}\,\Phi^{-1}(\varepsilon)-O(\log n).
\tag{8}
$$

This already disproves the proposed converse for $\varepsilon<1/2$.

## 3. A finite-block converse for arbitrary encodings

The remaining argument proves the matching upper bound, including arbitrary coherence between photon sectors and the allowed input leakage.

First, for any equiprobable ensemble of density operators $\sigma_m$, any decoding POVM $\Lambda_m$, and any finite-rank projector $P$ of rank $D$, put

$$
q=\frac1M\sum_m\operatorname{Tr}[(I-P)\sigma_m].
$$

Then

$$
P_{\rm s}\le\left(\sqrt{D/M}+\sqrt q\right)^2.
\tag{9}
$$

To prove this without discarding coherences, define
$A_m=\Lambda_m^{1/2}P\sigma_m^{1/2}$ and
$B_m=\Lambda_m^{1/2}(I-P)\sigma_m^{1/2}$.
The triangle inequality in the direct sum of Hilbert–Schmidt spaces gives

$$
\sqrt{P_{\rm s}}\le
\left(\frac1M\sum_m\|A_m\|_2^2\right)^{1/2}
+\left(\frac1M\sum_m\|B_m\|_2^2\right)^{1/2}.
$$

Because $0\le\sigma_m\le I$, the first squared term is at most
$M^{-1}\sum_m\operatorname{Tr}(\Lambda_m P)=D/M$.
Because $0\le\Lambda_m\le I$, the second is at most $q$. This proves (9), also on the infinite-dimensional output space.

Now take $P=\Pi_r$, the projector onto at most $r$ output photons. Its rank is

$$
\overline D_{n,r}=\sum_{k=0}^r D_{n,k}=\binom{n+r}{r}.
\tag{10}
$$

Let $\Pi^{\rm in}_\ell$ project onto exactly $\ell$ input photons. The photon-counting effect pulled back through the channel is

$$
(\mathcal N_\eta^{\otimes n})^*(I-\Pi_r)
=\sum_{\ell\ge0}\Pr\{\operatorname{Bin}(\ell,\eta)>r\}\,
\Pi^{\rm in}_\ell.
\tag{11}
$$

Indeed, on an input multimode Fock vector, independent thinning of the photons produces a binomial count with total trial number $\ell$. Independent phase covariance makes this counting effect diagonal in the multimode Fock basis, and its diagonal entry depends only on total photon number. This also proves (11) for inputs with arbitrary off-diagonal terms.

Binomial upper tails are nondecreasing in trial number, by coupling with additional Bernoulli trials. If the ensemble has mean leakage $\delta_n$ beyond $L$, (11) implies

$$
q\le\Pr\{K>r\}+\delta_n.
\tag{12}
$$

There is no per-message cutoff assumption here: only the mean occupation condition from the question is used.

Combining (9)–(12), any admissible code with success at least $1-\varepsilon$ satisfies

$$
M\le\frac{\overline D_{n,r}}
{\left[\sqrt{1-\varepsilon}-\sqrt{\Pr\{K>r\}+\delta_n}\right]^2}
\tag{13}
$$

whenever the bracket is positive. Replacing $\delta_n$ by its allowed upper bound $2^{-cn}$ gives a bound uniform over admissible codes. Equation (13) is a nonasymptotic converse.

## 4. Matching asymptotics

Choose $r_n$ as the lower binomial quantile at probability
$\varepsilon+\gamma_n+2^{-cn}$, again with $\gamma_n=n^{-1/2}$. For all sufficiently large $n$, this probability is less than one. Then

$$
\Pr\{K>r_n\}+\delta_n\le1-\varepsilon-\gamma_n.
$$

The denominator in (13) is at least

$$
\left(\frac{\gamma_n}
{\sqrt{1-\varepsilon}+\sqrt{1-\varepsilon-\gamma_n}}\right)^2
\ge\frac{\gamma_n^2}{4}.
$$

Consequently,

$$
\log_2 M\le\log_2\overline D_{n,r_n}+\log_2(4n).
\tag{14}
$$

The same quantile argument as in (6) gives

$$
r_n=\eta L+\sqrt{L\eta(1-\eta)}\,\Phi^{-1}(\varepsilon)+O(1).
$$

Finally,
$\overline D_{n,r}/D_{n,r}=(n+r)/n$, whose logarithm is $O(1)$ in this regime. Thus (7) and (14) prove the upper half of (T). Together with (8), this completes the proof.

## References

1. M. M. Wilde, J. M. Renes, and S. Guha, "Second-order coding rates for pure-loss bosonic channels," *Quantum Inf. Process.* **15**, 1289–1308 (2016), [arXiv:1408.5328](https://arxiv.org/abs/1408.5328).
2. M. M. Wilde and A. Winter, "Strong converse for the classical capacity of the pure-loss bosonic channel," *Probl. Inf. Transm.* **50**, 117–132 (2014), [arXiv:1308.6732](https://arxiv.org/abs/1308.6732).
