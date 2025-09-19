import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// 初始化 i18n
i18n
    // 加载语言检测插件
    .use(LanguageDetector)
    // 加载后端语言包（从 public/locales 目录读取）
    .use(Backend)
    // 初始化 react-i18next 插件
    .use(initReactI18next)
    // 启动 i18n
    .init({
        fallbackLng: "zh", // 默认语言
        ns: ["common"], // 命名空间
        defaultNS: "common", // 默认命名空间
        interpolation: {
            escapeValue: false, // 不转义HTML， 防止 XSS 攻击（React 已默认转义）
        },
        // 配置 react-i18next 插件
        react: {
            useSuspense: true, // 使用React Suspense
        },
        // 配置后端语言包
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json", // 语言包路径（public/locales 下）
        },
    });

export default i18n;
