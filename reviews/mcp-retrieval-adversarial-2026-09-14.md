**发现 1 项 P2：`research` 视图静默丢失导入题目的后续正文修订。**

位置：[service/src/read-models.ts:38](/private/tmp/qop-mcp-complete-20260914/service/src/read-models.ts:38)。

- **触发与复现：**通过 `entity-revision` 为已有导入题目的 `body` 添加独有的研究背景，保持 `authoredCatalog` 不变。内存 r2 fixture 经 `materialize`、schema、Problem/Contribution rules 检查通过；完整视图包含新增文字，研究视图完全缺失，官方 SDK 仍返回 `isError:false`。
- **影响：**代码仅凭存在导入快照就认定正文全部重复。`get_problem(view=research)` 和默认使用该视图的抽样接口会遗漏后续修订的研究说明，且没有遗漏标志。
- **最小修复：**只有确认正文仍等于导入快照的重复投影时才删除；否则保留正文，并增加导入题目正文修订的回归测试。

其余审查范围未确认新的可操作回归，未重报已关闭发现。两项 TypeScript 检查及 52 项测试通过；官方 SDK→MCP HTTP→API HTTP 的内存 HTTP parser 探针通过 66 项断言，覆盖两代协议。3 项测试因临时文件或端口初始化遭 `EPERM` 阻止；未复验磁盘重启、临时 Git 历史、真实 TCP 或联网模型评测。未修改文件、访问凭据或联网；科学数据、许可证及页脚无待审变更。