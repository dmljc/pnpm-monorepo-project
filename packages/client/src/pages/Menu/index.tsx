import React, { useEffect, useState } from "react";
import { Button, message, Space, Table, Tag, Form } from "antd";
import type { TableColumnsType } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { UpdateMenu, DataType } from "./interface";
import { typeColorMap, typeLabelMap } from "./constant";
import CreateMenuModal from "./CreateMenu";
import { ModalTypeEnum } from "@/utils";
import { list, del } from "./api";
import IconRenderer from "@/components/IconComponent/IconRenderer";

const Menu: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateMenu>({} as UpdateMenu);
    const [dataSource, setDataSource] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const columns: TableColumnsType<DataType> = [
        {
            title: "标题",
            dataIndex: "label",
            key: "label",
            width: "15%",
        },
        {
            title: "图标",
            dataIndex: "icon",
            key: "icon",
            width: "10%",
            render: (icon) => {
                return icon ? <IconRenderer icon={icon} /> : null;
            },
        },
        {
            title: "类型",
            dataIndex: "type",
            key: "type",
            width: "15%",
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
            dataIndex: "path",
            key: "path",
            width: "15%",
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
            width: "15%",
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
            const res = await list();
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
        form.resetFields();
    };

    const handleUpdate = (record: UpdateMenu) => {
        setOpen(true);
        setRecord({ ...record });
        setModalType(ModalTypeEnum.UPDATE);
        form.setFieldsValue(record);
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
                新增
            </Button>

            <CreateMenuModal
                open={open}
                record={record}
                menuData={dataSource}
                modalType={modalType}
                handleOk={handleOk}
                handleClose={handleClose}
                form={form}
            />

            <Table<DataType>
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                className="mt-16"
            />
        </>
    );
};

export default Menu;
