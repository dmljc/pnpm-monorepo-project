import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            // 开发模式下直接使用 tthree 源代码
            tthree: path.resolve(
                __dirname,
                "../../packages/tthree/src/index.ts",
            ),
        },
        conditions: ["development", "import"],
    },
    server: {
        port: 2222,
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
        cors: true,
    },
    // 确保 tthree 源代码的更改能被检测到
    optimizeDeps: {
        exclude: ["tthree"],
    },
});
