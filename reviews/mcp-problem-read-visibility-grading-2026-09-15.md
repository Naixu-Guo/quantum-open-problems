# 四分类 read_problem 实际客户端诊断：独立核验

2026-09-15，本次新分类接口评测通过。`gpt-6-astra`、`ultra` 在 QOP 命名空间被强制直接呈现、工具输出上限无显式覆盖的配置下，按顺序读取一个问题的 `references` 分类，共 4 页，准确回读 12/12 个随机诊断标记。记录的宿主总观察时间为 52.881275 秒。旧分块接口的评测未纳入本结论。

核验未只依赖 runner 的评分字段，而是重新检查原始事件及响应：

- 4 个唯一 started 均有对应 completed；各调用在前一调用完成后开始，结束时无活跃调用。只有 `qop/read_problem`，没有额外工具、未知事件、Code Mode、shell、web、文件操作或主机诊断。SDK 预检的 4 次与模型阶段的 4 次分别核对，没有混计。
- 模型参数恰为同一 ID、`section:references`、`maxBytes:8192`，续页只增加前页游标；页序为 0–3，最后一页才结束。答案无重复、遗漏或额外页，全部 12 个随机值精确匹配。随机值不在 prompt 或环境记录中。
- 每次 CLI 完成事件的 JSON text、structured content 均与对应冻结页相等。当前输入接口只提供 statement、history、references、comment 四类；本次实际只读取 references，不含 blockId、blocks、路径或字节偏移字段。
- 去除诊断属性、恢复 `responseBytes` 后，按照服务源码 base/compose 对象声明的原始键顺序重排，再逐页核对预存 original SHA256，4 页全部吻合；装饰页 SHA256 及重算字节数也全部吻合。该步骤明确处理了装饰器移动 content/text/responseBytes 导致的键顺序变化，并非假定简单去标记即可保持原序。
- 四页 `text` 按顺序拼接成 23056 字节的合法分类 JSON，完整保留 13 条维护者书目、13 条服务引用及 researchContext。它与一次新建本地内存服务的真实 `get_problem(view=research)` 响应所做的独立 references 投影深度相等；未调用生产分类构造函数来计算预期结果。13 条维护者书目正文也与目录原文逐字一致，完整 research detail 的 canonical SHA256 与页面 documentVersion 相同。

| 页索引 | 原始 API JSON 字节 | 诊断 JSON 字节 | 诊断额外字节 |
|---|---:|---:|---:|
| 0 | 8192 | 8652 | 460 |
| 1 | 8192 | 8652 | 460 |
| 2 | 8192 | 8652 | 460 |
| 3 | 3355 | 3815 | 460 |

原始页均满足 8192 字节预算；每页诊断装饰另增 460 字节，并在响应中明示预算仅适用于未装饰 API JSON。装饰后最大页为 8652 字节。该数值不含 MCP envelope、HTTP 头，也不是 token 数，不能称为“实际所有工具输出都不超过 8192 字节”。

标记位于根级响应 envelope：Start 在前，Middle 在 content/text 前，End 在 content/text 后；不是正文内部随机点或字节中点。12/12 只证明这些标记成功回读。SDK/CLI 响应与完整分类一致，不能进一步证明模型看到了每个字符或理解了科学内容。

这是一个问题的 references 分类、一次运行、一个客户端配置。QOP 被显式设为 direct-only，不代表 Astra 默认 Code Mode 路径或所有客户端。评测服务重放由真实 API 预先生成的冻结页，因此 52.881275 秒是包括客户端与模型处理的宿主观察时长，不是实时 API 性能。首个工具开始于 7.402056 秒，末个完成于 38.345772 秒。

未编辑生产、eval 或模型证据文件；最终 10 个原始证据文件的 SHA256 清单已核对保留。报告不包含随机标记值、游标、主机路径、端口或科学正文。
