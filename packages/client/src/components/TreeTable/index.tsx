import { useState } from "react";
import { Button, message, Space, Table, Tag, Form } from "antd";
import type { TableColumnsType } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import IconRenderer from "../IconComponent/IconRenderer";
import { typeColorMap, typeLabelMap } from "./constant";
import type { DataType, UpdateMenu } from "@/pages/Menu/interface";
import { useMenuStore } from "@/store";
import type {
    TreeTableProps,
    TreeTableColumn,
    TableRowSelection,
} from "./interface";
import { ModalTypeEnum } from "@/utils";
import { del } from "./api";
import CreateMenuModal from "./CreateMenu";

const TreeTable = <T extends Record<string, any>>({
    showRowSelection = false,
    editable = false,
}: TreeTableProps<T>) => {
    const [messageApi, contextHolder] = message.useMessage();
    const menuStore = useMenuStore();
    const [checkStrictly] = useState(false);

    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateMenu>({} as UpdateMenu);
    const [form] = Form.useForm();

    // 定义表格列配置
    const columns: TreeTableColumn[] = [
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
    ];

    const actionColumns: TableColumnsType<T> = [
        {
            title: "操作",
            dataIndex: "ctrl",
            key: "ctrl",
            width: "15%",
            render: (_: any, record: T) => {
                return (
                    <Space>
                        {editable && (
                            <Button
                                type="link"
                                className="btn-p0"
                                icon={<EditOutlined />}
                                onClick={() => handleUpdate(record)}
                            >
                                编辑
                            </Button>
                        )}
                        {editable && (
                            <Button
                                type="link"
                                className="btn-p0"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record)}
                            >
                                删除
                            </Button>
                        )}
                    </Space>
                );
            },
        },
    ];

    // 构建表格列配置
    const tableColumns: TableColumnsType<T> = [
        ...columns,
        ...actionColumns,
        // ...(editable ? actionColumns : []),
    ];

    const rowSelection: TableRowSelection<DataType> = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows,
            );
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
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
            menuStore.getMenuList();
        }
    };

    const handleClose = () => setOpen(false);

    return (
        <>
            {editable && (
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                >
                    新增
                </Button>
            )}

            <Table<T>
                rowKey="id"
                columns={tableColumns}
                dataSource={menuStore.orginData as unknown as T[]}
                pagination={false}
                rowSelection={
                    showRowSelection
                        ? { ...rowSelection, checkStrictly }
                        : undefined
                }
            />
            <CreateMenuModal
                open={open}
                record={record}
                modalType={modalType}
                handleClose={handleClose}
            />
            {contextHolder}
        </>
    );
};

export default TreeTable;
