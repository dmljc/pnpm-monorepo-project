import React, { useEffect, useState } from "react";
import { Input, Tree, Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import IconRenderer from "../IconComponent/IconRenderer";
import ss from "./style";

interface TreeData {
    id: string;
    name: string;
    icon?: React.ReactNode;
    children?: TreeData[];
}

interface TreeComponentProps {
    treeData: TreeData[];
    children?: React.ReactNode;
    onItemAction?: (action: string, item: TreeData) => void;
    onSelect?: (selectedKeys: React.Key[], info: any) => void;
}

const TreeComponent: React.FC<TreeComponentProps> = ({
    treeData,
    children,
    onItemAction,
    onSelect,
}) => {
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    const [searchTreeData, setSearchTreeData] = useState<TreeData[]>(treeData);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

    const onExpand = (newExpandedKeys: React.Key[]) => {
        setExpandedKeys(newExpandedKeys);
        setAutoExpandParent(false);
    };

    useEffect(() => {
        setSearchTreeData(treeData);
        // 只在没有选中项时设置默认选中第一条数据
        if (treeData.length > 0 && selectedKeys.length === 0) {
            setSelectedKeys([treeData[0].id]);
        }
    }, [treeData]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const newTreeData = treeData.filter((item) => {
            return item.name.includes(value);
        });

        setSearchTreeData(newTreeData);
    };

    // 为每个树节点添加操作菜单
    const getMenuItems = (item: TreeData) => [
        {
            key: "edit",
            label: "编辑",
            onClick: () => onItemAction?.("edit", item),
        },
        {
            key: "delete",
            label: "删除",
            onClick: () => onItemAction?.("delete", item),
        },
    ];

    // 自定义标题渲染函数
    const titleRender = (nodeData: any) => {
        const item = nodeData as TreeData;

        return (
            <div className={ss.treeNodeStyle}>
                <div className={ss.nodeContent}>
                    <IconRenderer icon={item.icon as string} />
                    <span className={ss.nodeTitle}>{item.name}</span>
                </div>
                {selectedKeys[0] === item.id && (
                    <Dropdown
                        menu={{ items: getMenuItems(item) }}
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

    return (
        <div className={ss.treeContainer}>
            <div className={ss.searchAreaStyle}>
                <Input
                    allowClear
                    onChange={onChange}
                    placeholder="请搜索角色名称"
                />
                <span>{children}</span>
            </div>
            <Tree
                className={ss.customTreeStyle}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                treeData={searchTreeData as any}
                onSelect={(keys, info) => {
                    // 阻止取消选中
                    if (keys.length === 0) return;

                    setSelectedKeys(keys);
                    onSelect?.(keys, info);
                }}
                selectedKeys={selectedKeys}
                blockNode
                titleRender={titleRender}
                fieldNames={{
                    title: "name",
                    key: "id",
                }}
            />
        </div>
    );
};

export default TreeComponent;
