import { FC } from "react";
import { Dropdown, Button, Tooltip } from "antd";
import type { MenuProps } from "antd";
import {
    SunOutlined,
    MoonOutlined,
    TranslationOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

// Store
import { useSystemStore } from "@/store";

// 样式
import useStyles from "./style";

interface LoginControlsProps {
    className?: string;
}

const LoginControls: FC<LoginControlsProps> = ({ className }) => {
    const { i18n, t } = useTranslation();
    const { theme, setTheme, lang, setLang } = useSystemStore();
    const { styles } = useStyles();

    // 主题切换
    const handleThemeToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        // 更新 HTML 的 data-theme 属性
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    // 语言切换菜单项
    const languageItems: MenuProps["items"] = [
        {
            key: "zh",
            label: (
                <div className={styles["menu-item"]}>
                    <GlobalOutlined />
                    {t("common:controls.language.simplifiedChinese")}
                </div>
            ),
        },
        {
            key: "en",
            label: (
                <div className={styles["menu-item"]}>
                    <TranslationOutlined />
                    {t("common:controls.language.english")}
                </div>
            ),
        },
    ];

    // 语言切换处理
    const handleLanguageChange = ({ key }: { key: string }) => {
        setLang(key);
        i18n.changeLanguage(key);
    };

    return (
        <div className={`${styles["login-controls"]} ${className || ""}`}>
            <div className={styles["controls-container"]}>
                {/* 语言切换下拉菜单 */}
                <Tooltip
                    title={t("common:controls.language.title")}
                    placement="bottom"
                >
                    <Dropdown
                        menu={{
                            items: languageItems,
                            onClick: handleLanguageChange,
                            selectedKeys: [lang],
                        }}
                        placement="bottomRight"
                        trigger={["click"]}
                    >
                        <Button
                            type="text"
                            className={styles["control-button"]}
                            title={t("common:controls.language.switch")}
                        >
                            <div className={styles["language-icon"]}>
                                <span className={styles["language-text"]}>
                                    A
                                </span>
                                <span className={styles["language-sub-text"]}>
                                    {lang === "zh" ? "文" : "EN"}
                                </span>
                            </div>
                        </Button>
                    </Dropdown>
                </Tooltip>

                {/* 主题切换按钮 */}
                <Tooltip
                    title={
                        theme === "light"
                            ? t("common:controls.theme.switchToDark")
                            : t("common:controls.theme.switchToLight")
                    }
                    placement="bottom"
                >
                    <Button
                        type="text"
                        icon={
                            theme === "light" ? (
                                <MoonOutlined />
                            ) : (
                                <SunOutlined />
                            )
                        }
                        onClick={handleThemeToggle}
                        className={styles["control-button"]}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

export default LoginControls;
