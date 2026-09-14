> Archived, unedited model answer from the diagnostic run. See the independent paper grading report for two wording corrections and the limits of the recorded web trace. This is preparation, not a solution or an exhaustive current-literature review.

截至 **2026-09-14**，题库仍将本题列为未解决。外部检索找到一篇直接相关的 **2026 年 7 月新预印本**：它推进了两副本情形的资源量化和维数范围，但未解决任意副本数的猜想。

**题库信息来自 QIQCOP Zoo 只读 MCP。** 定位到 [Universal purification with classically simulable operations](https://qiqc-op.com/problem/op_a64dc63d6ae49127/)，别名 `op_a64dc63d6ae49127`，记录 ID `01M1Q787QRD6APNHX659G4CTEF`，revision 1。状态 `Unsolved` 来自维护者目录；该记录的评论、裁决均为空。2026-09-04 是目录编辑日期。

题库问题的精确范围是：对未知纯态 \(\psi\)，给定 \(n\ge2\) 份
\[
\rho_\psi=(1-\delta)\psi+\delta I_d/d,\qquad 0<\delta<1,
\]
允许操作将其转换为一个 \(d\) 维输出，询问是否始终有
\[
F^{\mathcal A_d}_\delta(n,s)
=\sup_{\mathcal E\in\mathcal A_d}
\frac{\int d\psi\,\operatorname{Tr}[\psi\,\mathcal E(\rho_\psi^{\otimes n})]}{s}
=1-\frac{d-1}{d}\delta,
\quad
\int d\psi\,\operatorname{Tr}\mathcal E(\rho_\psi^{\otimes n})=s.
\]
这里使用 Haar 测度，\(0<s\le1\) 是**平均成功概率**；限制施加于操作，不要求未知输入是稳定子态。题库只纳入 \(d=2\) 或奇数维。定位：statement `main`、`progress:0–2`、`comment:0`，均属于上述 revision。

**原论文外部核查。** 原文是 He、Zhu、Yao、Liu、Li、Wang 的 *No-Go Theorems for Universal Quantum State Purification via Classically Simulable Operations*。已阅读公开 [arXiv v2 全文及附录 A–D](https://arxiv.org/html/2504.10516v2)；另有 [公开 PDF](https://arxiv.org/pdf/2504.10516v2)。v2 更新于 2025-09-24；正式发表于 PRL **136, 090204**，发布日期为 2026-03-04。[版本记录](https://arxiv.org/abs/2504.10516)、[出版社记录](https://doi.org/10.1103/bdw8-k91v)

| 核查项目 | 全文结论与定位 |
|---|---|
| 允许操作 | qubit 使用完全稳定子保持操作 **CSPO**；奇数维使用完全正 Wigner 保持操作 **CPWP**。均允许完全正、迹不增加的成功分支。定义见附录 A 的 **Definition S2、S3**，操作集合见正文式 **(1)**、附录式 **(S16)**。 |
| “完全”的含义 | 与任意适用辅助系统的恒等映射张量后，仍保持对应自由态集合。普通稳定子操作包含其中，不能把研究范围直接扩大为所有可能的经典可模拟操作。 |
| 已证明部分 | **Theorem 1**：奇数维、CPWP、两份输入；**Theorem 2**：qubit、CSPO、两份输入。对任意成功概率均无法提高上述平均保真度。证明分别在附录 **C、D**，等式 **(S31)、(S54)**。 |
| 数值部分 | **Table 1** 的新增证据是 \((d,n)=(2,3),(2,4),(3,3),(3,4)\)，属于 SDP 数值结果。 |
| 仍开放部分 | 表 1 后紧接的段落提出任意维数、任意副本数猜想。有限数值情形没有完成该证明；特定离散态集合仍可改善，见 **Figure 2**。 |

以上定位均采用 [arXiv v2 全文](https://arxiv.org/html/2504.10516v2) 的编号。

题库引用的背景论文 **Cirac–Ekert–Macchiavello（1999）** 也有 [公开全文](https://arxiv.org/pdf/quant-ph/9812075)。第 2–3 页给出按总角动量分解的纯化程序，式 **(13)** 给出分支保真度，式 **(16)** 附近证明最优性；第 3 页的两副本例子说明对称子空间投影可提高保真度。因此，本题关心的是操作限制所造成的障碍。

**较新进展来自外部文献，未列入该题库记录的两条参考文献。**

1. **最直接：He、Xiong、Wang，*A Nonstabilizerness Resource Law for Universal Quantum State Purification***，2026-07-09 首发。已查阅正文及相关附录：**Theorem 1、附录 C 式 (S48)–(S49)** 给出两副本情形中指数化 mana 与保真度增益的精确线性关系；**Theorem 2、附录 D 式 (S79)–(S81)** 给出多 qubit 的 robustness 上下界，单 qubit 时重合。**Corollary 3** 将两副本 CSPO 禁阻扩展到 \(d=2^m\)。结果针对可行的成功概率与目标保真度组合；正文仍将更多副本的推广列为后续方向。它推进了本题周边结论，尚未关闭任意 \(n\) 问题。[全文](https://arxiv.org/html/2607.08626v1)、[PDF](https://arxiv.org/pdf/2607.08626v1)

2. **Liu 等，*No Universal Purification in Quantum Mechanics***，2025-09-25 首发，v2 更新于 **2026-06-14**。已读相关正文：§II **Observation 1** 讨论有限副本产生依赖输入的精确纯输出的障碍；§III **Theorem 1** 给出近似纯化的样本复杂度约束。**我的范围判断：这些结果没有建立本题所问的“任何微小保真度增益都不可能”**，不能据其标题认定本题已解。[全文](https://arxiv.org/html/2509.21111v2)、[PDF](https://arxiv.org/pdf/2509.21111v2)

3. **Guo、Zhao、Wang，*Universal quantum state purification under energy-preserving constraints***，v2 更新于 **2026-08-19**。已查阅 §II–IV：**Theorem 2** 给出能量保持约束下无纯化优势的充要条件，**Theorem 4** 给出最优保真度。它研究另一种操作限制，不能替代 CSPO／CPWP 猜想的证明。[全文](https://arxiv.org/html/2604.15228v2)、[PDF](https://arxiv.org/pdf/2604.15228v2)

**读取限制与结论边界。** PRL 正式版 PDF 请求返回 **401 Unauthorized**，出版社补充材料入口标为需订阅；因此没有读到正式版正文和独立补充文件，无法确认它们与 arXiv v2 的逐条差异。后续预印本核查集中于上述正文、定理和相关附录，未逐行审计全部证明，也未读取或运行数值代码。本次按标题、arXiv 编号及操作名称追查，**未发现截至指定日期解决任意副本数猜想的公开证明或反例**；这是一项有范围的检索结果，不是文献不存在的证明。