import { defineConfig } from "vitepress";

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
                    items: [
                        { text: "SceneManager", link: "/api/SceneManager" },
                        {
                            text: "CameraController",
                            link: "/api/CameraController",
                        },
                        { text: "RenderEngine", link: "/api/RenderEngine" },
                        { text: "Tthree", link: "/api/Tthree" },
                    ],
                    collapsed: false,
                },
            ],
            "/api": [
                {
                    text: "API 文档",
                    items: [
                        { text: "SceneManager", link: "/api/SceneManager" },
                        {
                            text: "CameraController",
                            link: "/api/CameraController",
                        },
                        { text: "RenderEngine", link: "/api/RenderEngine" },
                        { text: "Tthree", link: "/api/Tthree" },
                    ],
                    collapsed: false,
                },
            ],
            "/guide/": [
                {
                    text: "指南",
                    collapsed: true,
                    items: [
                        { text: "快速开始", link: "/guide/getting-started" },
                    ],
                },
            ],
            "/": [
                {
                    text: "文档编写",
                    collapsed: true,
                    items: [
                        {
                            text: "TypeDoc 标签参考",
                            link: "/TYPEDOC-TAGS-REFERENCE",
                        },
                    ],
                },
            ],
        },

        footer: {
            message: "基于 TypeDoc 生成",
            copyright: "Copyright © 2025 tthree",
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

