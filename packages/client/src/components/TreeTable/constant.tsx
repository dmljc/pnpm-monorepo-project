import {
    AppstoreOutlined,
    MenuOutlined,
    BorderOutlined,
} from "@ant-design/icons";

// 使用函数以便在组件中通过 i18n 计算标签
export const getTypeOptions = (t: (key: string) => string) => [
    {
        label: t("menu:form.type.options.catalog"),
        value: "catalog",
        icon: <AppstoreOutlined />,
    },
    {
        label: t("menu:form.type.options.menu"),
        value: "menu",
        icon: <MenuOutlined />,
    },
    {
        label: t("menu:form.type.options.button"),
        value: "button",
        icon: <BorderOutlined />,
    },
];

export const typeColorMap: Record<string, string> = {
    catalog: "geekblue",
    menu: "",
    button: "#1677ff",
};

export const typeLabelMap: Record<string, string> = {
    catalog: "目录",
    menu: "菜单",
    button: "按钮",
};
