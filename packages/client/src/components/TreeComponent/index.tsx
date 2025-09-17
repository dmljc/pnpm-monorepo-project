import React, { useEffect, useState } from "react";
import { Input, Tree, Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import IconRenderer from "../IconComponent/IconRenderer";
import { usePermission } from "@/utils";
import ss from "./style";

// ==================== 类型定义 ====================
interface TreeData {
    /** 节点唯一标识 */
    id: string;
    /** 节点显示名称 */
    name: string;
    /** 节点图标 */
    icon?: React.ReactNode;
    /** 子节点列表 */
    children?: TreeData[];
}

interface TreeComponentProps {
    /** 树形数据源 */
    treeData: TreeData[];
    /** 操作区域的子组件（通常是新增按钮） */
    children?: React.ReactNode;
    /** 节点操作回调函数 */
    onItemAction?: (action: string, item: TreeData) => void;
    /** 节点选择回调函数 */
    onSelect?: (selectedKeys: React.Key[], info: any) => void;
}

const TreeComponent: React.FC<TreeComponentProps> = ({
    treeData,
    children,
    onItemAction,
    onSelect,
}) => {
    // ==================== 状态管理 ====================
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [searchTreeData, setSearchTreeData] = useState<TreeData[]>(treeData);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

    // ==================== 权限管理 ====================
    const editPermission = usePermission("role:update");
    const deletePermission = usePermission("role:delete");

    // ==================== 副作用钩子 ====================
    useEffect(() => {
        setSearchTreeData(treeData);
        // 只在没有选中项时设置默认选中第一条数据
        if (treeData.length > 0 && selectedKeys.length === 0) {
            setSelectedKeys([treeData[0].id]);
        }
    }, [treeData]);

    // ==================== 事件处理函数 ====================
    const handleExpand = (newExpandedKeys: React.Key[]) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const filteredData = treeData.filter((item) =>
            item.name.includes(value),
        );
        setSearchTreeData(filteredData);
    };

    const handleTreeSelect = (keys: React.Key[], info: any) => {
        // 阻止取消选中
        if (keys.length === 0) return;

        setSelectedKeys(keys);
        onSelect?.(keys, info);
    };

    // ==================== 渲染函数 ====================
    const getMenuItems = (item: TreeData) => [
        {
            key: "edit",
            label: "编辑",
            disabled: !editPermission,
            onClick: () => onItemAction?.("edit", item),
        },
        {
            key: "delete",
            label: "删除",
            disabled: !deletePermission,
            onClick: () => onItemAction?.("delete", item),
        },
    ];

    const renderNodeTitle = (nodeData: any) => {
        const item = nodeData as TreeData;

        return (
            <div className={ss.treeNodeStyle}>
                <div className={ss.nodeContent}>
                    <IconRenderer icon={item.icon as string} />
                    <span className={ss.nodeTitle}>{item.name}</span>
                </div>
                {selectedKeys[0] === item.id && (
                    <Dropdown
                        menu={{
                            items: getMenuItems(item),
                        }}
                        trigger={["click"]}
                    >
                        <EllipsisOutlined
                            className={ss.actionIcon}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        />
                    </Dropdown>
                )}
            </div>
        );
    };

    // ==================== 主渲染 ====================
    return (
        <div className={ss.treeContainer}>
            <div className={ss.searchAreaStyle}>
                <Input
                    allowClear
                    onChange={handleSearchChange}
                    placeholder="请搜索角色名称"
                />
                <span>{children}</span>
            </div>
            <Tree
                className={ss.customTreeStyle}
                onExpand={handleExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={searchTreeData as any}
                onSelect={handleTreeSelect}
                selectedKeys={selectedKeys}
                blockNode
                titleRender={renderNodeTitle}
                fieldNames={{
                    title: "name",
                    key: "id",
                }}
            />
        </div>
    );
};

export default TreeComponent;
