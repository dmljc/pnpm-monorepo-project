import { useEffect } from "react";
import { notification } from "antd";
import { useRoutes } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";

import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import { useTranslation } from "react-i18next";
import "./i18n";

import routes from "./routers/index";
import { useUserStore, useSystemStore } from "./store";

const App = () => {
    const Outlet = useRoutes(routes);
    const [api, contextHolder] = notification.useNotification();

    const { userInfo, hasNotification, setHasNotification } = useUserStore();

    const { defaultAlgorithm, darkAlgorithm } = antdTheme;

    const { theme, lang } = useSystemStore();
    const { i18n, t } = useTranslation();

    // 根据当前语言选择Ant Design的语言包
    const getAntdLocale = () => {
        const lang = (i18n.language || "zh").toLowerCase();
        if (lang.startsWith("zh")) return zhCN;
        return enUS;
    };

    useEffect(() => {
        if (userInfo?.name && !hasNotification) {
            api.success({
                title: t("common:notifications.loginSuccess"),
                description: (
                    <span style={{ display: "flex", alignItems: "center" }}>
                        {t("common:notifications.welcomeBack")}: {userInfo.name}
                    </span>
                ),
            });
            setHasNotification(true);
        }
    }, [userInfo?.name, hasNotification, t]);

    // 同步主题状态到HTML的data-theme属性
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // 同步语言状态到HTML的data-lang属性和i18n
    useEffect(() => {
        document.documentElement.setAttribute("data-lang", lang);
        i18n.changeLanguage(lang);
    }, [lang, i18n]);

    return (
        <ConfigProvider
            locale={getAntdLocale()}
            theme={{
                algorithm: theme === "light" ? defaultAlgorithm : darkAlgorithm,
                components: {
                    // 单独处理个别组件
                    Layout: {
                        headerBg: theme === "light" ? "#fff" : "#141414",
                        siderBg: theme === "light" ? "#fff" : "#141414",
                    },
                    Menu: {
                        darkItemBg: "#141414",
                        darkItemSelectedBg: "#1890ff",
                        darkItemHoverBg: "#177ddc",
                    },
                },
            }}
        >
            {Outlet}
            {contextHolder}
        </ConfigProvider>
    );
};

export default App;
