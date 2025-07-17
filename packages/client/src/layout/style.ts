import { createStyles } from "antd-style";

export default createStyles(({ css }) => ({
    // 侧边栏
    side: {
        height: "100vh",
    },
    // 菜单
    menu: {
        borderInlineEnd: "none",
    },
    // logo区域
    logoContainer: {
        height: 64,
        lineHeight: "64px",
        fontSize: 18,
        fontWeight: "bold",
        paddingInlineStart: 24,
    },
    logo: {
        width: 32,
        height: 32,
        display: "inline-block",
        verticalAlign: "middle",
    },
    text: {
        width: 32,
        height: 32,
        lineHeight: "32px",
        verticalAlign: "middle",
        paddingInlineStart: 8,
    },
    // 头部区域
    header: {
        padding: 0,
        display: "flex",
    },
    headerLeft: {
        width: 200,
        paddingInlineStart: 10,
    },
    headerRight: {
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: 24,
        alignItems: "center",
    },
    headerIconTheme: {
        marginTop: 2,
    },
    headerIcon: css`
        width: 34px;
        height: 34px;
        line-height: 34px;
        font-size: 16px;
        justify-content: center;

        &:hover {
            cursor: pointer;
            border-radius: 100%;
            background: rgba(0, 0, 0, 0.04);
        }
    `,
    logout: {
        padding: 4,
    },
    avatarWrapper: {
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "100%",
        transition: "background 0.5s",

        "&:hover": {
            background: "rgba(0, 0, 0, 0.05)",
        },
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: "100%",
    },
    content: {
        height: "calc(100vh - 98px)",
        margin: "24px 24px",
        overflow: "auto",
    },
    footer: {
        width: "calc(100% - 250px)",
        position: "fixed",
        bottom: 0,
        left: 250,
        right: 0,

        backgroundColor: "#fff",
        padding: "10px 0",
        textAlign: "center",
        color: "rgba(0, 0, 0, 0.45)",
        fontSize: 12,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },

    // container: {
    //     backgroundColor: token.colorBgLayout,
    //     borderRadius: token.borderRadiusLG,
    //     maxWidth: 400,
    //     width: "100%",
    //     height: 180,
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     flexDirection: "column",
    //     marginLeft: "auto",
    //     marginRight: "auto",
    // },
    // card: css`
    //     box-shadow: ${token.boxShadow};
    //     padding: ${token.padding}px;
    //     border-radius: ${token.borderRadius}px;
    //     color: ${token.colorTextTertiary};
    //     background: ${token.colorBgContainer};
    //     transition: all 100ms ${token.motionEaseInBack};

    //     margin-bottom: 8px;
    //     cursor: pointer;

    //     &:hover {
    //         color: ${token.colorTextSecondary};
    //         box-shadow: ${token.boxShadowSecondary};
    //     }
    // `,
}));
