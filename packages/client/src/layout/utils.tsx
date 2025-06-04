import {
    UserOutlined,
    DashboardOutlined,
    DesktopOutlined,
    LineChartOutlined,
    SettingOutlined,
    TeamOutlined,
    MenuOutlined,
    SlidersOutlined,
} from "@ant-design/icons";

export const menuItems = [
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
                key: "/system/server",
                icon: <SlidersOutlined />,
                label: "服务器信息",
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
