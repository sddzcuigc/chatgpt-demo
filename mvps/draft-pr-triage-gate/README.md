# Draft PR Triage Gate

把开放草稿 PR 从“默认保留”改成“保留、合并、关闭或暂停”的显式决策。

## 核心路径
登记草稿 PR → 标注年龄、验证证据与重叠度 → 执行分诊 → 限制最多 3 个活跃草稿 → 导出清理清单。

## 运行
直接打开 `index.html`。Node.js 24 环境下可执行：

```bash
npm run check
npm run build
```
