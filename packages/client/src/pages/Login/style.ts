import { createStyles } from "antd-style";

export default createStyles(({ token }) => ({
    root: {
        backgroundColor: "white",
        height: "100vh",
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
        fontSize: 12,
        color: "rgba(0, 0, 0, 0.45)",
        padding: "10px 0",
    },
}));
