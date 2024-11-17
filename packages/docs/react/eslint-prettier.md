---
outline: deep
---

# Eslint Prettier

## Eslint

`Eslint` 是一个插件化的 `JavaScript代码检测工具`，主要用于检查代码中的错误和潜在问题，同时也可以进行代码风格检查。‌‌

使用 `Vite` 创建 `React` 项目之后生成的 `eslint.config.js` 配置如下：

::: details 点我查看代码

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
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
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
        },
    },
);
```

:::

`Eslint` 属于全局性项目配置，一个仓库只需要一份配置即可。所以，把 packages 目录下所有的 Eslint 配置移除，只需要在根目录维护一份即可。

以下是根目录 Eslint 配置文件：

::: details 点我查看代码

```js
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

`Prettier` 是一个代码格式化工具，可以帮助开发人员自动格式化代码，使代码风格保持一致。Prettier 的主要目标是通过提供一致的代码格式化规则来减少团队成员之间的代码格式争论，并提高代码的可读性和可维护性。

```js
// prettier.config.js
export default {
    trailingComma: "all",
    singleQuote: false,
    semi: true,
    tabWidth: 4,
};
```

## package.json 配置

```js
"scripts": {
    ...
    "lint": "eslint", // 代码检查
    "lint:fix": "eslint --fix" // 代码修复
    ...
}
```

## 遇到的问题

::: warning 版本升级遇到的问题
`Eslint 9.14` 版本升级到 `9.15` 版本之后报错如下；
:::

```js
"@eslint/js": "^9.14.0", // [!code --]
"eslint": "^9.14.0", // [!code --]

"@eslint/js": "^9.15.0", // [!code ++]
"eslint": "^9.15.0", // [!code ++]
```

```js
ESLint: 9.15.0

TypeError: Error while loading rule '@typescript-eslint/no-unused-expressions':
Cannot read properties of undefined (reading 'allowShortCircuit')
```

解决方式如下：

```js
riles: {
     "@typescript-eslint/no-unused-expressions": [
        "error",
        {
            allowShortCircuit: true,
        },
    ]
}
```
