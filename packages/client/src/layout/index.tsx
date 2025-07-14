import { useState, FC, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
    Menu,
    Card,
    Dropdown,
    ConfigProvider,
    theme as antdTheme,
    Layout as AntdLayout,
} from "antd";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SunOutlined,
    ExpandOutlined,
    CompressOutlined,
    GithubOutlined,
    MoonOutlined,
    TranslationOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { getLevelKeys } from "./utils";
import useStyles from "./style";
import { useUserStore, useSystemStore, useMenuStore } from "@/store";
import { getUserItems, getLangItems } from "./constants";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";

const { Header, Sider, Content } = AntdLayout;

const Layout: FC = () => {
    const { logout, userInfo } = useUserStore();
    const { lang, setLang, theme, setTheme } = useSystemStore();
    const navigate = useNavigate();
    const defaultOpenKey = `/${location.pathname.split("/")[1]}`;
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([location.pathname]);
    const [stateOpenKeys, setStateOpenKeys] = useState([defaultOpenKey]);
    const { styles: ss } = useStyles();
    const { defaultAlgorithm, darkAlgorithm } = antdTheme;

    // 响应式获取菜单
    const menuList = useMenuStore((state) => state.menuList);
    const levelKeys = getLevelKeys(menuList);

    // 使用 useMemo 仅在 menuList 变化时构建 key -> item 的映射表，提升查找性能
    const keyItemMap = useMemo(() => {
        const map = new Map();
        // 递归遍历菜单树，将每个菜单项的 key 与其对象建立映射关系
        function traverse(items: any[]) {
            for (const item of items) {
                map.set(item.key, item); // 用 key 作为 key
                if (item.children) traverse(item.children);
            }
        }
        traverse(menuList);
        return map;
    }, [menuList]);

    // 菜单点击事件
    const clickMenuItem: MenuProps["onClick"] = (e) => {
        const item = keyItemMap.get(e.key);
        if (item && item.type === "menu" && item.path) {
            setSelectedKeys([item.key]);
            navigate(item.path);
        }
    };

    // 退出登录事件
    const onLogout = () => {
        logout();
        navigate("/login");
    };

    const userItems = getUserItems(userInfo, navigate, onLogout);
    const langItems = getLangItems();

    // 菜单展开事件
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

    // 语言切换事件
    const onClickLang: MenuProps["onClick"] = ({ key }) => {
        setLang(key);
    };

    return (
        <ConfigProvider
            locale={lang === "zh" ? zhCN : enUS}
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
                        items={menuList as MenuProps["items"]}
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
                                className={ss.headerIconTheme}
                                onClick={() =>
                                    setTheme(
                                        theme === "light" ? "dark" : "light",
                                    )
                                }
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
                            <Dropdown
                                trigger={["click"]}
                                placement="bottomRight"
                                menu={{
                                    items: langItems,
                                    selectable: true,
                                    selectedKeys: [lang],
                                    onClick: onClickLang,
                                }}
                            >
                                <TranslationOutlined
                                    onClick={(e) => e.preventDefault()}
                                    className={ss.headerIcon}
                                />
                            </Dropdown>
                            <Dropdown
                                trigger={["click"]}
                                menu={{
                                    items: userItems,
                                    selectable: true,
                                    selectedKeys: ["1"],
                                }}
                            >
                                <div className={ss.avatarWrapper}>
                                    <img
                                        className={`${ss.headerIcon} ${ss.avatar}`}
                                        src="https://himg.bdimg.com/sys/portraitn/item/public.1.64e3a983.rQ7LkkDCsOJkvisL0IYKUw"
                                    />
                                </div>
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
