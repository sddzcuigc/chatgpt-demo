# 测试说明

1. Vercel Project=`18.x`，仓库均为 24：结论应为“只需修改 Vercel Project”。
2. Vercel Project=`24.x`，`engines.node` 包含 18：必须阻断。
3. `.nvmrc` 或 `.node-version` 包含 18：必须阻断。
4. `vercel.json` 包含 18.x 或 20.x：必须阻断。
5. 全部配置为 24，且错误日志不含 discontinued/18.x：允许部署。
6. 保存后刷新：最近记录保留。
7. Markdown 导出：包含项目、各运行时配置、检查项、结论和人工接管步骤。
8. 390px：单栏排列，表单与按钮不产生明显横向溢出。
