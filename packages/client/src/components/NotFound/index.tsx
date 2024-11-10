import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    const goHome = () => {
        navigate("/dashboard/workplace");
    };
    return (
        <>
            <h1> 404 页面 </h1>
            <Button onClick={goHome}>返回首页</Button>
        </>
    );
};

export default NotFound;
