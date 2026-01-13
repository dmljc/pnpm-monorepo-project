import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
    // 全局忽略规则（必须在最前面）
    {
        ignores: [
            "**/dist/**",
            "**/node_modules/**",
            "**/.git/**",
            "**/cache/**",
            "**/.vitepress/cache/**",
            "**/.vitepress/**/*.js",
            "**/coverage/**",
            "**/documentation/**",
            "**/*.js", // 忽略所有 .js 文件（VitePress 缓存等）
        ],
    },
    {
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            eslintConfigPrettier,
            eslintPluginPrettierRecommended,
        ],
        files: ["**/*.{ts,tsx}"], // eslint 检测的文件，根据需要自行设置
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                // 解决多 tsconfig 解析根目录不明确的问题
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            // 只启用基本的 React hooks 规则，关闭可能导致问题的严格规则
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "off", // 关闭 exhaustive-deps 检查

            "prettier/prettier": "warn", // 默认为 error，改为 warn 避免阻塞
            "arrow-body-style": "off",
            "prefer-arrow-callback": "off",

            "@typescript-eslint/no-explicit-any": "off", // allow any type
            "@typescript-eslint/no-non-null-asserted-optional-chain": "error",

            "@typescript-eslint/no-unused-expressions": [
                "error",
                {
                    allowShortCircuit: true,
                },
            ],
            // 检测未使用的变量
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
);
