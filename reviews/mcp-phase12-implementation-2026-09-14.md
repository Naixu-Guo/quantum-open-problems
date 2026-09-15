# MCP 第一、二批改进与验证

2026-09-14；MCP 版本 1.3.0。对应 [仓库对照报告](mcp-comparison-2026-09-14.md) 中的前两批范围。本地实现与验证；未提交或部署。

## 实现

- 搜索索引包含当前 Statement 正文、条款、判定标准和 taxonomy label；不索引已替换的 Statement。
- Context v2 明确返回权威二元状态、状态来源、statement ID/version/digest。正式正文、所选条款文本、kind、quantity 和判定标准整体保留；空间不足整体省略，给出最低需求和读取入口。已接受 claim 按 lineage 匹配，并保留 bound、conditions、support 和正文。
- bundleId 覆盖规范化实际输出；sourcesUsed 带 record revision/digest，shownRecordIds 区分实际展示与只参与派生的记录。资源 URI 读取当前 revision，未声称它们固定历史版本。
- stdio 与 HTTP 共用官方 SDK 注册、输入校验、八个具体输出 schema 和结果构造。工具返回兼容 text、structuredContent、可继续读取的 resource_link；额外导航链接最多 20 条，省略数量单独报告。
- 认证写工具支持 idempotencyKey，转为 HTTP header，不进入科学 payload。错误保留状态、重试信息、请求 ID 和不确定结果标志；每次调用单独传播取消信号。artifact 必须提供唯一的非空 text/base64，base64 严格检查。
- 旧版 HTTP 使用隔离的 SDK 会话，使取消通知到达原请求；默认最多 256 个会话、每会话 128 个活动请求，闲置 15 分钟过期；取消、DELETE、过期、断线、正常关闭和初始化失败均清理响应及请求状态。新版 HTTP 继续无状态。
- 新增 API 能力检查和 `npm --prefix mcp run check:service`。部署需先升级 API；旧 context 返回明确的 INCOMPATIBLE_SERVICE，旧 API 不允许使用新增的幂等写保证。

## 首轮 adversarial review 与修复

使用独立 Codex CLI 会话，模型 gpt-6-astra，reasoning effort ultra，只读审查。[保留原始报告](mcp-phase12-adversarial-2026-09-14.md)。最初系统 CLI 0.148.0 被模型服务拒绝，随后使用本机 VS Code 扩展附带的 0.154.0-alpha.6.2 完成审查，没有升级系统安装。

| 首轮发现 | 对应处理和回归覆盖 |
| --- | --- |
| P1 并发或保存回执失败导致同键重复写入 | 业务执行前 SQLite 原子占位；同 hash 的活跃请求等待同一结果，不同 hash 拒绝。保存结果失败或重启遗留的 pending receipt 阻止再执行，返回明确的 409 不确定结果。真实 TCP、真实 HTTP parser 的确定性并发、故障注入与完整服务重启均覆盖。 |
| P2 缺少 quantity/kind 仍标记正式 context 完整 | 正式 section 包含完整结构化数学字段并计入最低预算；正文不重复这些字段的 fixture 有专门回归。 |
| P2 legacy HTTP 取消未到达原请求 | 按 opaque session ID 复用独立官方 SDK 实例；官方客户端实网测试确认取消上游，同时另一个客户端相同数字请求 ID 不受影响。 |
| P2 单独升级 MCP 与旧 API 的 context 不兼容 | API 版本标记、部署前检查、先 API 后 MCP 的迁移顺序、明确兼容性错误。带 key 的写入也先确认 API 幂等版本。 |

同一 ultra 会话的[第二轮复查](mcp-phase12-adversarial-followup-2026-09-14.md)确认原四项触发已修复，另发现 legacy 取消后的 HTTP 响应与 SDK 请求映射没有结束。已改用公共 transport 接口终结请求，并覆盖连续取消、混合批次、DELETE、过期、断线和正常 server.close()。

[第三轮复查](mcp-phase12-adversarial-final-2026-09-14.md)确认响应和映射悬挂已修复，进一步发现 SDK 2.0 忽略合法请求编号 `0` 和空字符串的取消通知。HTTP 已通过公开 transport 接口将每次调用映射为独立内部编号，并保留客户端原编号；新回归同时检查上游中止、原响应结束、请求映射释放和其他调用不受影响。另行在 stdio 的两种协议中复现了同一 SDK 缺陷，已加入公开 Transport 包装器及回归；没有修改 SDK 私有字段或依赖包。同会话重用客户端请求编号违反协议，只作为防御性压力测试，不据此另列 P1。

[第四轮复查](mcp-phase12-adversarial-closure-2026-09-14.md)确认空值编号问题已修复，发现 stdio 包装器会误丢父请求取消后产生的反向子请求取消通知。当前 QOP 工具不发起此类反向请求，但包装器需要保留该 SDK 行为；已修复该分支，合法的反向取消在移除失效关联 ID 后仍会发送，其他迟到消息继续丢弃。真实 SDK 级联取消回归通过，stdio 定向测试共 12 项；现代协议保留 SDK 原有的反向 ping 拒绝行为，未新增协议能力。

[第五轮最终复验](mcp-phase12-adversarial-signoff-2026-09-14.md)确认该 P2 已解决。独立真实 SDK 对照中，包装器与原始 transport 的子请求取消通知完全相同，没有内部 ID 泄漏，无关子请求正常完成；相关回归 3/3 通过。累计审查在已实现的第一、二批范围内没有尚未关闭的可操作发现。审查侧 HTTP 探针使用内存真实 HTTP parser，实际 localhost 集成由主工作区测试验证；没有进行线上部署、代理或生产负载验证。

## 验证

| 检查 | 结果 |
| --- | --- |
| 根目录 `npm test` | 76/76 |
| Service `npm test` | 87/87 |
| MCP `npm test` | 53/53 |
| Web `npm test` | 11/11 |
| Service / MCP TypeScript 检查 | 通过 |
| `node site/build.mjs` | 104 个问题；95 Unsolved、9 Solved |
| `git diff --check` | 通过 |

真实维护目录额外检查：104 个问题、360 条 source，948 次 SDK 工具调用、全部八个输出 schema、1327 个唯一资源 URI 均通过。包括每题 200/1000/2000/8000 预算和两种 get_problem projection。使用生产 adapter/formatter/shared SDK，通过进程内 fetch 映射至实际 read models；它验证真实数据形状与资源解析，不代表线上网络性能。双传输和取消行为由独立集成测试覆盖。

## 边界与迁移

- tokenBudget 是 section 文本按四字符一 token 的估算，不包括 JSON、来源元数据或 MCP framing；不能当作完整工具响应的硬 token 上限。
- durable pending receipt 防止不确定写入重复执行，但不自动重建崩溃时未保存的业务结果。收到 IDEMPOTENCY_OUTCOME_UNKNOWN 后需核对服务状态、由 operator 对账；不能换新 key 重做同一写入。
- 已完成 JSON 请求回执继续可重放。旧版 artifact 回执因为新增 metadata hash 可能返回冲突；先核对原 artifact，不能自动再次上传。
- 分页 cursor、不可变历史资源和资源订阅仍属第三批范围。
- 保留原有 service/src/acceptance.ts、service/src/payloads.ts 修改，并与实施前 patch 按字节比对一致。没有改科学记录、永久 ID、二元状态、TeX 或 ledger 内容。
