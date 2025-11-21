import { defineConfig } from "vitepress";
import { readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

// 获取当前文件所在目录
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// 自动发现 API 文档
function getApiSidebar() {
    // 现在配置文件在 docs/.vitepress/ 下，所以 ../ 就是 docs/ 目录
    const apiDir = join(__dirname, "../api");
    const sidebar: any[] = [{ text: "概览", link: "/api/" }];

    // 读取模块文档（直接在 api 目录下）
    const moduleFiles = readdirSync(apiDir)
        .filter(
            (file) =>
                file.endsWith(".md") &&
                file !== "README.md" &&
                file !== "index.md",
        )
        .map((file) => {
            const moduleName = file.replace(".md", "");
            return {
                text: moduleName,
                link: `/api/${moduleName}`,
            };
        })
        .sort((a, b) => {
            // 排序：CameraController, RenderEngine, SceneManager, ThreeApp
            const order = [
                "CameraController",
                "RenderEngine",
                "SceneManager",
                "ThreeApp",
            ];
            const aIndex = order.indexOf(a.text);
            const bIndex = order.indexOf(b.text);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return a.text.localeCompare(b.text);
        });

    if (moduleFiles.length > 0) {
        sidebar.push({
            text: "核心模块",
            items: moduleFiles,
        });
    }

    return sidebar;
}

export default defineConfig({
    title: "tthree",
    description:
        "A TypeScript-based Three.js wrapper library providing core functionality for 3D graphics",
    lang: "zh-CN",

    themeConfig: {
        nav: [
            { text: "首页", link: "/" },
            { text: "快速开始", link: "/guide/getting-started" },
            { text: "API 文档", link: "/api/" },
        ],

        sidebar: {
            "/api/": [
                {
                    text: "API 文档",
                    items: getApiSidebar(),
                },
            ],
            "/guide/": [
                {
                    text: "指南",
                    items: [
                        { text: "快速开始", link: "/guide/getting-started" },
                    ],
                },
            ],
            "/": [
                {
                    text: "指南",
                    items: [
                        { text: "介绍", link: "/" },
                        { text: "快速开始", link: "/guide/getting-started" },
                    ],
                },
                {
                    text: "API",
                    items: [{ text: "API 文档", link: "/api/" }],
                },
            ],
        },

        socialLinks: [
            // { icon: 'github', link: 'https://github.com/yourusername/tthree' }
        ],

        footer: {
            message: "基于 TypeDoc 生成",
            copyright: "Copyright © 2024 tthree",
        },

        search: {
            provider: "local",
        },
    },

    // 确保 Markdown 文件中的链接正确解析
    markdown: {
        lineNumbers: true,
    },
});
