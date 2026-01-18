/**
 * 图标映射表
 * 使用 Ant Design Icons，零网络请求
 */
import * as AntdIcons from "@ant-design/icons";

// 图标分类
export const ICON_CATEGORIES = {
    common: "常用图标",
    direction: "方向图标",
    suggestion: "提示建议",
    edit: "编辑操作",
    data: "数据展示",
    other: "其他图标",
} as const;

// 预定义的图标列表（管理系统常用图标）
export const ICON_LIST = {
    // 常用图标
    common: [
        "HomeOutlined",
        "DashboardOutlined",
        "SettingOutlined",
        "UserOutlined",
        "TeamOutlined",
        "ShopOutlined",
        "AppstoreOutlined",
        "SearchOutlined",
        "MenuOutlined",
        "ProfileOutlined",
        "SolutionOutlined",
        "ProjectOutlined",
        "FundOutlined",
        "BarChartOutlined",
        "LineChartOutlined",
        "PieChartOutlined",
    ],
    // 方向图标
    direction: [
        "ArrowUpOutlined",
        "ArrowDownOutlined",
        "ArrowLeftOutlined",
        "ArrowRightOutlined",
        "UpOutlined",
        "DownOutlined",
        "LeftOutlined",
        "RightOutlined",
        "CaretUpOutlined",
        "CaretDownOutlined",
        "CaretLeftOutlined",
        "CaretRightOutlined",
    ],
    // 提示建议
    suggestion: [
        "CheckCircleOutlined",
        "CloseCircleOutlined",
        "ExclamationCircleOutlined",
        "InfoCircleOutlined",
        "WarningOutlined",
        "QuestionCircleOutlined",
        "BellOutlined",
        "NotificationOutlined",
        "MessageOutlined",
        "CommentOutlined",
    ],
    // 编辑操作
    edit: [
        "EditOutlined",
        "DeleteOutlined",
        "PlusOutlined",
        "MinusOutlined",
        "CopyOutlined",
        "SaveOutlined",
        "FileOutlined",
        "FileAddOutlined",
        "FolderOutlined",
        "FolderAddOutlined",
        "FolderOpenOutlined",
        "UploadOutlined",
        "DownloadOutlined",
        "ExportOutlined",
        "ImportOutlined",
    ],
    // 数据展示
    data: [
        "TableOutlined",
        "OrderedListOutlined",
        "UnorderedListOutlined",
        "CalendarOutlined",
        "ClockCircleOutlined",
        "TagOutlined",
        "TagsOutlined",
        "BookOutlined",
        "ContactsOutlined",
        "IdcardOutlined",
    ],
    // 其他图标
    other: [
        "LockOutlined",
        "UnlockOutlined",
        "EyeOutlined",
        "EyeInvisibleOutlined",
        "HeartOutlined",
        "StarOutlined",
        "LikeOutlined",
        "ShareAltOutlined",
        "LinkOutlined",
        "SyncOutlined",
        "ReloadOutlined",
        "PoweroffOutlined",
        "LogoutOutlined",
        "LoginOutlined",
        "ToolOutlined",
        "ApiOutlined",
        "CloudOutlined",
        "DatabaseOutlined",
        "SafetyOutlined",
        "SecurityScanOutlined",
    ],
};

// 获取所有图标列表（扁平化）
export const ALL_ICONS = Object.values(ICON_LIST).flat();

// 图标组件映射
export const ICON_COMPONENTS: Record<string, any> = {};
ALL_ICONS.forEach((iconName) => {
    ICON_COMPONENTS[iconName] = (AntdIcons as any)[iconName];
});

// 根据名称获取图标组件
export const getIconComponent = (iconName: string) => {
    return ICON_COMPONENTS[iconName] || null;
};

// 搜索图标
export const searchIcons = (query: string): string[] => {
    if (!query) return ALL_ICONS;

    const lowerQuery = query.toLowerCase();
    return ALL_ICONS.filter((iconName) =>
        iconName.toLowerCase().includes(lowerQuery),
    );
};
