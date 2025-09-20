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
        gap: 4,
        padding: "6px 8px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "8px",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        backdropFilter: "blur(12px)",

        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
        },

        // 暗色模式
        "[data-theme='dark'] &": {
            backgroundColor: "rgba(30, 30, 30, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",

            "&:hover": {
                backgroundColor: "rgba(40, 40, 40, 0.9)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            },
        },
    },

    controlButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px !important",
        height: "40px !important",
        borderRadius: "6px",
        border: "none",
        backgroundColor: "transparent",
        color: "rgba(0, 0, 0, 0.6)",
        padding: 0,

        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            color: token.colorPrimary,
            width: "40px !important",
            height: "40px !important",
        },
    },

    languageIcon: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: 1,
    },

    languageText: {
        fontSize: 14,
        fontWeight: 700,
        lineHeight: 1,
        color: "inherit",
    },

    languageSubText: {
        fontSize: 9,
        fontWeight: 500,
        lineHeight: 1,
        color: "inherit",
        opacity: 0.7,
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
