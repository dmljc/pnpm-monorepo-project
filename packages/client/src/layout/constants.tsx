import {
    UserOutlined,
    IdcardOutlined,
    LogoutOutlined,
    GlobalOutlined,
    TranslationOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export const getUserItems = (
    userInfo: any,
    navigate: any,
    onLogout: () => void,
): MenuProps["items"] => [
    {
        key: "1",
        label: (
            <a>
                <UserOutlined />
                &nbsp;
                {userInfo?.name}
            </a>
        ),
    },
    {
        key: "2",
        label: (
            <a onClick={() => navigate("/system/profile")}>
                <IdcardOutlined />
                &nbsp;用户信息
            </a>
        ),
    },
    {
        key: "3",
        label: (
            <a onClick={onLogout}>
                <LogoutOutlined />
                &nbsp;退出登录
            </a>
        ),
    },
];

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
