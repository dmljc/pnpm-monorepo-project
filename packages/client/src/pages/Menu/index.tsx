import React, { useEffect, useState } from "react";
import { Button, message, Space, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { ModalTypeEnum } from "@/utils";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import CreateMenuModal from "./CreateMenu";
import type { UpdateMenu, DataType } from "./interface";
import { list, del } from "./api";

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

const Menu: React.FC = () => {
    // const [checkStrictly, setCheckStrictly] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateMenu>({} as UpdateMenu);
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(false);

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
                            onClick={() =>
                                handleUpdate(record as unknown as UpdateMenu)
                            }
                        >
                            编辑
                        </Button>
                        <Button
                            type="link"
                            className="btn-p0"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record as DataType)}
                        >
                            删除
                        </Button>
                    </Space>
                );
            },
        },
    ];

    useEffect(() => {
        feechList();
    }, []);

    const feechList = async () => {
        try {
            setLoading(true);
            const res = await list({
                current: 1,
                pageSize: 10,
            });
            setDataSource(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setOpen(true);
        setModalType(ModalTypeEnum.CREATE);
    };

    const handleUpdate = (record: UpdateMenu) => {
        setOpen(true);
        setRecord({ ...record });
        setModalType(ModalTypeEnum.UPDATE);
    };

    const handleDelete = async (record: DataType) => {
        const res = await del(record.id);
        if (res.success) {
            messageApi.success("删除成功");
            feechList();
        }
    };

    const handleClose = () => setOpen(false);

    const handleOk = async () => {
        handleClose();
        feechList?.();
    };

    return (
        <>
            {contextHolder}
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
            >
                新增菜单
            </Button>

            <CreateMenuModal
                open={open}
                record={record}
                menuData={dataSource}
                modalType={modalType}
                handleOk={handleOk}
                handleClose={handleClose}
            />

            <Table<DataType>
                rowKey="id"
                loading={loading}
                columns={columns}
                // rowSelection={{ ...rowSelection, checkStrictly }}
                dataSource={dataSource}
                pagination={false}
            />
        </>
    );
};

export default Menu;
