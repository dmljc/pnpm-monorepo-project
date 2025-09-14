import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@ant-design/v5-patch-for-react-19";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    // </React.StrictMode>,
);
