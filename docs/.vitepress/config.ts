import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "Nest React19 Admin 全栈项目",
    description: "Nest React19 Admin 全栈项目 描述信息",
    // base: "/vitepress-project", github.io 地址需要base
    base: "/", // 自定义域名
    head: [
        [
            "link",
            {
                rel: "icon",
                href: "https://vitepress.dev/vitepress-logo-mini.svg",
            },
        ],
    ],
    lastUpdated: true,
    markdown: {
        lineNumbers: true,
    },
    themeConfig: {
        // logo: "/logo.png",
        logo: "https://vitepress.dev/vitepress-logo-mini.svg",
        nav: [
            { text: "首页", link: "/" },
            { text: "前端", link: "../react/index.md" },
            { text: "三维", link: "/tthree/README.md" },
            { text: "后端", link: "../nest/index.md" },
        ],
        sidebar: {
            // 当用户位于 `react` 目录时，会显示此侧边栏
            "/react/": [
                {
                    text: "工程",
                    collapsed: false,
                    items: [
                        { text: "目录", link: "/react/monorepo.md" },
                        {
                            text: "规范",
                            link: "/react/standard.md",
                        },
                        {
                            text: "路由",
                            link: "/react/router.md",
                        },
                        { text: "换肤", link: "/react/antd.md" },
                    ],
                },
            ],
            "/nest/": [
                {
                    text: "nest",
                    collapsed: false,
                    items: [
                        { text: "第一节", link: "/nest/1.md" },
                        { text: "第二节", link: "/nest/2.md" },
                    ],
                },
            ],
            "/tthree/": [
                {
                    text: "tthree API",
                    collapsed: true,
                    items: [
                        { text: "概览", link: "/tthree/README.md" },
                        {
                            text: "ThreeBase基类",
                            link: "/tthree/ThreeBase基类/ThreeBase.md",
                        },
                        {
                            text: "ThreeBase基类参数",
                            link: "/tthree/ThreeBase基类参数/Params.md",
                        },
                    ],
                },
            ],
        },
        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/dmljc/vitepress-project",
            },
        ],
        search: {
            provider: "local",
        },
        // 编辑链接
        editLink: {
            pattern:
                "https://github.com/dmljc/vitepress-project/tree/main/docs/:path", // 自己项目仓库地址
            text: "在 github 上编辑此页",
        },
        lastUpdatedText: "最后更新", // string
        // 右侧边栏配置，默认值是"In hac pagina"
        outlineTitle: "页面导航",
        // 站点页脚配置
        footer: {
            message: "Copyright © 2024-present 张芳朝",
            copyright: `
                <ClientOnly>
                    <a
                        style="text-decoration-line: none;"
                        href="https://beian.mps.gov.cn/#/query/webSearch?code=33011002017672"
                        rel="noreferrer"
                        target="_blank"
                    >
                        <img
                            style="width: 16px; display: inline-block; position: relative; top: 4px; right: 4px;"
                            src="备案图标.png"
                        />
                    浙公网安备33011002017672
                    </a>

                    <a 
                        style="text-decoration-line: none;" 
                        href="https://beian.miit.gov.cn"
                        target="_blank"
                    >
                        &nbsp; 浙ICP备2024066792号-1
                    </a>
                </ClientOnly>
            `,
        },
    },
});
