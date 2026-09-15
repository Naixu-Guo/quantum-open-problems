原先关于合法 ID `0`、`""` 的 P2 **已解决**。本轮在直接受影响的 stdio 包装器中发现一项新的 P2。

**P2：父请求取消后，服务器发起的关联子请求取消通知会被误丢弃。**

位置：[stdio-transport.ts:51](/Users/naixu/Academic/quantum-open-problems/mcp/src/stdio-transport.ts:51)、[stdio-transport.ts:67](/Users/naixu/Academic/quantum-open-problems/mcp/src/stdio-transport.ts:67)。

收到父请求取消时，包装器先删除映射，再通知 SDK。SDK 随后中止父请求，并为关联子请求发送 `notifications/cancelled`；该通知携带父请求的内部 `relatedRequestId`，因此被第 69 行当作退役消息直接丢弃。

**已通过真实 SDK、内存 stdio 对照复现，本次引入：**

- 初始化 ID 为 `"init"`，入站工具请求 ID 为 `7`。
- 内存测试工具发起服务器请求，并通过 `{ signal: ctx.mcpReq.signal }` 关联父请求。
- 取消 `7` 后，原始 transport 发出 `notifications/cancelled { requestId: 1 }`；使用新包装器后，该通知消失。

客户端因此无法获知子请求已取消，可能继续处理直到完成或超时。**当前 QOP 工具尚不发起这类反向请求**，所以此发现限定于你指定检查的双向 transport 行为。

最小修复：将服务器方向的取消独立处理；即使父入站映射已退役，也应转发子请求取消。stdio 可以移除失效的 `relatedRequestId` 后转发，同时继续丢弃退役入站请求的晚到响应。增加上述真实 SDK 级联取消回归。

其余验证结果：

- `0`／`""` 首次使用后的 HTTP 取消、断连均中止上游，响应结束、映射归零，原始响应 ID 保留，其他调用和会话不受影响。
- 混合批次、无效／内部 ID 取消、完成竞态、DELETE／expiry／shutdown、初始化竞态及错误路径通过独立探针。
- stdio 回归 **10/10**；独立探针验证了两代协议、协商回退、正常双向关联和完成后的映射清空。未发现累计保存 retired IDs 或生产代码访问 SDK 私有字段。

四项 localhost 回归在监听阶段遭遇 `listen EPERM`，属于沙箱限制，不能视为语义失败；本轮 HTTP 独立验证使用内存真实 HTTP parser，未复验实际 TCP／代理行为。

未修改文件；`acceptance.ts`、`payloads.ts` 的原始 diff 保持一致。原 P2 可关闭，改动范围内仍剩上述反向取消转发问题。