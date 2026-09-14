**MCP 第二轮对比调研 · 2026-09-14**

结论：本地前两阶段已经补齐了一批协议、上下文完整性和写入可靠性问题。下一阶段应优先改善检索质量、研究进展的读取方式和进展日期的可追溯性；稳定分页、版本固定和更新通知随后推进。没有统一的跨产品实测足以把某个项目称为 MCP 的绝对 SOTA，本报告比较具体机制及其对本项目的适用性。

**1. 对比基线与证据范围**

| 对象 | 本轮基线 | 限制 |
| --- | --- | --- |
| QIQCOP Zoo 主分支 | `e4d58d143c6d3999ae27cc35a9602f53da3be01d`；MCP 包版本 `1.2.0`；111 道题 | 刚合并的页脚修改没有携带本地 MCP 改进；包版本不是线上服务运行版本的探测结果 |
| QIQCOP Zoo 待合并实现 | 当前工作区，基于 `f14914b7b56cdc74b050e00967a8866fdde99f37`；MCP 包版本 `1.3.0` | 本轮功能评价以这些本地修改为准，不把它们说成已部署 |
| Remote_Work | `3e069221be0ad0929029660e5f16161dfa85b7da` | 本轮重新核对代码，没有重跑其测试或做跨系统负载测试 |
| 科研平台与 MCP 生态 | 调研当天的官方文档、官方仓库和网站 | OpenAlex、Semantic Scholar、zbMATH 比较的是 API/数据模型，并非宣称其有官方 MCP 服务 |

定向探针用本地 `Index`、`problemView`、`contextBundle` 读取最新主分支的 ledger/activity 和 111 条 JSON；索引在内存中重建。它不是线上 MCP 调用，也不是完整客户端和模型的端到端评测。原始结果见 [探针数据](mcp-landscape-probes-2026-09-14.json)。

本地已有的改进不能再次列为待办：共享官方 SDK 注册、输入/输出契约、取消与错误处理、持久化写入幂等保护、完整正式命题、真实内容摘要与来源、预算不足时明确省略，以及明确提示读取 `body` 中的既往研究。前两阶段范围和此前验证记录见 [实施记录](mcp-phase12-implementation-2026-09-14.md) 与 [对抗审查结案](mcp-phase12-adversarial-signoff-2026-09-14.md)。这不表示所有工具都有同等严格的输出结构，也不表示整个系统经过形式化验证。

后续整合须从最新主分支承接既有目录、许可和网站变更，避免把旧工作区的整文件版本覆盖回去。本轮只增加研究报告及数据，不修改实现或数据库。

**2. Remote_Work：值得直接借鉴的三个机制**

| 机制 | 已核实的实现 | 对我们的实际价值 |
| --- | --- | --- |
| 查询快照与游标 | 首次分页在事务中固定结果 ID 和顺序；后续校验组织、实体类型、查询范围与快照；创建新快照时清理超过 24 小时的旧快照 | 避免翻页期间新题或改题导致重复、漏项；也支持从完整候选集合抽题 |
| 写入后的关联资源更新 | 根据被修改对象计算受影响的资源 URI；持久化带序号的更新，并有本进程事件总线 | 新进展不仅影响原记录，也影响 problem、frontier、context 等派生结果，失效通知需要覆盖这些关联 |
| 每条回答附已读取的证据 ID | 回答区分 facts/inferences/unknowns；校验事实和推断的引用非空且属于实际读取的消息 | 我们可以要求研究结论指向具体 Progress、参考文献或 Claim，减少无法追溯的归纳 |

