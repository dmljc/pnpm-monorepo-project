import { createStyles } from "antd-style";

export default createStyles(({ token }) => ({
    root: {
        backgroundColor: "white",
        height: "calc(100vh - 182px)",
        display: "flex",
    },

    left: {
        width: 220,
        height: "100%",
        marginRight: 16,

        // border: "1px solid " + token.colorBorder,
    },

    right: {
        flex: 1,
        height: "100%",
        borderLeft: "1px solid " + token.colorBorder,
        // backgroundColor: "blue",
    },
}));
