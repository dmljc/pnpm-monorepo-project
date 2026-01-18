/**
 * 图标名称映射表
 * 将旧的 Iconify 图标名称映射为 Ant Design Icons 名称
 */

// 图标映射表
export const ICON_MAPPER: Record<string, string> = {
    // Dashboard 相关
    "clarity:dashboard": "DashboardOutlined",
    "clarity:dashboard-line": "DashboardOutlined",

    // System 相关
    "hugeicons:system": "SettingOutlined",
    "hugeicons:system-update-01": "SettingOutlined",

    // User 相关
    "majesticons:user": "UserOutlined",
    "majesticons:user-line": "UserOutlined",
    "tabler:users-plus": "UserAddOutlined",
    "tabler:user": "UserOutlined",
    "uil:user": "UserOutlined",

    // Menu 相关
    "mingcute:menu": "MenuOutlined",
    "mingcute:menu-line": "MenuOutlined",

    // Config 相关
    "mynaui:config": "SettingOutlined",
    "mynaui:config-solid": "SettingFilled",

    // Server 相关
    "solar:server": "CloudServerOutlined",
    "solar:server-broken": "CloudServerOutlined",

    // Admin 相关
    "ri:admin": "UserOutlined",
    "ri:admin-line": "UserOutlined",
    "ri:save-line": "SaveOutlined",

    // Analytics 相关
    "uil:analytics": "BarChartOutlined",

    // Emoji 相关
    "twemoji:man-superhero": "UserOutlined",
    "twemoji:man-superhero-light-skin-tone": "UserOutlined",

    // Export/Import 相关
    "uil:export": "ExportOutlined",
    "fe:import": "ImportOutlined",

    // Edit 相关
    "carbon:edit": "EditOutlined",
    "carbon:add": "PlusOutlined",

    // Icons 相关
    "icons8:checked": "CheckCircleOutlined",

    // Material Symbols 相关
    "material-symbols:home": "HomeOutlined",
    "material-symbols:home-outline": "HomeOutlined",
    "material-symbols:delete-outline": "DeleteOutlined",
    "material-symbols:add": "PlusOutlined",

    // 常用图标（简写形式）
    home: "HomeOutlined",
    dashboard: "DashboardOutlined",
    settings: "SettingOutlined",
    setting: "SettingOutlined",
    user: "UserOutlined",
    team: "TeamOutlined",
    menu: "MenuOutlined",
    search: "SearchOutlined",
    edit: "EditOutlined",
    delete: "DeleteOutlined",
    add: "PlusOutlined",
    plus: "PlusOutlined",
    minus: "MinusOutlined",
    close: "CloseOutlined",
    check: "CheckOutlined",
    save: "SaveOutlined",
    export: "ExportOutlined",
    import: "ImportOutlined",
    "arrow-up": "ArrowUpOutlined",
    "arrow-down": "ArrowDownOutlined",
    "arrow-left": "ArrowLeftOutlined",
    "arrow-right": "ArrowRightOutlined",
};

/**
 * 映射图标名称
 * @param iconName 旧的图标名称
 * @returns 新的 Ant Design Icons 名称
 */
export const mapIconName = (iconName: string | undefined): string => {
    if (!iconName) return "HomeOutlined";

    // 如果已经是 Ant Design Icons 格式，直接返回
    if (iconName.endsWith("Outlined") || iconName.endsWith("Filled")) {
        return iconName;
    }

    // 查找映射
    const mapped = ICON_MAPPER[iconName];
    if (mapped) {
        return mapped;
    }

    // 如果找不到映射，返回默认图标
    console.warn(`图标 "${iconName}" 未找到映射，使用默认图标`);
    return "HomeOutlined";
};

/**
 * 批量映射图标名称
 * @param icons 图标名称数组
 * @returns 映射后的图标名称数组
 */
export const mapIconNames = (icons: string[]): string[] => {
    return icons.map(mapIconName);
};
