import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { AuthComponent, WithLoadingComponent } from "@/components";
import { withI18nLoader } from "@/components/WithI18nLoader";
import Layout from "../layout";

// 路由懒加载

// 仪表盘
const Workplace = lazy(() => import("@/pages/Workplace"));
const Analysis = lazy(() => import("@/pages/Analysis"));

// 系统管理
const User = lazy(() => import("@/pages/User"));
const Role = lazy(() => import("@/pages/Role"));
const Menu = lazy(() => import("@/pages/Menu"));
const Config = lazy(() => import("@/pages/SystemConfig"));
const Profile = lazy(() => import("@/pages/Profile"));
const ServerInfo = lazy(() => import("@/pages/ServerInfo"));

// 全局
const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/components/NotFound"));

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
                element: withI18nLoader(
                    WithLoadingComponent(<Workplace />),
                    "workplace",
                ),
            },
            {
                path: "/dashboard/analysis",
                element: withI18nLoader(
                    WithLoadingComponent(<Analysis />),
                    "analysis",
                ),
            },
        ],
    },
    {
        path: "/system",
        element: <AuthComponent component={<Layout />} />,
        children: [
            {
                path: "/system/user",
                element: withI18nLoader(WithLoadingComponent(<User />), "user"),
            },
            {
                path: "/system/role",
                element: withI18nLoader(WithLoadingComponent(<Role />), [
                    "role",
                    "menu",
                ]),
            },
            {
                path: "/system/menu",
                element: withI18nLoader(WithLoadingComponent(<Menu />), "menu"),
            },
            {
                path: "/system/config",
                element: withI18nLoader(
                    WithLoadingComponent(<Config />),
                    "systemConfig",
                ),
            },
            {
                path: "/system/profile",
                element: withI18nLoader(
                    WithLoadingComponent(<Profile />),
                    "profile",
                ),
            },
            {
                path: "/system/server",
                element: WithLoadingComponent(<ServerInfo />),
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
