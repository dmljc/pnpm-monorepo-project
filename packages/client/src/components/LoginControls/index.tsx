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
    const { i18n } = useTranslation();
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
                <div className={styles.menuItem}>
                    <GlobalOutlined />
                    简体中文
                </div>
            ),
        },
        {
            key: "en",
            label: (
                <div className={styles.menuItem}>
                    <TranslationOutlined />
                    English
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
        <div className={`${styles.loginControls} ${className || ""}`}>
            <div className={styles.controlsContainer}>
                {/* 语言切换下拉菜单 */}
                <Tooltip title="语言设置" placement="bottom">
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
                            className={styles.controlButton}
                            title="切换语言"
                        >
                            <div className={styles.languageIcon}>
                                <span className={styles.languageText}>A</span>
                                <span className={styles.languageSubText}>
                                    {lang === "zh" ? "文" : "EN"}
                                </span>
                            </div>
                        </Button>
                    </Dropdown>
                </Tooltip>

                {/* 主题切换按钮 */}
                <Tooltip
                    title={
                        theme === "light" ? "切换到暗色模式" : "切换到亮色模式"
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
                        className={styles.controlButton}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

export default LoginControls;
