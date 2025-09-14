import {
    UserOutlined,
    IdcardOutlined,
    LogoutOutlined,
    GlobalOutlined,
    TranslationOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

// ==================== 用户菜单配置 ====================
/**
 * 获取用户下拉菜单项配置
 * @param userInfo - 用户信息对象
 * @param navigate - 路由导航函数
 * @param onLogout - 退出登录回调函数
 * @returns 用户菜单项数组
 */
export const getUserItems = (
    userInfo: any,
    navigate: any,
    onLogout: () => void,
): MenuProps["items"] => [
    {
        key: "user-info",
        label: (
            <a>
                <UserOutlined />
                &nbsp;
                {userInfo?.name}
            </a>
        ),
    },
    {
        key: "profile",
        label: (
            <a onClick={() => navigate("/system/profile")}>
                <IdcardOutlined />
                &nbsp;用户信息
            </a>
        ),
    },
    {
        key: "logout",
        label: (
            <a onClick={onLogout}>
                <LogoutOutlined />
                &nbsp;退出登录
            </a>
        ),
    },
];

// ==================== 语言切换菜单配置 ====================
/**
 * 获取语言切换下拉菜单项配置
 * @returns 语言菜单项数组
 */
export const getLangItems = (): MenuProps["items"] => [
    {
        key: "zh",
        label: (
            <a>
                <GlobalOutlined style={{ marginRight: 6 }} />
                简体中文
            </a>
        ),
    },
    {
        key: "en",
        label: (
            <a>
                <TranslationOutlined style={{ marginRight: 6 }} />
                English
            </a>
        ),
    },
];
