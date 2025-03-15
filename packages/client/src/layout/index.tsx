import { useState, FC } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
    Layout as AntdLayout,
    Menu,
    Dropdown,
    Button,
    ConfigProvider,
    theme,
    Card,
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

const { Header, Sider, Content } = AntdLayout;

const levelKeys = getLevelKeys(menuItems as LevelKeysProps[]);

const Layout: FC = () => {
    const { pathname } = location;
    const navigate = useNavigate();
    const defaultOpenKey = `/${location.pathname.split("/")[1]}`;

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([pathname]);
    const [stateOpenKeys, setStateOpenKeys] = useState([defaultOpenKey]);
    const [isDarkModel, setIsDarkModel] = useState(false);

    const { styles: ss } = useStyles();
    const { defaultAlgorithm, darkAlgorithm } = theme;
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
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("pro-table-singe-demos");
        navigate("/login");
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkModel ? darkAlgorithm : defaultAlgorithm,
                components: {
                    // 单独处理个别组件
                    Layout: {
                        headerBg: isDarkModel ? "#141414" : "#fff",
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
                            <span onClick={() => setIsDarkModel(!isDarkModel)}>
                                {isDarkModel ? (
                                    <SunOutlined className={ss.headerIcon} />
                                ) : (
                                    <MoonOutlined className={ss.headerIcon} />
                                )}
                            </span>

                            {isDarkModel ? (
                                <CompressOutlined className={ss.headerIcon} />
                            ) : (
                                <ExpandOutlined className={ss.headerIcon} />
                            )}
                            <GithubOutlined className={ss.headerIcon} />

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
