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
├── docs
├── packages
|   ├── client
|   |   ├── package.json
|   ├── server
|   |   ├── package.json
├── .gitignore
├── eslint.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── prettier.config.js
├── README.md
```
