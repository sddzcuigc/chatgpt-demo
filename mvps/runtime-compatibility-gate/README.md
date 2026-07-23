# Runtime Compatibility Gate

一个部署前运行时一致性检查器，解决“Vercel Project 仍是 Node.js 18.x，但仓库已经升级”的重复构建失败。

## 核心路径

填写 Vercel Project 与仓库运行时配置 → 检查冲突 → 输出阻断或放行 → 保存记录 → 导出 Markdown。

## 运行

直接打开 `index.html`，或执行：

```bash
python -m http.server 8000
```

## 构建与检查

```bash
npm run check
npm run build
```

本项目是静态 HTML/CSS/JS，`package.json` 仅用于固定 Node.js 24.x 契约和部署环境检查。

## 人工接管

若连接器无法修改 Vercel Project 设置：

`Project → Settings → General → Node.js Version → 24.x → Save → Redeploy`
