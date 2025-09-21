import { createStyles } from "antd-style";

export default createStyles(({ token }) => ({
    root: {
        height: "100vh",
        // 使用渐变背景，支持主题切换
        background: `
            linear-gradient(135deg, 
                ${token.colorPrimary} 0%, 
                ${token.colorBgContainer} 50%, 
                ${token.colorPrimaryBg} 100%
            )
        `,
        // 暗色模式下的特殊背景
        "[data-theme='dark'] &": {
            background: `
                linear-gradient(135deg, 
                    #1f1f1f 0%, 
                    #141414 50%, 
                    #0f0f0f 100%
                )
            `,
        },
    },

    actions: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },

    others: {
        color: token.colorTextPlaceholder,
        fontWeight: "normal",
        fontSize: 14,
    },

    alipay: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: 40,
        width: 40,
        border: "1px solid " + token.colorPrimaryBorder,
        borderRadius: "50%",
    },

    taobao: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: 40,
        width: 40,
        border: "1px solid " + token.colorPrimaryBorder,
        borderRadius: "50%",
    },

    weibo: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: 40,
        width: 40,
        border: "1px solid " + token.colorPrimaryBorder,
        borderRadius: "50%",
    },

    username: {
        color: token.colorText,
    },

    password: { color: token.colorText },

    email: { color: token.colorText },

    captcha: {
        color: token.colorText,
    },

    checkbox: { marginBlockEnd: 24 },

    forget: { float: "right" },

    copyright: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: "center",
        color: token.colorTextSecondary,
        fontSize: 12,
        padding: "10px 0",
    },
}));
