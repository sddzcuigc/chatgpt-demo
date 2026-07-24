# Node.js 24 统一基线

## 目标

把仓库声明、本地版本管理、CI 与 Vercel 项目设置统一到 Node.js 24.x，避免“代码写的是 24、构建仍跑 18”的伪升级。

## 四处一致性

| 检查点 | 目标值 | 当前证据 |
|---|---|---|
| `package.json` | `>=24 <25` | 已完成 |
| `.nvmrc` | `24` | 已完成 |
| `.node-version` | `24` | 已完成 |
| GitHub Actions | `node-version: '24'` | Run #2 已成功 |
| Vercel Project Settings | `24.x` | **未完成：控制面仍显示 `18.x`** |
| Vercel 构建实际版本 | `v24.x` | 已由 `engines.node` 覆盖并成功构建 |

## 本轮实证

1. GitHub Actions `Node 24 verification` Run #2 已完成，结论为 `success`。
2. Vercel Preview `dpl_3DrfB52ub46b2M2W4g5p5H4hc8U5` 状态为 `READY`。
3. Vercel 构建日志明确提示：由于 `package.json` 中的 `engines.node: >=24 <25`，Project Settings 的 `18.x` 不再生效，实际使用 `24.x`。
4. 这证明代码声明可以覆盖平台旧设置，但**不代表治理完成**：控制面仍保留错误版本，后续移除 `engines` 或迁移目录时可能重新退回旧版本。

## 验收规则

1. 仓库中的所有 Node 版本声明必须指向 24.x。
2. CI 必须在 Node 24 上完成安装和构建。
3. Vercel Project Settings 必须显式改为 24.x，不能长期依赖仓库覆盖。
4. 新部署日志必须证明实际使用 Node 24.x。
5. 仓库声明、CI、本地实际环境、Vercel 设置和构建日志全部一致后，才允许标记迁移完成。

## 当前结论

- **代码与 CI：通过。**
- **Vercel 实际构建：通过，使用 Node 24.x。**
- **Vercel Project Settings：未通过，仍显示 18.x。**
- **整体迁移：未完成。**

## 人工接管

Vercel 当前连接器不能修改 Node.js Version。请执行：

`Project → Settings → General → Node.js Version → 24.x → Save → Redeploy`

完成后重新读取 Project 设置，并检查新构建日志。