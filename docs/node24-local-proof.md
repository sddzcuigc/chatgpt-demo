# Node.js 24 本地可复现验证

## 目标

把“开发者机器是否安装 Node.js 24”转化为一个可重复、可审计的容器验证流程。只要本机具备 Docker，就能在固定的 `node:24.4.0-bookworm-slim` 环境中完成安装、版本审计、构建和证据门检查。

## 核心命令

```bash
npm run proof:node24:local
```

等价于：

```bash
docker build -f Dockerfile.node24 -t chatgpt-demo-node24-proof .
docker run --rm chatgpt-demo-node24-proof
```

## 输入

- 当前仓库源码
- `package.json`
- 版本锁文件
- `docs/node24-evidence.current.json`

## 输出

- 容器内 `node --version`
- `npm run audit:node24` 结果
- `npm run build` 结果
- `npm run audit:node24:evidence` 结果
- 进程退出码：全部通过为 0，任一失败为非 0

## 权限与依赖

- 只需要本机 Docker 权限
- 不读取生产密钥
- 不写入 Vercel 或 GitHub
- 容器退出后自动删除

## 人工接管

若 Docker 不可用：

1. 安装 Node.js 24.x；
2. 执行 `node --version`，确认输出 `v24.*`；
3. 执行 `npm install && npm run audit:node24 && npm run build && npm run audit:node24:evidence`；
4. 保存完整终端日志和时间戳。

## 已知限制

- 容器验证的是 Linux 环境，不能覆盖 Windows/macOS 原生模块差异；
- 使用 `npm install` 而非 `npm ci`，因为当前仓库没有 npm lockfile；
- 依赖下载仍受网络和上游包仓库可用性影响。

## 验收标准

- 容器基础镜像固定为 Node 24；
- 日志明确打印 `v24.*`；
- 版本审计、构建和证据门全部通过；
- 退出码为 0；
- 未使用 Node 18/20/22。
