import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import App from "./App";
import "./index.css";

// 初始化主题和语言状态
const initThemeAndLanguage = () => {
    // 从localStorage获取保存的系统状态
    const systemStore = localStorage.getItem("systemStore");
    if (systemStore) {
        try {
            const parsed = JSON.parse(systemStore);
            const theme = parsed.state?.theme || "light";
            const lang = parsed.state?.lang || "zh";

            // 设置主题
            document.documentElement.setAttribute("data-theme", theme);

            // 设置语言
            document.documentElement.setAttribute("data-lang", lang);
        } catch (error) {
            console.warn(error);
            document.documentElement.setAttribute("data-theme", "light");
            document.documentElement.setAttribute("data-lang", "zh");
        }
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.setAttribute("data-lang", "zh");
    }
};

// 应用启动时初始化主题和语言
initThemeAndLanguage();

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    // </React.StrictMode>,
);
