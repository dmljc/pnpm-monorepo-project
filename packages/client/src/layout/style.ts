import { createStyles } from "antd-style";

export default createStyles(({ token, css }) => ({
    // 侧边栏
    side: {
        height: "100vh",
        background: "#fff",
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
        color: "rgba(0, 0, 0, 0.88)",
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
        background: token.colorBgContainer,
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
    headerIcon: css`
        width: 40px;
        height: 40px;
        line-height: 64px;
        font-size: 16px;
        justify-content: center;

        &:hover {
            background: ${token.colorBgTextHover};
            cursor: pointer;
            border-radius: 100%;
        }
    `,
    logout: {
        padding: 4,
    },
    avatar: {
        width: 30,
        height: 30,
        lineHeight: "30px",
        fontSize: "18px",
        background: token.colorBgContainer,
        borderRadius: "100%",
        border: `1px solid ${token.colorPrimaryText}`,
        padding: 2,
    },
    content: {
        padding: 24,
        minHeight: 280,
        margin: "24px 16px",
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
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
