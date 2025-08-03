import { useEffect, useState } from "react";
import { Button, message, Space, Table, Tag, Form } from "antd";
import type { TableColumnsType } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import IconRenderer from "../IconComponent/IconRenderer";
import { typeColorMap, typeLabelMap } from "./constant";
import type { DataType, UpdateMenu } from "./interface";
import { useMenuStore } from "@/store";
import type { TreeTableColumn, TableRowSelection } from "./interface";
import { ModalTypeEnum } from "@/utils";
import { del } from "./api";
import CreateMenuModal from "./CreateMenu";

interface Props {
    editable?: boolean;
    checkboxDisabled?: boolean;
    selectedRowKeys?: React.Key[] | undefined;
    onChange?: (selectedRowKeys: React.Key[]) => void;
}

const TreeTable = <T extends Record<string, any>>(props: Props) => {
    const {
        editable = false,
        checkboxDisabled = false,
        selectedRowKeys = [],
    } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const menuStore = useMenuStore();

    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateMenu>({} as UpdateMenu);
    const [form] = Form.useForm();
    const [selectedRowKeyList, setSelectedRowKeyList] =
        useState<React.Key[]>(selectedRowKeys);
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>(
        selectedRowKeys || [],
    );

    // 当 selectedRowKeys 属性变化时，更新内部状态
    useEffect(() => {
        setSelectedRowKeyList(selectedRowKeys || []);
        setExpandedRowKeys(selectedRowKeys || []);
    }, [selectedRowKeys]);

    // 定义表格列配置
    const columns: TreeTableColumn[] = [
        {
            title: "标题",
            dataIndex: "label",
            key: "label",
        },
        {
            title: "图标",
            dataIndex: "icon",
            key: "icon",
            render: (icon) => {
                return icon ? <IconRenderer icon={icon} /> : null;
            },
        },
        {
            title: "类型",
            dataIndex: "type",
            key: "type",
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
        },
        {
            title: "路由地址",
            dataIndex: "path",
            key: "path",
        },
        {
            title: "页面组件",
            dataIndex: "component",
            key: "component",
        },
    ];

    const actionColumns: TableColumnsType<T> = [
        {
            title: "操作",
            dataIndex: "ctrl",
            key: "ctrl",
            render: (_: any, record: any) => {
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
    const tableColumns: TableColumnsType<T> = [...columns, ...actionColumns];

    const rowSelection: TableRowSelection<T> = {
        selectedRowKeys: selectedRowKeyList,
        getCheckboxProps: () => ({
            disabled: checkboxDisabled,
            // name: record.label,
        }),
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(
                `onChange-: ${selectedRowKeys}`,
                "selectedRows---》: ",
                selectedRows,
            );
            props.onChange?.(selectedRowKeys);
            setSelectedRowKeyList(selectedRowKeys);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(
                `onSelect-record---》: ${record}`,
                `onSelect-selected---》: ${selected}`,
                `onSelect-selectedRows---》: ${selectedRows}`,
            );
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

            <Table
                rowKey="id"
                tableLayout="fixed"
                scroll={{ y: "calc(100vh - 230px)" }}
                columns={tableColumns}
                dataSource={menuStore.orginData as unknown as T[]}
                pagination={false}
                rowSelection={rowSelection}
                expandable={{
                    expandedRowKeys: expandedRowKeys,
                    onExpand: (expanded, record) => {
                        if (expanded) {
                            setExpandedRowKeys((prev) => [...prev, record.id]);
                        } else {
                            setExpandedRowKeys((prev) =>
                                prev.filter((key) => key !== record.id),
                            );
                        }
                    },
                }}
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
