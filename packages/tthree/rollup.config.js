import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";

// 主构建配置
const config = [
    {
        input: "src/index.ts",
        output: [
            {
                file: "dist/three-base.esm.js",
                format: "esm",
                sourcemap: true,
            },
            //   {
            //     file: 'dist/three-base.cjs.js',
            //     format: 'cjs',
            //     sourcemap: true
            //   },
            //   {
            //     file: 'dist/three-base.umd.js',
            //     format: 'umd',
            //     name: 'ThreeBase',
            //     sourcemap: true
            //   }
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
            }),
            terser(),
        ],
    },
    // 类型声明文件构建
    {
        input: "dist/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
        external: ["three"],
    },
];

export default config;
