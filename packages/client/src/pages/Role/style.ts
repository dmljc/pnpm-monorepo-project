import { createStyles } from "antd-style";

export default createStyles(({ token }) => ({
    root: {
        backgroundColor: "white",
        height: "calc(100vh - 174px)",
        display: "flex",
    },

    left: {
        width: 220,
        height: "100%",
        marginRight: 16,
    },

    right: {
        flex: 1,
        height: "100%",
        overflow: "scroll",
        paddingLeft: 16,
        borderLeft: "1px solid " + token.colorBorder,
    },
}));
