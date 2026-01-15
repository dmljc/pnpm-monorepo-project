import { createStyles } from "antd-style";

export default createStyles(({ token }) => ({
    root: {
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        // 使用渐变背景，支持主题切换
        background: `
            linear-gradient(135deg, 
                ${token.colorPrimary} 0%, 
                ${token.colorBgContainer} 50%, 
                ${token.colorPrimaryBg} 100%
            )
        `,
        // 暗色模式下的特殊背景 - 增强层次感
        "[data-theme='dark'] &": {
            background: `
                radial-gradient(ellipse at top, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%),
                linear-gradient(135deg, #1f1f1f 0%, #141414 50%, #0d0d0d 100%)
            `,
            "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                    radial-gradient(circle at 20% 80%, rgba(24, 144, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(24, 144, 255, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(24, 144, 255, 0.03) 0%, transparent 50%)
                `,
                pointerEvents: "none",
                zIndex: 1,
            },
            "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                    linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%),
                    linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.01) 50%, transparent 70%)
                `,
                pointerEvents: "none",
                zIndex: 1,
            },
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
        zIndex: 5,
        // 暗色模式下的版权信息样式
        "[data-theme='dark'] &": {
            color: "rgba(255, 255, 255, 0.6)",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            background: "linear-gradient(transparent, rgba(0, 0, 0, 0.2))",
            backdropFilter: "blur(4px)",
        },
    },
}));
