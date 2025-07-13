import {
    AppstoreOutlined,
    MenuOutlined,
    BorderOutlined,
} from "@ant-design/icons";

export const typeOptions = [
    { label: "目录", value: "catalog", icon: <AppstoreOutlined /> },
    { label: "菜单", value: "menu", icon: <MenuOutlined /> },
    { label: "按钮", value: "button", icon: <BorderOutlined /> },
];

export const typeMap: Record<string, string> = {
    catalog: "目录",
    menu: "菜单",
    button: "按钮",
};

export const typeColorMap: Record<string, string> = {
    catalog: "geekblue",
    menu: "green",
    button: "volcano",
};

export const typeLabelMap: Record<string, string> = {
    catalog: "目录",
    menu: "菜单",
    button: "按钮",
};
