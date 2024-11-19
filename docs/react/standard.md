---
outline: deep
---

# Eslint Prettier

为了保证代码质量和代码规范，项目内集成了以下几种代码校验工具：

-   ESLint 用于 JavaScript 代码检查
-   Prettier 用于代码格式化
    ...

## Eslint

::: details 点击查看

```js
// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config({
    extends: [
        js.configs.recommended,
        ...tseslint.configs.recommended,
        eslintConfigPrettier,
        eslintPluginPrettierRecommended,
    ],
    files: ["**/*.{ts,tsx}"], // eslint 检测的文件，根据需要自行设置
    ignores: ["dist"],
    languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
    },
    plugins: {
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
    },
    rules: {
        ...reactHooks.configs.recommended.rules,

        "prettier/prettier": "warn", // 默认为 error
        "arrow-body-style": "off",
        "prefer-arrow-callback": "off",

        "@typescript-eslint/no-explicit-any": "off", // allow any type
        "react-hooks/exhaustive-deps": "off",
        "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
    },
});
```

:::

## Prettier

::: details 点击查看

```js
// prettier.config.js
export default {
    trailingComma: "all",
    singleQuote: false,
    semi: true,
    tabWidth: 4,
};
```

:::
