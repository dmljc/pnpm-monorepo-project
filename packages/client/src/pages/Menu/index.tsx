import React, { useState } from "react";
import { Button, Space, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { ModalTypeEnum } from "@/utils";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CreateMenuModal from "./CreateMenu";
import { UpdateMenu } from "./interface";

interface DataType {
    key: string;
    name: string;
    type: string;
    icon?: string;
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

const data: DataType[] = [
    {
        key: "1",
        name: "仪表盘",
        type: "catalog",
        url: "/dashboard",
        // component: "Dashboard",
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
        // component: "System",
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
    const [open, setOpen] = useState(true);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateMenu>({} as UpdateMenu);

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
                return (
                    <Tag color={typeColorMap[type]}>{typeLabelMap[type]}</Tag>
                );
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
            render: (_, record) => {
                return (
                    <Space>
                        <Button
                            type="link"
                            className="btn-p0"
                            icon={<EditOutlined />}
                            onClick={() => onUpdate(record)}
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

    const onAdd = () => {
        setModalType(ModalTypeEnum.CREATE);
        setOpen(true);
    };

    const onUpdate = (record: any) => {
        setModalType(ModalTypeEnum.UPDATE);
        setRecord({ ...record });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleOk = () => {
        setOpen(true);
    };

    return (
        <>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                新增菜单
            </Button>

            <CreateMenuModal
                open={open}
                record={record}
                menuData={data}
                modalType={modalType}
                handleOk={handleOk}
                handleClose={handleClose}
            />

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
