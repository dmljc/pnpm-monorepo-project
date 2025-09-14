import { useEffect } from "react";
import { notification } from "antd";
import { useRoutes } from "react-router-dom";
import routes from "./routers/index";
import { useUserStore, useSystemStore } from "./store";

const App = () => {
    const Outlet = useRoutes(routes);
    const [api, contextHolder] = notification.useNotification();

    const { userInfo, hasNotification, setHasNotification } = useUserStore();
    const { theme } = useSystemStore();

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
            <div className="App" data-theme={theme}>
                {Outlet}
            </div>
            {contextHolder}
        </>
    );
};

export default App;
