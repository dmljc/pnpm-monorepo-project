import { Navigate } from "react-router-dom";

/**
 * 登录权限控制
 * 针对于我们的Home页面只有在登录状态下才能访问，如果没有登录则重定向到登录页中
 * 这里的isLogin就是用来标识是否登录，实际项目一般是取redux里面的相关值
 */

const isLogin = true;

const AuthComponent = (props: { component: any }) => {
    // 如果登录就放行
    if (isLogin) return props.component;

    // 如果没有登录就重定向到Login登录页
    return <Navigate to="/login" replace />;
};

export default AuthComponent;
