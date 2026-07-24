# Node 24 Evidence Dashboard

静态证据看板，把仓库声明、GitHub CI、Vercel Settings、构建日志与独立本地验证集中到一屏。

## 路径

`/node24-evidence/`

## 核心路径

查看完成度 → 核对每项证据 → 复制独立验证命令 → 补齐最后证据。

## Node.js

仓库统一要求 Node.js `>=24 <25`。本页面本身为原生 HTML/CSS/JS，无运行时依赖。

## 测试

1. Astro 构建成功。
2. 页面在桌面端为双栏。
3. 390px 下为单栏且无横向溢出。
4. 复制按钮写入 `npm run proof:node24:local`。
5. 不读取账号、密钥或敏感数据。
