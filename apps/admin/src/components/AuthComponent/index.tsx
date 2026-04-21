import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "@/store";

type AuthComponentProps = {
    component: ReactElement;
};

/**
 * 登录权限控制：仅在有有效 accessToken 时渲染受保护布局，否则跳转登录页。
 */
const AuthComponent = ({ component }: AuthComponentProps) => {
    const accessToken = useUserStore((s) => s.accessToken);

    if (accessToken) {
        return component;
    }

    return <Navigate to="/login" replace />;
};

export default AuthComponent;
