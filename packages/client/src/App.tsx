import { notification } from "antd";
import { useRoutes } from "react-router-dom";
import routes from "./routers/index";
import { useUserStore } from "./store";
import { useEffect } from "react";

const App = () => {
    const Outlet = useRoutes(routes);
    const [api, contextHolder] = notification.useNotification();

    const { userInfo, hasNotification, setHasNotification } = useUserStore();

    useEffect(() => {
        if (userInfo?.name && !hasNotification) {
            api.success({
                message: "登录成功",
                description: (
                    <span style={{ display: "flex", alignItems: "center" }}>
                        欢迎回来: {userInfo.name}
                    </span>
                ),
            });
            setHasNotification(true);
        }
    }, [userInfo?.name, hasNotification]);

    return (
        <>
            {contextHolder}
            <div className="App">{Outlet}</div>
        </>
    );
};

export default App;
