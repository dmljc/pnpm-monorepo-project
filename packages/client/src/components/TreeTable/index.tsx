// 顺序标准化 - React → 第三方库 → 内部模块 → 相对路径
import { useState, useEffect, useMemo } from "react";

import { message, Space, Table, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { useTranslation } from "react-i18next";

import { AuthButton } from "@/components";
import { useMenuStore } from "@/store";
import { ModalTypeEnum } from "@/utils";

import { del } from "./api";
import IconRenderer from "../IconComponent/IconRenderer";
import { typeColorMap, typeLabelMap } from "./constant";
import CreateMenuModal from "./CreateMenu";
import type {
    DataType,
    UpdateMenu,
    TreeTableColumn,
    TableRowSelection,
} from "./interface";

interface Props {
    // 是否可编辑（新增、编辑、删除）
    editable?: boolean;
    // 是否禁用勾选 checkbox
    disabledCheck?: boolean;
    // 是否可选择 checkbox
    selecteable?: boolean;
    // 选中的行 key 列表
    selectedRowKeys?: React.Key[] | undefined;
    // 选择行变化回调
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
    const {
        editable = false,
        disabledCheck = false,
        selecteable = false,
        selectedRowKeys,
    } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const { t } = useTranslation();
    const menuStore = useMenuStore();

    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateMenu>({} as UpdateMenu);
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
            if (
                selectedRowKeys.length > 0 &&
                menuStore.menuMeOriginList.length > 0
            ) {
                const parentIds = findParentIds(
                    menuStore.menuMeOriginList,
                    selectedRowKeys,
                );
                // 重置展开状态，只展开当前选中项的父级节点
                setExpandedRowKeys(parentIds);
            } else if (selectedRowKeys.length === 0) {
                // 如果没有选中项，清空展开状态
                setExpandedRowKeys([]);
            }
        }
    }, [selectedRowKeys, selectedRowKeyList, menuStore.menuMeOriginList]);

    // 定义表格列配置
    const columns: TreeTableColumn[] = [
        {
            title: t("menu:table.columns.name"),
            dataIndex: "label",
            key: "label",
        },
        {
            title: t("menu:table.columns.icon"),
            dataIndex: "icon",
            key: "icon",
            render: (icon) => {
                return icon ? <IconRenderer icon={icon} /> : null;
            },
        },
        {
            title: t("menu:table.columns.type"),
            dataIndex: "type",
            key: "type",
            render: (type) => {
                return (
                    <Tag color={typeColorMap[type]}>{typeLabelMap[type]}</Tag>
                );
            },
        },
        {
            title: t("menu:table.columns.code"),
            dataIndex: "code",
            key: "code",
        },
        {
            title: t("menu:table.columns.path"),
            dataIndex: "path",
            key: "path",
        },
        {
            title: t("menu:table.columns.component"),
            dataIndex: "component",
            key: "component",
        },
    ];

    const actionColumns: TableColumnsType<T> = [
        {
            title: t("menu:table.columns.actions"),
            dataIndex: "ctrl",
            key: "ctrl",
            render: (_: any, record: any) => {
                return (
                    <Space>
                        {editable && (
                            <AuthButton
                                code="menu:update"
                                key="menu:update"
                                type="link"
                                className="btn-p0"
                                icon={<EditOutlined />}
                                onClick={() => handleUpdate(record)}
                            >
                                {t("menu:table.actions.edit")}
                            </AuthButton>
                        )}
                        {editable && (
                            <AuthButton
                                code="menu:delete"
                                key="menu:delete"
                                type="link"
                                className="btn-p0"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record)}
                            >
                                {t("menu:table.actions.delete")}
                            </AuthButton>
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
                disabled: disabledCheck,
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
        [selectedRowKeyList, disabledCheck, props.selectedRowKeys],
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
                                menuStore.menuMeOriginList,
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
        [expandedRowKeys, selectedRowKeyList, menuStore.menuMeOriginList],
    );

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
            messageApi.success(t("menu:messages.deleteSuccess"));
            menuStore.getMenuMeList();
        }
    };

    const handleClose = () => setOpen(false);

    return (
        <>
            {editable && (
                <AuthButton
                    code="menu:create"
                    key="menu:create"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                    style={{
                        marginBottom: 16,
                    }}
                >
                    {t("menu:table.actions.add")}
                </AuthButton>
            )}

            <Table
                rowKey="id"
                tableLayout="fixed"
                scroll={{ y: "calc(100vh - 230px)" }}
                columns={tableColumns}
                dataSource={menuStore.menuOriginList}
                pagination={false}
                rowSelection={selecteable ? rowSelection : undefined}
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
