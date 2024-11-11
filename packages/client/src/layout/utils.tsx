import { CSSProperties } from "react";
import {
    UserOutlined,
    DashboardOutlined,
    DesktopOutlined,
    LineChartOutlined,
    SettingOutlined,
    TeamOutlined,
    MenuOutlined,
    IdcardOutlined,
    SlidersOutlined,
} from "@ant-design/icons";

export const siderStyle: CSSProperties = {
    height: "100vh",
    background: "#fff",
};

export const headerLeftStyle: CSSProperties = {
    fontSize: "16px",
    width: 64,
    height: 64,
    lineHeight: 64,
    display: "inline-flex",
    justifyContent: "center",
};
export const headerRightStyle: CSSProperties = {
    fontSize: "16px",
    width: 40,
    height: 64,
    lineHeight: 64,
    display: "inline-flex",
    justifyContent: "center",
};

export const menuStyle: CSSProperties = {
    borderInlineEnd: "none",
};

export const items = [
    {
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "仪表盘",
        children: [
            {
                key: "/dashboard/workplace",
                icon: <DesktopOutlined />,
                label: "工作台",
            },
            {
                key: "/dashboard/analysis",
                icon: <LineChartOutlined />,
                label: "分析页",
            },
        ],
    },
    {
        key: "/system",
        icon: <SettingOutlined />,
        label: "系统管理",
        children: [
            {
                key: "/system/user",
                icon: <UserOutlined />,
                label: "用户管理",
            },
            {
                key: "/system/role",
                icon: <TeamOutlined />,
                label: "角色管理",
            },
            {
                key: "/system/menu",
                icon: <MenuOutlined />,
                label: "菜单管理",
            },
            {
                key: "/system/config",
                icon: <SlidersOutlined />,
                label: "系统配置",
            },
            {
                key: "/system/person",
                icon: <IdcardOutlined />,
                label: "个人中心",
            },
        ],
    },
    // {
    //     key: "book",
    //     icon: <UserOutlined />,
    //     label: "图书管理",
    // },
    // {
    //     key: "login",
    //     icon: <UserOutlined />,
    //     label: "登录",
    // },
];

export interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

export const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};
