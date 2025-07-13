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

export const menuItems: LevelKeysProps[] = [
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

/**
 * type到icon的映射表
 */
// const typeIconMap: Record<string, React.ReactNode> = {
//     catalog: <SettingOutlined />,
//     menu: <MenuOutlined />,
//     button: undefined, // 按钮类型菜单一般不显示在侧边栏
// };

/**
 * 将menuList（Item[]）递归转换为menuItems（LevelKeysProps[]）
 * 只保留类型为catalog（目录）和menu（菜单）的数据
 * @param menuList 菜单列表
 * @returns menuItems格式数组
 */
export function convertMenuListToMenuItems(menuList: any[]): LevelKeysProps[] {
    return menuList
        .filter((item) => item.type === "catalog" || item.type === "menu")
        .map((item, idx) => {
            const children = item.children
                ? convertMenuListToMenuItems(item.children)
                : [];
            // 保证 key 唯一：优先 url，其次 id，否则用 type+name+idx
            const key =
                item.url ||
                (item.id !== undefined
                    ? String(item.id)
                    : `${item.type}-${item.name}-${idx}`);
            return {
                key,
                // icon: typeIconMap[item.type] || undefined,
                label: item.name,
                type: item.type,
                ...(children.length >= 1 ? { children } : {}),
                // 不要 parentId、id、component、code 等无关字段
            };
        });
}

export interface LevelKeysProps {
    key?: string;
    icon?: React.ReactNode;
    label?: string;
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
