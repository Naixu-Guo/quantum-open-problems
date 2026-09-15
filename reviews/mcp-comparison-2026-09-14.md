# Remote_Work 与 Quantum Open Problems 的 MCP 对照

日期：2026-09-14。本文比较代码和定向测试，不代表对两套线上部署的验收。

| 仓库 | 比较版本 | 范围 |
| --- | --- | --- |
| Quantum Open Problems（QOP） | 本地 HEAD `f14914b7b56cdc74b050e00967a8866fdde99f37`；MCP 1.2.0 | `mcp/`、相关 service / contract / catalog tests |
| [AndrewWayne/Remote_Work](https://github.com/AndrewWayne/Remote_Work)（RW） | `3e069221be0ad0929029660e5f16161dfa85b7da`；MCP serverInfo 0.2.0 | `server/mcp/`、相关 services / resources / pagination / tests |

RW 克隆到临时目录 `/private/tmp/remote-work-mcp-comparison-20260914`。QOP 原有 `service/src/acceptance.ts` 和 `service/src/payloads.ts` 工作树修改保留；本次仅新增、更新审计文档，没有修改实现、科学记录、服务配置或部署。

## 判断

**RW 最值得借鉴的是工具结果、可继续读取的证据资源和更新通知之间的配合。QOP 应优先用这些方式改善研究信息的完整性与可追溯性。**

RW 的工具发现有 52 个工具；QOP 公共 HTTP 有 17 个，认证 stdio 的工具表有 25 个。RW 覆盖人员、项目、轨迹、身份、记忆和查询等更多业务。这个数量差异不说明 QOP 缺少工具，也不构成增加工具数量的目标。

QOP 公共 HTTP 已使用官方 SDK，执行输入校验，提供只读 annotations，并用官方客户端验证 legacy / 2026 协议。RW 是手写 MCP，其优点主要位于资源与业务交互，不能作为整套协议实现的替换模板。

## 逐项对照

| 维度 | RW 的实际实现 | QOP 当前情况 | 适合这里的改进 |
| --- | --- | --- | --- |
| 工具结果 | 共用 formatter 输出 text、structuredContent、resource_link | HTTP / stdio 分别构造 text JSON | 统一结果构造，附可用资源 URI，为高频工具定义具体输出 schema |
| 按需读取 | 分页轨迹、单消息 evidence 资源；命中项直接给证据入口 | 已有 problem/frontier/record 资源，但工具结果不附链接；get_problem 返回较多内容 | 先连通已有资源，再增加按 statement/clause/证据定点读取 |
| 证据约束 | 内部 Query Agent 区分事实、推断、未知；引用 ID 必须来自实际读取的消息 | 有更适合科研的 statement digest、claim/support、revision，但 context 丢掉部分信息 | 保留结论条件、状态来源与版本；bundle digest 对应实际内容 |
| 分页一致性 | 实体列表固定 ID 集合与顺序，cursor 绑定 scope；消息分页固定初始 rowid 上界 | 活表 LIMIT/OFFSET，热更新可能移动分页边界 | 给新 cursor 绑定筛选、排序和目录版本，保留 offset 兼容 |
| 更新通知 | service 记录受影响 URI，SSE 通知订阅者；可发现其他进程提交的更新 | 能热更新，提供 list_events；公共 MCP 没有订阅 | 先返回清晰版本，后续把 ledger 变更映射为资源失效通知 |
| 错误与诊断 | 明确 unavailable code；失败查询保留 Agent run | isError 已有，但状态码、retry headers 等信息在 adapter 丢失 | 统一错误字段、请求关联和重试信息，写入接通已有幂等键 |
| 业务一致性 | REST/MCP/Worker 共用 service；测试验证一次操作只发布一次更新 | MCP 转发 service HTTP，权威业务边界已清晰 | 借鉴跨入口契约测试；继续保持业务规则在 service |
| 协议与防护 | 手写 dispatcher 与参数 helpers | 公共 HTTP 官方 SDK、输入校验、只读 annotations、host/origin/body/rate 限制 | 保留 HTTP 优势，重点让 stdio 与其共用注册和校验 |

## 最值得迁移的设计

### 1. 工具结果直接带可用的证据入口

RW 的 [toolSuccess](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/server/mcp/format.ts#L83) 统一返回 JSON text、structuredContent 和 resource_link。它的 [trajectory/search tools](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/server/mcp/tools.ts#L393) 为命中消息附上单条消息 URI；[resource reader](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/server/mcp/resources.ts#L207) 可以继续读取分页轨迹或单条证据。

QOP 已有足够好的标识体系。第一步可以不增加新工具：

- search_problems 命中附 `qop://problems/{canonicalId}`。
- get_problem 附 statement、source、claim 对应的现有 `qop://records/{recordId}` 资源入口。
- list_references 将 bibliographic source、reference notes 和可读取的 record URI 对齐。
- build_context 对省略内容返回明确的读取入口，说明哪些是完整展示、部分展示或未展示。

对于需要精确到版本的引用，当前 `qop://records/{id}` 对可修订记录只返回最新 revision，不能冒充不可变证据。应增加可读取的 revision 选择或专门版本资源，同时返回 digest；旧 URI 继续表示“当前版本”。后续按条款读取也必须保留所需定义和适用条件。

`structuredContent` 的价值是方便可靠地消费字段。为了兼容仍需保留 text；不能据此声称返回自动减少 token，也不应为每个结果同时复制数份完整原文。见 [MCP structured content 规范](https://modelcontextprotocol.io/specification/2026-07-28/server/tools#structured-content)。

### 2. 将科研 context 做成可追溯的输入

RW 真正较严格的证据契约位于内部 [querySchema](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/server/semantic/schemas.ts#L178)，而不是 MCP outputSchema。其 [引用校验](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/server/services/answers.ts#L720) 要求结构化事实与推断的引用来自实际读取的消息；引用错误时仅允许一次限定候选集合的修复。ID 校验能防止引用不存在或未读取的消息，不能单独证明所引证据在语义上支持结论。

这里可以借鉴“每个结论都能回到证据”的原则，而继续让外部研究 agent 负责推理。先修复 [本仓库审计](mcp-audit-2026-09-14.md) 已复现的问题：

- 预算 1000 时，104 个问题中 26 个 statement section 为空，35 个被截断；默认 8000 的陈述均完整。
- 9 个权威 `Solved` 问题的 context 缺少权威 status，却显示服务内部条款的 `[open]`，容易混淆目录结论与验收证据。
- 版本演进的内存 fixture 中，frontier 保留的旧版本 accepted claim 被 context 的精确 ID 二次过滤丢掉。
- 不同实际内容可以产生相同 bundleId；included 还可能包含完全没有展示的 statement。

建议 ContextBundle 明确承载以下信息（是拟议接口，不是当前返回值）：

| 信息 | 用途 |
| --- | --- |
| problemId、canonical URI、status、statusSource | 知道研究对象及其权威二元状态 |
| statementId、version、digest、所选条款及必需定义 | 固定问题含义，避免混用版本或遗漏前提 |
| claims 的 bound/relation/conditions/support | 保留已知成果的范围和证据 |
| sections 的完整性及可继续读取的 URI | 明确当前输入的覆盖范围 |
| source records 的 revision/digest | 支持追溯和再现 |
| 基于规范化实际输出计算的 bundleId | 精确指认这个输入包 |

问题状态继续只有 `Unsolved` / `Solved`，不新增第三类状态，不把模型推断写成验收结论。小预算装不下核心陈述时，返回可操作的不完整信息或所需预算；公式和条件不能靠直接截取字符串来保证完整性。

### 3. 稳定分页与资源更新分别解决不同问题

RW 的 [snapshotPage](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/server/repositories/pagination.ts#L44) 检查 cursor 对应的组织、对象类型和 scope；初次查询固定 ID 集合与顺序。它保证分页成员稳定，**不固定每个成员的历史内容**。消息分页另用 rowid 上界和排序边界。

QOP 已有热更新，因而多页读取确实应定义“目录中途变化怎么办”。当前规模较小，可以先返回目录版本，并让新 cursor 绑定筛选、排序及版本；版本失配时明确要求重查。若需要跨更新继续完整枚举，再实现固定结果集快照。无需直接照搬 RW 为所有公开查询持久化快照的存储方式。

RW 的 [resource mutation publication](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/lib/resource-updates.ts#L122) 在业务服务写入后记录受影响 URI；[SSE](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/server/mcp/transport.ts#L171) 结合本进程事件与跨进程轮询通知订阅者。对 QOP，适合后续映射 problem、frontier、tree、context 的更新，并保留 list_events 增量读取方式。

启用订阅前应补齐会话清理、连接上限、重连游标与丢失事件后的重读策略；RW 的进程内 session Map 和现有 SSE 代码不能直接提供这些保证。目录本身更新不频繁，订阅优先级低于内容正确性、检索和结果契约。

### 4. 用同一批数据验证不同入口

RW 的 [service-contracts test](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/tests/service-contracts.test.ts#L54) 对照 REST/MCP 的业务结果和资源更新次数；[architecture test](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/tests/architecture.test.ts#L79) 限制 MCP/REST 绕过 service 直接访问存储。这种可执行的边界约束值得借鉴。

QOP 不必因此引入 RW 的完整多层目录结构。目前 adapter 本身很小，关键是共用工具注册、参数验证和结果格式，而不是拆出更多文件。

有实际价值的验收场景包括：同一输入经 stdio/HTTP 得到等价业务数据与错误；result link 可以读取且标识/版本对应；所选条款与旧版本成果保持正确；分页中途插入或更新不会静默漏项；写成功后响应丢失时，同一幂等键重试只产生一次记录。

## 需要保留的 QOP 优势与 RW 的局限

- QOP 公共 HTTP 的 SDK、host/origin、请求大小、速率限制和只读隔离已在实现与测试中体现。RW 的 MCP route 未显式实现同等边界检查；这不是对其部署外围防护的判断。
- RW 的 [outputSchema](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/server/mcp/definitions.ts#L465) 对全部工具只是任意 object。inputSchema 虽声明 additionalProperties:false，dispatcher 也没有统一执行 schema 验证。QOP 应从自身 contract 派生具体输入/输出约束。
- RW 没有精确的 MCP 响应 tokenBudget，按条数分页仍可能返回长消息全文；内部模型上下文管理不是 MCP 返回预算。QOP 的预算机制应修好并明确计量定义。
- RW 轨迹搜索仍是 LIKE，主要优势是 scope、分页和证据链接。QOP 的第一步是把当前 statement 纳入索引，再用固定查询集评估排序、缩写与相关性。
- RW 没有解决 tools/call 的完整 cancellation 传播，也没有为 QOP 提供现成的写请求幂等方案。QOP 服务已有 Idempotency-Key，应先接通 adapter。
- RW 的 Query Agent 是其产品的一部分；QOP 当前职责是科研数据库与接口。新增服务器端研究问答会引入模型成本、延迟和另一层结论生成，不属于这次 MCP 优化的必要前提。

## 建议的实施顺序

| 批次 | 具体范围 | 完成标准 |
| --- | --- | --- |
| 第一批：研究输入可靠性 | context 的权威状态、陈述优先、lineage/条件/证据、内容 hash；statement 搜索索引 | 上述已复现问题有回归验证；问题状态、ID、TeX 和权威数据边界保持一致 |
| 第二批：MCP 使用体验与一致性 | 共用 SDK 注册/校验/formatter；具体 schema；结构化结果与可读资源链接；认证写入幂等与错误信息 | 两种传输同参同业务结果；关键 links 能读；超时重试不重复写；兼容现有工具名、默认 payload 和 offset |
| 第三批：长期协作 | 版本绑定分页、按内容定点读取、版本资源；必要时订阅及运行指标 | 跨更新可追溯，断连恢复策略明确；用实际研究任务评估调用次数、响应字节、失败率 |

研究任务评估可以固定为：按正式陈述中的术语找到问题、完整读取某条款、区分已解决状态与服务验收记录、追到一个已知界的原始证据、在目录更新时遍历全部结果。用这些任务的正确率与交互成本衡量改善，不预先假定“更多工具”或“结构化输出”等于更低 token 消耗。

## 本次验证

- QOP：此前本次审计已执行 MCP 11 个集成测试、MCP typecheck、`node site/build.mjs`，均通过；额外 context/search 探针在真实本地 ledger 与内存 fixture 上复现问题。
- RW：安装锁定依赖时关闭 lifecycle scripts，在临时 Node.js `24.0.0` 下运行 `tests/mcp-protocol.test.ts`、`tests/service-contracts.test.ts`、`tests/architecture.test.ts`，合计 **7/7 通过**。其中包含跨进程资源通知与 REST/MCP 业务一致性。
- RW 本次定向测试使用测试身份、临时数据库和 mock 模型；没有运行其全部测试、生产构建、真实模型、E2B 或 VPS 验收，也没有修改其源码。
- 两套测试覆盖范围不同，测试数量不用于评价优劣。源码判断、已复现缺陷和拟议设计在本文分别说明。
