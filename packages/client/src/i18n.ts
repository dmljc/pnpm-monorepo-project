import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(Backend) // 从服务器加载翻译文件
    .use(LanguageDetector) // 自动检测用户语言
    .use(initReactI18next) // 初始化react-i18next
    .init({
        fallbackLng: "zh", // 默认语言
        ns: ["common"], // 命名空间
        defaultNS: "common",
        interpolation: {
            escapeValue: false, // 不转义HTML
        },
        react: {
            useSuspense: true, // 使用React Suspense
        },
    });

export default i18n;
