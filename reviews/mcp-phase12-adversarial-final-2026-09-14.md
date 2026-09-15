原 P2 的 **HTTP 响应与 transport 映射悬挂已修复**，但仍发现一项 P2，生命周期修复尚不能完全关闭。

**P2：合法请求 ID `0`、`""` 的取消和断连清理不会中止上游。**

位置：[mcp/src/http.ts:75](/Users/naixu/Academic/quantum-open-problems/mcp/src/http.ts:75)、[mcp/src/http.ts:82](/Users/naixu/Academic/quantum-open-problems/mcp/src/http.ts:82)。当前逻辑通过 SDK 通知取消，再发送终结错误；但已安装 SDK 的 [_oncancel:6250](/Users/naixu/Academic/quantum-open-problems/mcp/node_modules/@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs:6250) 使用 `if (!notification.params.requestId) return`，会忽略这两个合法 ID。

已用真实 Node HTTP parser 加内存 `Duplex` 独立复现：初始化后首次使用 `0` 或 `""` 发起阻塞工具调用，再取消，均得到：

```text
notificationStatus: 202
terminalCode: -32800
upstreamAborted: false
transport maps: [0, 0, 0]
```

客户端断连也复现 `upstreamAborted:false`。因此响应和映射虽然释放，上游操作与 handler 仍继续执行，直到完成或超时。这是 SDK 既有缺陷影响当前新增清理路径，并非新的持久映射泄漏。

最小修复：采用修正该缺失值判断的 SDK 版本或依赖补丁；增加 `0`、`""` 的取消及断连回归，同时断言上游信号确实 aborted、响应结束、映射释放。

同 ID 复用压力探针还复现了旧结果落入新请求，但同会话复用 ID 违反 [legacy MCP 规范](https://modelcontextprotocol.io/specification/2025-11-25/basic/index#requests)，因此不据此另列 P1。

其余内存探针中，重复取消、无效通知、多请求混合批次、跨会话隔离、正常完成竞态，以及 DELETE／expiry／shutdown 和关闭期间初始化均符合预期，未发现残留映射。

验证限制：选中的六项实际网络测试在监听阶段被沙箱以 `listen EPERM 127.0.0.1` 阻止，不能视为语义失败；上述证据来自内存 HTTP parser，未覆盖真实 TCP／代理行为。本轮未修改文件，未重审无关范围。**原悬挂问题可关闭；整体清理修复仍需处理上述 P2。**