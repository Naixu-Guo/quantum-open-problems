1. **[P1] 携带 `idempotencyKey` 仍可能重复写入，不能据此宣称安全重试。**
   位置：[service/src/api.ts:474](/Users/naixu/Academic/quantum-open-problems/service/src/api.ts:474)、[api.ts:483](/Users/naixu/Academic/quantum-open-problems/service/src/api.ts:483)、[mcp/src/result.ts:92](/Users/naixu/Academic/quantum-open-problems/mcp/src/result.ts:92)。

   **已复现两种触发：**真实 Node HTTP parser 接收两个相同 actor、key、payload 的流水线请求，均通过 `replay`，返回两个 `201` 和不同 `trajectoryId`；内存 SQLite 故障注入使业务插入成功、`remember` 失败后，同键顺序重试也产生第二条轨迹。[auth.ts:145](/Users/naixu/Academic/quantum-open-problems/service/src/auth.ts:145) 的 `INSERT OR REPLACE` 最终只保留一个响应。

   **归因：底层弱点既存，本次新增重试保证依赖它。**当前丢响应测试只覆盖结果已缓存后的断连。最小修复：执行前按 `(actorId, key)` 原子占位，同 hash 等待或重放，不同 hash 拒绝；业务提交与幂等结果之间须有可恢复的记录。在此之前，不能仅凭携带 key 将不确定写入标为可安全重试。

2. **[P2] 正式数学字段缺失时，仍返回 `formalContextComplete: true`。**
   位置：[service/src/read-models.ts:220](/Users/naixu/Academic/quantum-open-problems/service/src/read-models.ts:220)、[read-models.ts:252](/Users/naixu/Academic/quantum-open-problems/service/src/read-models.ts:252)。

   `clauses` 没有输出 `kind` 和 `quantity.name/symbol/direction`。**已用通过 schema 和 Statement rules 的内存 fixture 复现：**量的定义仅存于 `quantity`，整个 bundle 不含其名称、符号，却报告 `formalContextComplete: true`、`incomplete: false`。调用方可能缺少所求量或方向，仍按完整陈述开展研究。

   **归因：字段遗漏既存，本次新增完整性标志给出了错误保证。**最小修复：把这些正式字段纳入 required section，并计入 `minimumRequiredTokens`；补充不在正文重复结构化字段的测试。

3. **[P2] legacy HTTP 的取消通知无法取消原请求。**
   位置：[mcp/src/http.ts:57](/Users/naixu/Academic/quantum-open-problems/mcp/src/http.ts:57)、[shared-server.ts:23](/Users/naixu/Academic/quantum-open-problems/mcp/src/shared-server.ts:23)。

   官方默认 legacy 客户端通过另一个 POST 发送 `notifications/cancelled`，而 `legacy: "stateless"` 为每个 POST 创建独立 SDK 实例。通知找不到原请求，上游 fetch 继续运行至完成或 20 秒超时。**已用官方 Client、HTTP transport 和实际 handler 的内存探针复现：**legacy 的 `upstreamAborted=false`，2026 为 `true`。

   **归因：既有无状态架构下，本次取消传播未补齐。**最小修复：为 legacy 请求提供隔离的会话关联及实例复用，并补 HTTP 取消测试；不能使用跨客户端共享的数字 request ID 表，否则会破坏调用隔离。

4. **[P2] 按现有流程单独升级 MCP，会使旧 API 的 `build_context` 失败。**
   位置：[mcp/src/schemas.ts:86](/Users/naixu/Academic/quantum-open-problems/mcp/src/schemas.ts:86)、[部署指南:112](/Users/naixu/Academic/quantum-open-problems/deploy/ubuntu/README.md:112)。

   部署指南允许只切换 MCP release，但新输出校验无条件要求 `qop-context/2`。**已复现：**将 baseline `contextBundle` 的正常响应交给新 SDK server，得到 `isError: true`、缺少 `schemaVersion` 等字段的输出校验错误，原结果不再交付。

   **归因：新增部署兼容性回归。**最小修复：明确最低 API contract，要求先升级 service，并在切换 MCP release 前检查兼容性；或提供版本感知的输出处理，不能把旧结果冒充完整 v2 context。

完成度：主体功能已实现，但安全重试、正式上下文完整性、legacy HTTP 取消及升级兼容性尚未完成验收。以上使用只读和内存探针核验，未修改仓库或验证线上部署。
