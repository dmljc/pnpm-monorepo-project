import { useState, useEffect, useMemo } from "react";
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
    checkable?: boolean;
    selectedRowKeys?: React.Key[] | undefined;
    onChange?: (selectedRowKeys: React.Key[]) => void;
}

// 递归查找菜单项的所有父级节点ID
const findParentIds = (
    menuList: any[],
    targetIds: React.Key[],
): React.Key[] => {
    const parentIds = new Set<React.Key>();

    const findParents = (items: any[], targetId: React.Key): boolean => {
        for (const item of items) {
            if (item.id === targetId) {
                return true;
            }
            if (item.children && item.children.length > 0) {
                if (findParents(item.children, targetId)) {
                    if (item.id) {
                        parentIds.add(item.id);
                    }
                    return true;
                }
            }
        }
        return false;
    };

    targetIds.forEach((targetId) => {
        findParents(menuList, targetId);
    });

    return Array.from(parentIds);
};

const TreeTable = <T extends Record<string, any>>(props: Props) => {
    const { editable = false, checkable = false, selectedRowKeys } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const menuStore = useMenuStore();

    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateMenu>({} as UpdateMenu);
    const [form] = Form.useForm();
    // 使用外部selectedRowKeys初始化，如果没有则使用空数组
    const [selectedRowKeyList, setSelectedRowKeyList] = useState<React.Key[]>(
        selectedRowKeys || [],
    );
    const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

    // 当外部selectedRowKeys变化时，更新本地state并展开相关父级节点
    useEffect(() => {
        if (
            selectedRowKeys &&
            JSON.stringify(selectedRowKeys) !==
                JSON.stringify(selectedRowKeyList)
        ) {
            setSelectedRowKeyList(selectedRowKeys);
            
            // 根据选中的菜单项展开其父级节点
            if (selectedRowKeys.length > 0 && menuStore.orginData.length > 0) {
                const parentIds = findParentIds(
                    menuStore.orginData,
                    selectedRowKeys,
                );
                // 重置展开状态，只展开当前选中项的父级节点
                setExpandedRowKeys(parentIds);
            } else if (selectedRowKeys.length === 0) {
                // 如果没有选中项，清空展开状态
                setExpandedRowKeys([]);
            }
        }
    }, [selectedRowKeys, selectedRowKeyList, menuStore.orginData]);

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
    const tableColumns: TableColumnsType<T> = [
        ...columns,
        ...(editable ? actionColumns : []),
    ];

    // 使用useMemo优化rowSelection对象，避免每次渲染都重新创建
    const rowSelection = useMemo(
        (): TableRowSelection<T> => ({
            selectedRowKeys: selectedRowKeyList,
            getCheckboxProps: () => ({
                disabled: !checkable,
            }),
            onChange: (selectedRowKeys) => {
                setSelectedRowKeyList(selectedRowKeys);
                // 只在值真正改变时才调用父组件的onChange
                if (
                    JSON.stringify(selectedRowKeys) !==
                    JSON.stringify(props.selectedRowKeys)
                ) {
                    props.onChange?.(selectedRowKeys);
                }
            },
            onSelect: () => {
                // 可选：调试用
            },
        }),
        [selectedRowKeyList, checkable, props.selectedRowKeys],
    );

    // 使用useMemo优化expandable对象
    const expandableConfig = useMemo(
        () => ({
            expandedRowKeys: expandedRowKeys,
            onExpand: (expanded: boolean, record: any) => {
                if (expanded) {
                    setExpandedRowKeys((prev) =>
                        prev.includes(record.id) ? prev : [...prev, record.id],
                    );
                } else {
                    // 检查是否是要展开的父级节点
                    const isParentOfSelected = selectedRowKeyList.some(
                        (selectedId) => {
                            const parentIds = findParentIds(
                                menuStore.orginData,
                                [selectedId],
                            );
                            return parentIds.includes(record.id);
                        },
                    );

                    // 如果是选中项的父级节点，不允许手动收起
                    if (isParentOfSelected) {
                        return;
                    }

                    setExpandedRowKeys((prev) =>
                        prev.filter((key) => key !== record.id),
                    );
                }
            },
        }),
        [expandedRowKeys, selectedRowKeyList, menuStore.orginData],
    );

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
                expandable={expandableConfig}
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
