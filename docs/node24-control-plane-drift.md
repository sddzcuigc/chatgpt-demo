# Node.js 24 控制面漂移检查

## 问题
仓库、CI 与某次 Vercel 构建都可能实际使用 Node.js 24，但 Vercel Project Settings 仍保存 18.x。此时当前构建可成功，未来仍存在回退、误判和维护漂移。

## 四处一致
1. 仓库声明：`package.json`、`.nvmrc`、`.node-version`、Dockerfile、CI。
2. 本地实际：开发与测试命令真正运行在 Node 24。
3. 平台控制面：Vercel Project Settings 显示 24.x。
4. 构建日志：新部署日志实际显示 Node 24.x。

四处均为 24.x 才能标记迁移完成。

## 可执行门禁
运行：

```bash
npm run audit:node24
```

脚本会检查仓库声明、CI、Dockerfile、Vercel 配置和当前运行时，发现 Node 18/20/22 或非 Node 24 实际环境时退出失败。

## 当前事实
- 仓库声明：24.x。
- GitHub CI：Node 24 已验证。
- Vercel 最近构建：实际使用 24.x。
- Vercel Project Settings：仍为 18.x。
- 当前连接器：只能读取 Project，不能修改 Settings。

## 人工接管
`chatgpt-demo → Settings → General → Node.js Version → 24.x → Save → Redeploy`

修改后重新读取 Project 设置与新构建日志，二者均为 24.x 后再合并基线 PR。

## 决策规则
配置覆盖只能证明本次构建可用；控制面、仓库、测试和日志一致，才证明运行时治理完成。
