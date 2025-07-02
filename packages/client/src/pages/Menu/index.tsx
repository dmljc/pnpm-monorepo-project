import React, { useState } from "react";
import { Button, Space, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CreateMenu from "./CreateMenu";

// type TableRowSelection<T extends object = object> =
//     TableProps<T>["rowSelection"];

interface DataType {
    // key: React.ReactNode;
    key: string;
    name: string;
    type: string;
    url?: string;
    code?: string;
    component?: string;
    children?: DataType[];
}

const typeColorMap: Record<string, string> = {
    catalog: "geekblue",
    menu: "green",
    button: "volcano",
};
const typeLabelMap: Record<string, string> = {
    catalog: "目录",
    menu: "菜单",
    button: "按钮",
};

const columns: TableColumnsType<DataType> = [
    {
        title: "标题",
        dataIndex: "name",
        key: "name",
        width: "20%",
    },
    {
        title: "类型",
        dataIndex: "type",
        key: "type",
        width: "20%",
        render: (type) => {
            return <Tag color={typeColorMap[type]}>{typeLabelMap[type]}</Tag>;
        },
    },
    {
        title: "权限编码",
        dataIndex: "code",
        key: "code",
        width: "15%",
    },
    {
        title: "路由地址",
        dataIndex: "url",
        key: "url",
        width: "20%",
    },
    {
        title: "页面组件",
        dataIndex: "component",
        key: "component",
        width: "15%",
    },
    {
        title: "操作",
        dataIndex: "ctrl",
        key: "ctrl",
        width: "10%",
        render: () => {
            return (
                <Space>
                    <Button
                        type="link"
                        className="btn-p0"
                        icon={<EditOutlined />}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        className="btn-p0"
                        icon={<DeleteOutlined />}
                    >
                        删除
                    </Button>
                </Space>
            );
        },
    },
];

const data: DataType[] = [
    {
        key: "1",
        name: "仪表盘",
        type: "catalog",
        url: "/dashboard",
        component: "Dashboard",
        children: [
            {
                key: "1.1",
                type: "menu",
                url: "/dashboard/workplace",
                component: "Workplace",
                name: "工作台",
            },
            {
                key: "1.2",
                type: "menu",
                url: "/dashboard/analysis",
                component: "Analysis",
                name: "分析页",
            },
        ],
    },
    {
        key: "2",
        name: "系统管理",
        type: "catalog",
        url: "/system",
        component: "System",
        children: [
            {
                key: "2.1",
                type: "menu",
                url: "/system/user",
                component: "User",
                name: "用户管理",
                children: [
                    {
                        key: "2.1.1",
                        type: "button",
                        name: "新增",
                        code: "user:add",
                    },
                    {
                        key: "2.1.2",
                        type: "button",
                        name: "修改",
                        code: "user:update",
                    },
                    {
                        key: "2.1.3",
                        type: "button",
                        name: "删除",
                        code: "user:delete",
                    },
                ],
            },
            {
                key: "2.2",
                type: "menu",
                url: "/system/role",
                component: "Role",
                name: "角色管理",
            },
            {
                key: "2.3",
                type: "menu",
                url: "/system/menu",
                component: "Menu",
                name: "菜单管理",
            },
            {
                key: "2.4",
                type: "menu",
                url: "/system/config",
                component: "Config",
                name: "系统配置",
            },
            {
                key: "2.5",
                type: "menu",
                url: "/system/server",
                component: "Server",
                name: "服务器信息",
            },
        ],
    },
];

// rowSelection objects indicates the need for row selection
// const rowSelection: TableRowSelection<DataType> = {
//     onChange: (selectedRowKeys, selectedRows) => {
//         console.log(
//             `selectedRowKeys: ${selectedRowKeys}`,
//             "selectedRows: ",
//             selectedRows,
//         );
//     },
//     onSelect: (record, selected, selectedRows) => {
//         console.log(record, selected, selectedRows);
//     },
//     onSelectAll: (selected, selectedRows, changeRows) => {
//         console.log(selected, selectedRows, changeRows);
//     },
// };

const Menu: React.FC = () => {
    // const [checkStrictly, setCheckStrictly] = useState(false);
    const [open, setOpen] = useState(false);

    const onClose = () => setOpen(false);

    return (
        <>
            {/* <Space align="center" style={{ marginBottom: 16 }}>
                CheckStrictly:{" "}
                <Switch checked={checkStrictly} onChange={setCheckStrictly} />
            </Space> */}
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
            >
                新增菜单
            </Button>

            <CreateMenu open={open} onClose={onClose} />

            <Table<DataType>
                columns={columns}
                // rowSelection={{ ...rowSelection, checkStrictly }}
                dataSource={data}
                pagination={false}
            />
        </>
    );
};

export default Menu;