代码证据：[快照分页](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/server/repositories/pagination.ts#L12)、[资源更新关联](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/lib/resource-updates.ts#L32)、[逐条引用校验](https://github.com/AndrewWayne/Remote_Work/blob/3e069221be0ad0929029660e5f16161dfa85b7da/server/services/answers.ts#L722)。

两个边界需要保留：它的分页快照固定的是成员和顺序，不自动固定每个成员的内容版本；引用 ID 校验保证来源存在且已读，不证明引用支持该科学断言。它的旧式流传输也不能直接代替当前协议的订阅实现。本项目没有必要为了模仿它，把整个服务端研究代理一起搬进 MCP。

**3. 相近网站与成熟接口：应借鉴哪些设计**

| 参照 | 已核实特点 | 建议应用于本项目 |
| --- | --- | --- |
| IQOQI Vienna Open Quantum Problems | 已解决问题列表明确展示 Date、Last Progress、Solved By | 把研究进展时间、归属和证据单独展示；不能直接把网页编辑日期当作解决日期。其 Last Progress 也须逐题核实语义。[官方列表](https://oqp.iqoqi.oeaw.ac.at/solved-quantum-problems) |
| OpenAlex | 全词搜索、词形处理、精确模式和相关性排序；分页提供游标；数据同步另行处理更新、合并和删除 | 明确搜索语义、命中字段和排序；区分文献发表与目录更新。引用数不应成为难度或正确性指标，游标本身也不证明快照一致性。[搜索](https://help.openalex.org/api/searching/)、[分页](https://help.openalex.org/api/paging/)、[同步](https://help.openalex.org/access/sync/) |
| zbMATH Open | 文献对象把 editorial_contributions 与 references 分开；评述对象有 reviewer、text、contribution_type | 把维护者整理的研究历史作为可读、可引用的内容保留，不与书目或服务内审核事件混成一类。[文献模型](https://github.com/zbMATHOpen/zbRestApiClient/blob/master/docs/Document.md)、[评述模型](https://github.com/zbMATHOpen/zbRestApiClient/blob/master/docs/EditorialContribution.md) |
| Semantic Scholar | 引用边可带上下文和意图；API 支持按需选择字段；全文可得性限制上下文覆盖 | 每条进展保留来源定位、适用条件和剩余缺口；缺少机器提取的引用上下文不能被解释为没有既往研究。机器生成的 influential 标志也不代表证明经过验证。[官方 API](https://api.semanticscholar.org/api-docs/snippets)、[官方 FAQ](https://www.semanticscholar.org/faq) |
| GitHub 官方 MCP | 可配置 toolsets、单个工具与只读模式；部分工具提供简略/详细输出选择 | 保留小而明确的读取流程，允许按任务选择内容量。是否进一步拆分当前 17 个公开工具，要由调用评测决定。[工具集配置](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp-in-your-ide/configure-toolsets)、[服务配置](https://github.com/github/github-mcp-server/blob/main/docs/server-configuration.md) |

Semantic Scholar 的动态 API 文档直接打开只返回较少内容，详细端点描述结合该官方页面的搜索索引与官方说明核对；本轮没有调用其数据 API 验证覆盖率。

另查看了 [openquantumproblems.com](https://openquantumproblems.com/) 对已知结果、剩余工作及不同更新时间的呈现，和 [Open Problem Garden](https://openproblemgarden.org/?q=structure) 的条目组织。前者只作为信息组织参照，未逐题核验科学内容；后者当前活动流存在明显无关内容，不能作为内容治理标杆。任何外部站点的额外状态或分类都不能直接引入我们严格的二元状态、field/topic 分类。

**4. 当前实现与数据中实际发现的问题**

| 探针或代码证据 | 观察 | 含义与限制 |
| --- | --- | --- |
| `stabilizer rank` / `stabiliser rank` | 命中数为 3 / 0 | 英美拼写差异会漏检 |
| `quantum algorithm` / `量子算法` | 命中数为 31 / 0 | 字面查询没有中文映射；客户端模型仍可翻译后检索或使用领域过滤，不能据此说所有中文提问都会失败 |
| `QMA(2)` / `QMA 2` | 前者唯一命中，后者 5 项，目标排第 4 | 查询切词和字母序排序未表达领域相关性 |
| `SVP` | 返回一条 thermal-attenuator quantum capacity 题 | 其 ULID `01M1HME7803ZFMDQWV9SVP8FH8` 恰含 `SVP`；opaque ID 与科学内容混入同一子串索引，造成可复现的误命中 |
| 111 条元数据 | difficulty 和 verificationCost 均为 `unrated` | 无法从现有评级支持“全库哪题最容易”；文献数或题目短也不是替代评分 |
| 402 条 authored Progress | 全部为字符串 | 内容已有，但逐条日期、日期精度、来源定位及所影响子句尚未形成统一结构 |
| 111 个索引行 | last_activity 和 last_human_review 均为空 | 这是服务活动/人工审核字段；不代表论文、正文或网站没有日期，更不能拿它们推断“刚被解决” |
| QMA(2) 详情 | body 6,058 字符；原始记录有 6 条 Progress；默认详情没有独立顶层 progress | 历史研究并未丢失，但模型要从大段 body 中提取；可复用 includeAuthoredRecord 读取结构化原稿 |

相关代码：[搜索文本构造及分页](../service/src/index.ts)、[问题详情与上下文](../service/src/read-models.ts)、[工具定义](../mcp/src/adapter.ts)。本轮 12 条查询属于定向诊断，尚没有人工标注的相关性集合，不能据此报告整体 precision/recall 或排名优越性。

`problemPage` 目前只有 title/stale 两种排序，默认按标题；网站的一般问题列表按精确编辑时间排序。后续应明确区分普通列表的 edit-time 排序与文本搜索的 relevance 排序，并保留显式字母序选项；服务审核时间不能替代网站的 TeX 编辑历史。

同一 QMA(2) 探针中，默认详情 JSON 为 16,192 字节；8,000 预算的 context 返回 `approximateTokens=4092`，完整 JSON 为 28,281 字节，background 未省略。这个 token 估计来自保留 section 的字符数，不包含完整元数据、JSON 外壳和协议封装。因此它不是实际客户端 token 用量。`text` 与 `structuredContent` 如何进入模型上下文也取决于客户端，不能直接断言重复收费或自动节省一半。

**5. 下一批建议：先改善现有读取流程**

第一优先：把已有研究历史直接交给模型，并修复搜索的确定性问题。

- 在现有 `get_problem` 上提供可选 section/view 投影，明确给出 Source、Progress、Comment、References，保留完整原文及来源标识。现有 API 的 `includeAuthoredRecord` 已能读取这些字段，MCP 可先在适配层完成投影，不要求先升级 SDK 或迁移数据库。
- 选中一道题后，默认回答包括准确命题、已有结果、剩余缺口和关键引用。服务返回作者已有的文本；模型的归纳须标明为归纳，不能凭空产生新的研究总结或接受事件。
- 有意提供 brief/full 或按节读取，并显式说明省略内容；正式命题的条件、量词和解决标准必须保持完整，不能为压缩截断。
- 检索把完整 ID/alias 解析与自然语言文本分开；规范已确认的缩写和拼写变体，加入中文领域别名；按标题、命题及研究进展等字段加权并返回命中字段/片段。保留所有永久标识和别名。排名及索引修复涉及 service，实现它们不等于更换外部 API 版本或 SDK。
- 对科学符号采用受控规范化，避免普通词干处理误改数学含义。先验证词法检索方案，语义向量检索仅在独立评测显示需要时增加。

第二优先：补足“最近有什么进展”的日期与证据模型。这部分确实需要内容建模，不能只改工具描述。

- 每条研究进展可带来源引用、论文内定位、适用范围/假设、受影响子句及尚未覆盖的部分。逐步补充日期值、精度和依据，区分预印本首次公开、正式发表、目录录入/编辑以及维护者审核。
- 年份已知但月日未知时保留年份精度，未知则为空。不能把 arXiv 最新修订日、仓库 commit 日期或导入时间自动写为 solvedAt。
- 初期用“记录 revision + section + index”定位原文；数组位置只在该 revision 内有效。跨版本的永久进展 ID 需要明确的后续作者维护规则，不能把数组下标伪装成稳定身份。
- 利用已有 `list_events` 和修订差异，给出新题、研究进展变化、参考文献变化、状态变化、合并/归档等解释。状态仍只有 Unsolved/Solved；部分情形已解决写在进展中。
- 目录没有服务内 acceptedClaims，并不意味着没有文献进展。维护者整理、论文宣称和服务审核结论必须分别保留其来源与语义。

第三优先：分页、固定版本及增量同步。

- 将游标绑定查询范围、排序和目录版本。实现可选择固定成员快照，或在版本变化时明确要求重新开始；不要悄悄以新目录解释旧 offset。
- 在当前资源 URI 之外提供明确固定 revision/digest 的读取方式。快照成员固定与正文版本固定是两个不同保证；归档、合并、撤回及既有 redaction 规则仍需生效。
- 把一次修改影响的派生资源列全，先让事件轮询和重读可靠，再按长期订阅需求增加通知与断线恢复。新题进入权威目录、完成 ledger 导出并被服务加载后，后续读取才能看见；订阅不是数据导入/部署的替代品，也不会自动改写已经生成的聊天回答。

**6. 当前 MCP 规范的适用点**

官方当前文档已覆盖 `2026-07-28`。本地实现已走现代 HTTP/stdio 入口，不能把“再升级一次 SDK”当作接下来全部优化的先决条件。官方 SDK 也明确区分依赖版本与启用相应协议入口。[迁移说明](https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28)

| 功能 | 本项目适用判断 |
| --- | --- |
| 缓存提示 | 当前 SDK 对可缓存结果有 TTL/scope 机制，默认不提供可复用的长 TTL。可先评估发现列表、稳定资源；动态状态/上下文应保守，固定版本资源才适合长缓存。缓存不能代替内容版本和授权范围 |
| 资源订阅 | 是可选能力。本地 maxSubscriptions 为 0，不是“下一次读取无法更新”的证据。需要持续关注某题时，再实现当前协议的 subscriptions/listen、受影响 URI、断线重读/事件补齐；不能只复制旧 resources/subscribe 接口 |
| Tasks 扩展 | 存在独立扩展文档；旧 2025 tasks/* 词汇、当前扩展和所固定 SDK 的可运行支持必须分别核验。现阶段没有服务端长时任务需求，不建议为此扩充任务引擎 |
| 工具发现/工具集 | 减少无关工具和返回字段有价值；当前公开读取工具数量有限，应先看真实调用数据，不能凭大规模工具生态的经验直接增加动态发现层 |

依据：[SDK 缓存和迁移](https://ts.sdk.modelcontextprotocol.io/v2/migration/support-2026-07-28#cache-fields-and-cache-hints)、[资源与订阅规范](https://modelcontextprotocol.io/specification/2026-07-28/server/resources)、[Tasks 扩展文档](https://modelcontextprotocol.io/seps/2663-tasks-extension)、[官方路线图](https://blog.modelcontextprotocol.io/posts/mcp-roadmap/)。路线图方向不等于所有 SDK 与客户端已经支持。

**7. 用你给的三个问题验收**

| 用户提问 | 应有行为 | 重点反例 |
| --- | --- | --- |
| “来给我抽个量子算法的题” | 解析 field/topic，限定未解决题；从完整匹配集合抽样；展示候选数/版本、命题、研究进展、剩余缺口和引用 | 把字母序第一页当随机样本；英文/中文查询落入不同领域；仅返回标题 |
| “现在这里面哪个你觉得最容易解决” | 说明当前没有难度评级；基于实际来源比较少量候选的切入点、前置知识、验证方式与障碍 | 凭题目短、引用少、有限实例可计算，就宣布完整问题最容易 |
| “最近有哪个题刚被解决” | 用 Solved 状态和有依据的解决进展日期检索，说明日期精度、解决范围与来源；证据不足时明确范围有限 | 把近日改错字、补引用、重新导入，或只解决特例，当成刚解决完整题目 |

抽样保证需要完整候选集合和一致版本。现有 API 可以遍历候选并检查版本，但要抵抗并发目录变化，仍需第三优先级中的一致性机制，不能只加一个 random 参数就宣称公平。

建议建立这些问题及改写问法的人工标注评测，留出未参与实现调优的查询：衡量检索相关性、完整条件/历史覆盖、引用支持、日期与范围错误，同时记录调用次数、返回字节、实际客户端 token 和延迟分位数。针对当前具体误匹配建立回归用例；不以工具数量或演示成功一次作为效果指标。这与 [Anthropic 的工具设计与任务评测经验](https://www.anthropic.com/engineering/writing-tools-for-agents) 相符，但本轮尚未产生这些端到端指标。

建议下批实施范围是“研究历史分节读取 + 搜索误匹配/变体与排序修复 + 三类问题评测”。研究时间线紧随其后。协议扩展按真实需求引入；本轮未实现或部署这些建议。

本轮交付检查：报告的本地链接与探针 JSON 校验通过，`git diff --check` 通过，当前工作区的 `node site/build.mjs` 通过。该旧基线工作区构建的是 104 道题；上文 111 道题的统计使用另一个最新主分支检出的目录，两者并非同一个目录快照。
