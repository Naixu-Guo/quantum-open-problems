仍有 **1 项可操作问题**：

**[P2] legacy 取消及会话关闭未终结原 HTTP 响应，导致连接和请求映射累积。**
位置：[mcp/src/http.ts:89](/Users/naixu/Academic/quantum-open-problems/mcp/src/http.ts:89)、[http.ts:99](/Users/naixu/Academic/quantum-open-problems/mcp/src/http.ts:99)、[http.ts:71](/Users/naixu/Academic/quantum-open-problems/mcp/src/http.ts:71)。

**已复现，属于此次会话修复引入的问题。** 使用真实 Node HTTP parser、内存 `Duplex` 和当前 `createHttpMcpServer`：

- 同一 legacy 会话连续启动并取消 5 次调用：上游全部中止，但留下 **5 个 `_streamMapping`、5 个 `_requestToStreamMapping`，5 个原 HTTP 请求均没有响应**。
- 随后 DELETE 返回 `200`，原请求仍为 `writableEnded=false`，socket 也未关闭。

原因是 `enableJsonResponse: true` 下，SDK 取消请求后不再发送结果；关闭 transport 也没有兑现正在等待的 JSON Response promise，`toNodeHandler` 因而一直等待。活跃会话反复取消会积累资源；DELETE 虽释放会话配额，却未清理这些连接，最终依赖客户端或代理断开。

最小修复：对取消、DELETE、过期和关闭路径，显式终结对应的 HTTP 响应并回收请求映射；补测试断言原响应确实 `finish/close`，而不只检查上游 abort 和会话配额。

原四项发现的状态：

| 原发现 | 复核结论 |
|---|---|
| 1. 同键重复执行、receipt 保存失败 | **已解决**，限于约定的 at-most-once／fail-closed 保证。并发、保存失败及业务写入后抛错探针均只产生一条业务记录。 |
| 2. 正式 `kind/quantity` 丢失 | **已解决**，字段完整进入 required section，并计入预算。 |
| 3. legacy HTTP 取消未传播 | **原问题已解决**，但产生上述响应清理缺口。 |
| 4. 独立升级兼容性 | **已解决**，已有能力检查、明确的不兼容错误及 API-first 部署流程。 |

验证限制：14 项无需监听端口的回归通过；4 项涉及监听端口的测试因沙箱 `EPERM` 未能运行，改用内存 HTTP 探针核查关键路径。未重跑磁盘持久化重启或线上部署验证，未修改或保存文件。

完成度：四项原始触发已修复，但 legacy HTTP 清理问题仍需处理，尚不能完整验收。
