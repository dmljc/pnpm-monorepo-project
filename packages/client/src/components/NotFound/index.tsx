import { FC } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

/**
 * 404 页面组件
 * 当用户访问不存在的路由时显示
 */
const NotFound: FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/dashboard/workplace");
    };

    return (
        <>
            <h1>404 页面</h1>
            <Button onClick={handleGoHome}>返回首页</Button>
        </>
    );
};

export default NotFound;
