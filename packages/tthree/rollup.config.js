import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";

// 主构建配置
const mainConfig = {
    input: "src/index.ts",
    output: [
        {
            file: "dist/three-base.esm.js",
            format: "esm",
            sourcemap: true,
        },
    ],
    external: ["three"],
    plugins: [
        nodeResolve({
            browser: true,
        }),
        commonjs(),
        typescript({
            tsconfig: "./tsconfig.json",
            exclude: ["**/*.test.ts", "**/*.spec.ts"],
            declaration: true,
            declarationDir: "dist",
        }),
        terser(),
    ],
};

// 类型声明配置（仅在非 watch 模式下启用）
const dtsConfig = {
    input: "dist/index.d.ts",
    output: [
        {
            file: "dist/index.d.ts",
            format: "esm",
        },
    ],
    plugins: [dts()],
    external: ["three"],
};

// 根据是否为 watch 模式导出相应的配置
export default (commandLineArgs) => {
    const config = [mainConfig];

    // 仅在非 watch 模式下添加 dts 配置
    if (!commandLineArgs.watch) {
        config.push(dtsConfig);
    }

    return config;
};
