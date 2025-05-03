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
    // ignores: ["dist/**", "cache/**"],
    ignores: [
        "**/dist/**",
        "**/node_modules/**",
        "**/.git/**",
        "**/cache/**",
        "**/coverage/**",
        "**/documentation/**",
    ],
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

        "@typescript-eslint/no-unused-expressions": [
            "error",
            {
                allowShortCircuit: true,
            },
        ],
    },
});
