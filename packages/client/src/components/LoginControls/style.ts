import { createStyles } from "antd-style";

export default createStyles(({ token }) => ({
    loginControls: {
        position: "absolute",
        top: 24,
        right: 24,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
    },

    controlsContainer: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "50px",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        backdropFilter: "blur(10px)",

        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        },

        // 暗色模式
        "[data-theme='dark'] &": {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",

            "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            },
        },
    },

    controlButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px !important",
        height: "36px !important",
        borderRadius: "50%",
        border: "none",
        backgroundColor: "transparent",
        color: "rgba(0, 0, 0, 0.65)",
        padding: 0,
        transition: "all 0.2s ease",

        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            color: token.colorPrimary,
            transform: "scale(1.05)",
        },

        "[data-theme='dark'] &": {
            color: "rgba(255, 255, 255, 0.85)",

            "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: token.colorPrimary,
            },
        },
    },

    languageIcon: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: 0,
    },

    languageText: {
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1,
        color: "inherit",
    },

    languageSubText: {
        fontSize: 8,
        fontWeight: 500,
        lineHeight: 1,
        color: "inherit",
        opacity: 0.8,
        marginTop: 1,
    },

    menuItem: {
        display: "flex",
        alignItems: "center",
        padding: "4px 0",
        gap: 8,

        "& .anticon": {
            fontSize: 14,
        },
    },
}));
