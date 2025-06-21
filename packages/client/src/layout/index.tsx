import { useState, FC } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
    Menu,
    Card,
    Radio,
    Button,
    Dropdown,
    ConfigProvider,
    theme as antdTheme,
    Layout as AntdLayout,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    IdcardOutlined,
    LogoutOutlined,
    SunOutlined,
    // FullscreenOutlined,
    // FullscreenExitOutlined,
    ExpandOutlined,
    CompressOutlined,
    GithubOutlined,
    MoonOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { menuItems, getLevelKeys, LevelKeysProps } from "./utils";
import useStyles from "./style";
import { useUserStore, useSystemStore } from "@/store";

const { Header, Sider, Content } = AntdLayout;

const levelKeys = getLevelKeys(menuItems as LevelKeysProps[]);

const Layout: FC = () => {
    const { pathname } = location;
    const { logout } = useUserStore();
    const { lang, setLang, theme, setTheme } = useSystemStore();
    const navigate = useNavigate();
    const defaultOpenKey = `/${location.pathname.split("/")[1]}`;

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([pathname]);
    const [stateOpenKeys, setStateOpenKeys] = useState([defaultOpenKey]);

    const { styles: ss } = useStyles();
    const { defaultAlgorithm, darkAlgorithm } = antdTheme;
    // const { token } = theme.useToken();
    // console.log("token===", token);

    const dropdownItems: MenuProps["items"] = [
        {
            key: "1",
            label: (
                <a onClick={() => navigate("/system/profile")}>
                    <IdcardOutlined />
                    &nbsp;用户信息
                </a>
            ),
        },
        {
            key: "2",
            label: (
                <a onClick={() => onLogout()}>
                    <LogoutOutlined />
                    &nbsp;退出登录
                </a>
            ),
        },
    ];

    const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
        const currentOpenKey = openKeys.find(
            (key) => stateOpenKeys.indexOf(key) === -1,
        );
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex(
                    (key) => levelKeys[key] === levelKeys[currentOpenKey],
                );

            const openKeyList = openKeys
                .filter((_, index) => index !== repeatIndex)
                .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]);

            setStateOpenKeys(openKeyList);
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };

    const clickMenuItem = (e: any) => {
        setSelectedKeys([e.key]);
        navigate(e.key);
    };

    const onLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: theme === "light" ? defaultAlgorithm : darkAlgorithm,
                components: {
                    // 单独处理个别组件
                    Layout: {
                        headerBg: theme === "light" ? "#fff" : "#141414",
                    },
                },
            }}
        >
            <AntdLayout>
                <Sider
                    theme="light"
                    width={250}
                    collapsible
                    trigger={null}
                    className={ss.side}
                    collapsed={collapsed}
                >
                    <a className={ss.logoContainer}>
                        <img
                            className={ss.logo}
                            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                        />
                        <span className={ss.text}>
                            {!collapsed && "Nest React19 Admin"}
                        </span>
                    </a>
                    <Menu
                        mode="inline"
                        items={menuItems}
                        className={ss.menu}
                        defaultSelectedKeys={["/"]}
                        openKeys={stateOpenKeys}
                        selectedKeys={selectedKeys}
                        onOpenChange={onOpenChange}
                        onClick={clickMenuItem}
                    />
                </Sider>
                <AntdLayout>
                    <Header className={ss.header}>
                        <span
                            className={ss.headerLeft}
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? (
                                <MenuUnfoldOutlined className={ss.headerIcon} />
                            ) : (
                                <MenuFoldOutlined className={ss.headerIcon} />
                            )}
                        </span>

                        <span className={ss.headerRight}>
                            <span
                                onClick={() => {
                                    setTheme(
                                        theme === "light" ? "dark" : "light",
                                    );
                                }}
                            >
                                {theme === "light" ? (
                                    <MoonOutlined className={ss.headerIcon} />
                                ) : (
                                    <SunOutlined className={ss.headerIcon} />
                                )}
                            </span>

                            {theme === "light" ? (
                                <ExpandOutlined className={ss.headerIcon} />
                            ) : (
                                <CompressOutlined className={ss.headerIcon} />
                            )}
                            <GithubOutlined className={ss.headerIcon} />

                            <Radio.Group
                                value={lang}
                                onChange={(e) => setLang(e.target.value)}
                            >
                                <Radio.Button value="zh">中文</Radio.Button>
                                <Radio.Button value="en">English</Radio.Button>
                            </Radio.Group>

                            <Dropdown menu={{ items: dropdownItems }}>
                                <Button type="text" className={ss.logout}>
                                    <img
                                        className={ss.avatar}
                                        src="https://himg.bdimg.com/sys/portraitn/item/public.1.64e3a983.rQ7LkkDCsOJkvisL0IYKUw"
                                    />
                                    张芳朝
                                </Button>
                            </Dropdown>
                        </span>
                    </Header>
                    <Content className={ss.content}>
                        {/* 二级路由出口 */}
                        <Card>
                            <Outlet />
                        </Card>
                    </Content>
                </AntdLayout>
            </AntdLayout>
        </ConfigProvider>
    );
};

export default Layout;
