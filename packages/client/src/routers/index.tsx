import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { AuthComponent, WithLoadingComponent } from "../components";
import Layout from "../layout";

// 路由懒加载

// 仪表盘
const Workplace = lazy(() => import("../pages/Workplace"));
const Analysis = lazy(() => import("../pages/Analysis"));

// 系统管理
const User = lazy(() => import("../pages/User"));
const Role = lazy(() => import("../pages/Role"));
const Menu = lazy(() => import("../pages/Menu"));
const Config = lazy(() => import("../pages/Config"));
const Person = lazy(() => import("../pages/Person"));

// 业务
const Book = lazy(() => import("../pages/Book"));

// 全局
const Login = lazy(() => import("../pages/Login"));
const NotFound = lazy(() => import("../components/NotFound"));

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Navigate to="/dashboard/workplace" replace />, // 重定向
    },
    {
        path: "/dashboard",
        element: <AuthComponent component={<Layout />} />,
        children: [
            {
                path: "/dashboard/workplace",
                element: WithLoadingComponent(<Workplace />),
            },
            {
                path: "/dashboard/analysis",
                element: WithLoadingComponent(<Analysis />),
            },
        ],
    },
    {
        path: "/system",
        element: <AuthComponent component={<Layout />} />,
        children: [
            {
                path: "/system/user",
                element: WithLoadingComponent(<User />),
            },
            {
                path: "/system/role",
                element: WithLoadingComponent(<Role />),
            },
            {
                path: "/system/menu",
                element: WithLoadingComponent(<Menu />),
            },
            {
                path: "/system/config",
                element: WithLoadingComponent(<Config />),
            },
            {
                path: "/system/person",
                element: WithLoadingComponent(<Person />),
            },
        ],
    },
    {
        path: "/yewu",
        element: <AuthComponent component={<Layout />} />,
        children: [
            {
                path: "/yewu/book",
                element: WithLoadingComponent(<Book />),
            },
        ],
    },
    {
        path: "*",
        element: WithLoadingComponent(<NotFound />),
    },
    {
        path: "/login",
        element: WithLoadingComponent(<Login />),
    },
];

export default routes;
