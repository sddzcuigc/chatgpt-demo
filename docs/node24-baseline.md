# Node.js 24 统一基线

## 目标

把仓库声明、本地版本管理、CI 与 Vercel 项目设置统一到 Node.js 24.x，避免“代码写的是 24、构建仍跑 18”的伪升级。

## 四处一致性

| 检查点 | 目标值 | 本轮状态 |
|---|---|---|
| `package.json` | `>=24 <25` | 已完成 |
| `.nvmrc` | `24` | 已完成 |
| `.node-version` | `24` | 已完成 |
| GitHub Actions | `node-version: '24'` | 已完成 |
| Vercel Project | `24.x` | 阻塞：当前仍为 `18.x` |
| 构建日志实际版本 | `v24.x` | 待 Vercel 改版后验证 |

## 验收规则

1. 仓库中的所有 Node 版本声明必须指向 24.x。
2. CI 必须在 Node 24 上执行 `npm ci` 和 `npm run build`。
3. Vercel Project Settings 必须改为 24.x。
4. 新部署日志必须显示 Node 24.x。
5. 四处全部一致后，才允许标记迁移完成。

## 人工接管

Vercel 当前连接器不能修改 Node.js Version。请执行：

`Project → Settings → General → Node.js Version → 24.x → Save → Redeploy`

随后检查构建日志中的实际 Node 版本。
