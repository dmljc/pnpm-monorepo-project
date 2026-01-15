---
outline: deep
---

# 目录

考虑到以下几点，决定使用 `Monorepo` 管理项目。

-   `代码复用`
-   `集中管理`
-   `统一构建`
-   `提升协作效率`

```js
├── apps/                    # 应用层（可独立部署）
│   ├── admin/               # 后台管理系统（原client）
│   │   ├── package.json
│   ├── dashboard/           # 三维可视化大屏应用
│   └── server/              # 后端API服务
│       ├── package.json
├── packages/                # 共享库层
│   └── tthree/             # Three.js基础封装库
│       ├── package.json
├── docs/                    # 文档
├── .gitignore
├── eslint.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prettier.config.js
└── README.md
```
