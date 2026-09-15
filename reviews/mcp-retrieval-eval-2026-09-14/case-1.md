抽到了：**低能量哈密顿量模拟的最优精度依赖**。

这是从 QIQCOP Zoo「量子算法」类别的 **25 道未解决问题中均匀随机抽取**的；目录未评定难度。

**题目：**设
\[
A\in\mathbb C^{N\times N},\quad \|A\|\le1,\quad
H=\lambda A^\dagger A,\quad
P_\Delta=\mathbf1_{[0,\Delta]}(H),
\]
其中 \(\lambda>0\)、\(0<\Delta\le\lambda\)。给定 \(A\) 的精确块编码，可以调用其受控版本和逆操作；只计算这些查询次数，不计输入态制备成本。

对已知的 \(t>0\)、\(0<\epsilon<1/2\)，要求酉模拟器 \(W\) 对低能子空间内的所有输入态满足
\[
\sup_{\substack{\|\psi\|=1\\P_\Delta|\psi\rangle=|\psi\rangle}}
\left\|
W(|0^a\rangle|\psi\rangle)
-|0^a\rangle e^{-itH}|\psi\rangle
\right\|\le\epsilon,
\]
其中 \(a\) 为工作比特数。考虑 \(\epsilon\to0\) 且
\[
\epsilon=o(t\Delta),\qquad
t\Delta=o(\log(1/\epsilon)),\qquad
\log(1/\epsilon)=o(t\lambda)
\]
的渐近参数族。

**问题是：已知查询复杂度上界**
\[
O\!\left(\sqrt{t\lambda\log(1/\epsilon)}\right)
\]
**对精度 \(\epsilon\) 的依赖是否最优？**

据 MCP 收录的研究摘要：

- **已有进展：**Zlokapa 与 Somma（2024）给出了上述上界，并在明确的非平凡中间参数区间实例族上证明了 \(\Omega(\sqrt{t\lambda})\) 下界。
- **尚缺什么：**下界没有匹配上界中的精度因子；该下界也不能直接宣称在上述整个参数区间内一致成立。

参考文献：Zlokapa & Somma, *Hamiltonian simulation for low-energy states with optimal time dependence*, **Quantum 8**, 1449 (2024)，[arXiv:2404.03644](https://arxiv.org/abs/2404.03644)。以上题面与进展均来自 [Zoo 记录](qop://records/01M22P0HY0R1RBEABK7MZW488E)。