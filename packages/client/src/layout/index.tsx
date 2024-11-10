import { useState, FC } from "react";
import { Button, Layout as AntdLayout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
    siderStyle,
    menuStyle,
    items,
    getLevelKeys,
    LevelKeysProps,
} from "./utils";
import "./index.css";

const { Header, Sider, Content } = AntdLayout;

const levelKeys = getLevelKeys(items as LevelKeysProps[]);

const Layout: FC = () => {
    const { pathname } = location;
    const navigate = useNavigate();
    const defaultOpenKey = `/${location.pathname.split("/")[1]}`;

    const [collapsed, setCollapsed] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState([pathname]);
    const [stateOpenKeys, setStateOpenKeys] = useState([defaultOpenKey]);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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

    const clickMenuItem = (e) => {
        setSelectedKeys([e.key]);
        navigate(e.key);
    };

    return (
        <AntdLayout>
            <Sider
                theme="light"
                trigger={null}
                width={250}
                style={siderStyle}
                collapsible
                collapsed={collapsed}
            >
                <h1 className="demo-logo-vertical">
                    <a>
                        <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                        <span>{!collapsed && "智能数据管理系统"}</span>
                    </a>
                </h1>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["/"]}
                    openKeys={stateOpenKeys}
                    onOpenChange={onOpenChange}
                    selectedKeys={selectedKeys}
                    style={menuStyle}
                    items={items}
                    onClick={clickMenuItem}
                />
            </Sider>
            <AntdLayout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {/* 二级路由出口 */}
                    <Outlet />
                </Content>
            </AntdLayout>
        </AntdLayout>
    );
};

export default Layout;
