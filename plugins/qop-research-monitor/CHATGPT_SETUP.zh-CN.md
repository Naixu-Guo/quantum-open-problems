# 把网站维护接到 ChatGPT

这份包负责网站的论文核查与 PR，与你每天 09:30 的个人论文、AI 推荐分开。代码封装完成不等于服务已经上线，也不等于 ChatGPT 已经创建定时任务。

推荐使用网站现有服务器，增加独立子域名 `research.qiqc-op.com`。这是待配置的地址；现有的 `api.qiqc-op.com/mcp` 仍是公开只读接口，不能代替这里的写入服务。

## 1. 服务器只需配置一次

准备一个能够运行 Docker Compose 的 Linux 服务器，将实际使用的子域名解析到它，并配置有效 HTTPS 证书。仓库已有服务器可以复用，但本包不会自动改动生产网站或 DNS。

在 [GitHub Developer settings](https://github.com/settings/developers) 新建 **OAuth App**：

| 项目 | 填写内容 |
| --- | --- |
| Application name | Quantum Open Problems Monitor |
| Homepage URL | `https://qiqc-op.com` |
| Authorization callback URL | `https://research.qiqc-op.com/auth/callback`（换成实际域名） |

保存 Client ID 和 Client secret。OAuth 只确认登录身份；默认只有 `Naixu-Guo` 的数字账号 ID `58557763` 可以调用工具。

再到 [Fine-grained tokens](https://github.com/settings/personal-access-tokens) 创建一个仅限 **Naixu-Guo/quantum-open-problems** 的 token：

- Contents、Pull requests、Issues：Read and write。Issues 用于给 PR 添加仓库要求的 `ledger-change` 标签。
- Checks、Commit statuses：Read-only，用于读取 CI。
- Metadata：GitHub 自动附带的只读权限。

不需要账户管理或 Workflows 写权限。选择合适的过期日期，过期前更换服务器上的 token。密钥只在服务器交互输入，不要粘贴到 ChatGPT 或提交到 GitHub。

把本目录放到服务器，在该目录运行：

```sh
python3 configure.py
docker compose up -d --build
curl --fail http://127.0.0.1:8790/healthz
```

`configure.py` 会提示输入域名、OAuth 配置和仓库 token，并生成加密存储所需的稳定密钥。首次生成的 `.env` 权限为 0600；已有文件不会被覆盖。

参考 `deploy/ubuntu/research-monitor-nginx.conf` 添加独立 HTTPS 虚拟主机。先签发证书，再启用 HTTPS 配置；修改域名和证书路径后运行 `nginx -t`，成功才 reload。必须转发整个域名，不能只转发 `/mcp`，因为 OAuth 回调和发现端点也需要公网访问。不要修改现有网站虚拟主机。

上线后检查：

```sh
curl --fail https://research.qiqc-op.com/healthz
curl --fail https://research.qiqc-op.com/.well-known/oauth-authorization-server
```

健康检查应返回 `{"status":"ok"}`，发现文档中的地址应使用实际公网 HTTPS 域名。完整验收仍需下面的 ChatGPT 登录与工具调用。

## 2. 在 ChatGPT 连接

在支持远程 MCP 和云端任务的 ChatGPT 账户/工作区中：

1. 设置 → **Security & login** → 开启 **Developer mode**。
2. **Plugins** → 添加/创建连接，名称填 **Quantum Open Problems Monitor**。
3. MCP Server URL 填 `https://research.qiqc-op.com/mcp`，认证选 **OAuth**。
4. 按页面引导，用 `Naixu-Guo` 的 GitHub 账户登录并授权。服务器的仓库 token 不应填入 ChatGPT。

实际菜单和功能可用性以账户界面为准。如果看不到相应入口，先核实工作区功能与管理员配置；这一步不能用一个本地文件夹代替。[官方连接说明](https://developers.openai.com/plugins/deploy/connect-chatgpt)

新建一条专门用于网站维护的云端对话，启用该连接，先发：

> 使用 Quantum Open Problems Monitor。先调用 get_status 和 workflow_instructions，读取一个当前未解决问题，确认我能够访问工具、服务具备发布配置、问题来自最新 main。这次只检查连接，先不要创建 PR。

成功后再手动运行一次真实的文献核查。需要发布时，检查服务器生成的差异和验证结果，并用真实科学内容创建 draft PR；不要为了测试写入虚假的学术结论。

## 3. 创建每天的云端任务

连接和手动核查都成功后，在同一条云端对话发送：

> 请创建一个独立的 ChatGPT 云端定时任务，每天 Asia/Singapore 时间上午 10:30 执行，只维护 Quantum Open Problems 网站。
>
> 每次使用 Quantum Open Problems Monitor，先调用 get_status、workflow_instructions，恢复尚未完成的核查，然后获取 quant-ph 和 cond-mat.str-el 当前公告，按完整问题表述核对论文。保留论文英文原题、作者原名与原始链接。
>
> 核实正文、定理位置和适用范围；只凭摘要不能判定解决。部分进展保留 Unsolved；完整解决必须有实际完成的独立复核。证据不足就保存待办，下次继续。对核实后的更新，我授权你校验 JSON、TeX、ledger、测试和构建，查看完整 diff，然后自行创建 draft PR，不必每天重新问我。不要自动合并或部署。相同论文版本和问题不要重复开 PR。
>
> 仅在有值得关注的进展、新 PR、结论变化或需要我处理的阻碍时，发一条简短中文消息，附论文、问题和 PR 的原链接。没有变化时保持安静。任务不包含 09:30 的个人论文与 AI 推荐，也不依赖我电脑上的目录。

确认 ChatGPT 展示的计划确实是**云端、每日、新加坡 10:30**，并能看到它保存的任务。MCP 自身没有计时器；只连接 MCP 不会自动开始每天执行。[官方定时任务说明](https://learn.chatgpt.com/docs/automations)

## 4. 验收后才切换旧任务

先执行一次“立即运行”，再观察一次真正无人值守的定时运行。确认它确实调用了工具、保存了核查进度，且既有权限能够完成必要写入。如果 ChatGPT 在无人值守运行中仍要求逐次批准，说明该账户当前的工具授权还没有满足自动发布条件，不能把它当作完全自动化已经完成。

云端验收通过后，再删除旧 Codex 任务中的 10:30 网站维护部分，保留 09:30 个人简报。旧的待核查科学结论需要读取原证据并重新绑定当前记录；不要直接把旧“已核实”状态视为新服务的验证结果。此包不会擅自修改旧自动化。

以后更新代码时用 `docker compose up -d --build`，保持原 `.env` 和数据卷。备份时先停止容器，将数据卷和 `.env` 一起加密备份，再启动；不要执行会删除状态的 `docker compose down -v`。
