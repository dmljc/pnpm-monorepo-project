import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import App from "./App";
import "./index.css";

// 初始化主题状态
const initTheme = () => {
    // 从localStorage获取保存的主题状态
    const systemStore = localStorage.getItem("systemStore");
    if (systemStore) {
        try {
            const parsed = JSON.parse(systemStore);
            const theme = parsed.state?.theme || "light";
            document.documentElement.setAttribute("data-theme", theme);
        } catch (error) {
            console.warn(error);
            document.documentElement.setAttribute("data-theme", "light");
        }
    } else {
        document.documentElement.setAttribute("data-theme", "light");
    }
};

// 应用启动时初始化主题
initTheme();

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    // </React.StrictMode>,
);
