---
outline: deep
---

# 路由配置

## `history` 路由模式

部署到服务端后，刷新子路由报 `404` 的问题，解决方法也很简单：改用 `hash `模式或者配置 `Nginx` (`location` 块儿的 `try_files` 属性)。

::: details 点击查看 Nginx 配置

例如，如果前端项目部署在根路径下，配置可能如下所示：

```js{6-8}
server {
    listen 80;
    server_name www.example.com;

    # location块 匹配前端项目的URL路径。
    location / {
        root /path/to/your/frontend/project;  # 替换为你的前端项目实际部署路径
        try_files $uri $uri/ /index.html;  # 尝试匹配请求的文件或目录，如果不存在，则返回index.html
    }
}
```

如果前端项目部署在非根路径下（如/app/），则配置需要稍作调整：

```js{5-7}
server {
    listen 80;
    server_name www.example.com;

    location /app/ {
        alias /path/to/your/frontend/project;  # 使用alias替换location中的路径
        try_files $uri $uri/ /app/index.html;  # 注意这里的/app/index.html，确保与部署路径一致
    }
}
```

:::

## lazy 函数懒加载

```js
import { lazy } from "react";

const Workplace = lazy(() => import("../pages/Workplace"));
```

## Suspense 包裹组件，fallback 函数设置 loading；

```js
import React from "react";
import { Spin } from "antd";

const WithLoadingComponent = (Component: JSX.Element) => {
    return (
        <React.Suspense fallback={<Spin size="large" />}>
            {Component}
        </React.Suspense>
    );
};

export default WithLoadingComponent;
```

## 高阶组件包裹权限组件 实现登录权限控制

```js
import { Navigate } from "react-router-dom";

// 登录权限控制
// 针对于我们的Home页面只有在登录状态下才能访问，如果没有登录则重定向到登录页中

// 这里的isLogin就是用来标识是否登录，实际项目一般是取redux里面的相关值

const isLogin = true;

const AuthComponent = (props: { component: any }) => {
    // 如果登录就放行
    if (isLogin) return props.component;

    // 如果没有登录就重定向到Login登录页
    return <Navigate to="/login" replace />;
};

export default AuthComponent;
```

::: details 完整路由配置

```js
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
```

:::

::: details 路由跳转和传参

1、1 组件式跳转

```js
<Link to="/about">About</Link>

<NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
```

区别：

-   `Link` 组件用于基本的页面导航功能，通过`to`属性指定目标页面的路径。
-   `NavLink` 组件在`Link`组件的基础上增加了`激活状态样式管理`的功能，可以通过`className`和`style`属性接收的函数来动态设置激活状态的样式或类名。

1、2 编程式导航

```js
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

...
navigate("/login", {
    replace: true,
    state: { data: "这是传给新页面的参数" },
});
```

2、路由传参数

2、1 动态路由

```js
navigate("/testContent/:id");

import { useParams } from "react-router-dom";
const params = useParams();
```

2、2 search 传参

```js
navigate("/login?name=zfc&age=18");

import { useSearchParams } from "react-router-dom";
const [searchParams] = useSearchParams();
const params = Object.fromEntries(searchParams);
```

2、3 state 传参

```js
navigate('/login',{state:{name:"张添财",age:18}})
<Link to='/login' state={{name:"张添财",age:18}}>跳转Login页面</Link>

import { useLocation } from "react-router-dom";
const state = useLocation();
```

:::
