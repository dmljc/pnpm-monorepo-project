import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { AuthComponent, WithLoadingComponent } from "../components";
import Layout from "../layout";

// 路由懒加载
const Login = lazy(() => import("../pages/Login"));
const Home = lazy(() => import("../pages/Home"));
const User = lazy(() => import("../pages/User"));
const Book = lazy(() => import("../pages/Book"));
const NotFound = lazy(() => import("../components/NotFound"));

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Navigate to="/layout/home" replace />, // 重定向
    },
    {
        path: "/layout",
        element: <AuthComponent component={<Layout />} />,
        children: [
            {
                // path: "/layout/home",
                index: true,
                element: WithLoadingComponent(<Home />),
            },
            {
                path: "/layout/user",
                element: WithLoadingComponent(<User />),
            },
            {
                path: "/layout/book",
                element: WithLoadingComponent(<Book />),
            },
            {
                path: "*",
                element: WithLoadingComponent(<NotFound />),
            },
        ],
    },
    {
        path: "/login",
        element: WithLoadingComponent(<Login />),
    },
];

export default routes;
