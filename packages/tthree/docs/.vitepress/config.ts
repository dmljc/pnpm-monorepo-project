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

    // 检查 api 目录是否存在
    try {
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
    } catch {
        // 如果 api 目录不存在，返回空的侧边栏（只有概览）
        console.warn("API 文档目录不存在，请先运行 pnpm docs 生成文档");
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
            { text: "文档编写", link: "/TYPEDOC-TAGS-REFERENCE" },
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
                    text: "文档编写",
                    items: [
                        {
                            text: "TypeDoc 标签参考",
                            link: "/TYPEDOC-TAGS-REFERENCE",
                        },
                    ],
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

        // 配置右侧导航（outline）
        outline: {
            level: [2, 4], // 显示 h2 到 h4 级别的标题
            label: "页面导航",
        },
    },

    // Markdown 配置
    markdown: {
        lineNumbers: true,
        // 配置外部链接图标
        externalLinkIcon: true,
        // 配置容器标签
        container: {
            tipLabel: "提示",
            warningLabel: "警告",
            dangerLabel: "危险",
            infoLabel: "信息",
            detailsLabel: "详情",
        },
    },
});
