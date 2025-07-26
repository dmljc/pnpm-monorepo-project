import { css } from "@emotion/css";

const treeContainer = css`
    // background-color: #f66;
`;

// 隐藏树形组件的展开/收起图标
const customTreeStyle = css`
    .ant-tree-switcher {
        display: none !important;
    }

    .ant-tree-node-selected {
        background-color: #e6f7ff;
    }
`;

// 搜索区域样式，确保 Input 和 children 在同一行
const searchAreaStyle = css`
    display: flex;
    align-items: center;
    margin-bottom: 14px;

    .ant-input {
        flex: 1;
    }
    .ant-btn {
        width: 28px;
        margin-left: 8px;
    }
`;

// 树节点样式
const treeNodeStyle = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 6px 8px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f5f5f5;
    }
`;

// 节点内容容器样式
const nodeContent = css`
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
`;

// 节点图标样式
const nodeIcon = css`
    margin-right: 8px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
`;

// 节点标题样式
const nodeTitle = css`
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 8px;
    font-size: 14px;
    line-height: 1.5;
`;

// 操作图标样式
const actionIcon = css`
    color: #999;
    font-size: 16px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.2s;
    flex-shrink: 0;

    &:hover {
        color: #1890ff;
        background-color: #e6f7ff;
    }
`;

export default {
    treeContainer,
    customTreeStyle,
    searchAreaStyle,
    treeNodeStyle,
    nodeContent,
    nodeIcon,
    nodeTitle,
    actionIcon,
};
