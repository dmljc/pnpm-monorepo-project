import { css } from "@emotion/css";

export const iconSelector = css`
    min-width: 120px;
    min-height: 40px;
    border: 1px solid var(--ant-color-border);
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 4px 12px;
    cursor: pointer;
    background: var(--ant-color-bg-container);
    &:hover {
        border-color: var(--ant-color-primary);
    }
`;

export const iconDropdownPanel = css`
    width: 340px;
    padding: 12px 12px 0 12px;
`;

export const iconList = css`
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 12px;
    max-height: 240px;
    overflow-y: auto;
    margin-bottom: 8px;
`;

export const iconItem = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    cursor: pointer;
    border: 2px solid transparent;
    transition:
        border 0.2s,
        background 0.2s;
    &:hover,
    &.active {
        border-color: var(--ant-color-primary);
        background: var(--ant-color-primary-bg);
    }
    &.selected {
        border-color: var(--ant-color-primary);
        background: var(--ant-color-primary-bg);
    }
`;

export const iconEmpty = css`
    text-align: center;
    color: var(--ant-color-text-placeholder);
    padding: 32px 0;
`;

export const iconPagination = css`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
`;

export const iconPaginationPage = css`
    padding: 0 8px;
    font-weight: bold;
`;

export const iconPlaceholder = css`
    color: var(--ant-color-text-placeholder);
`;

// IconComponent 样式定义

export const iconCardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px",
    cursor: "pointer",
    border: "1px solid transparent",
    borderRadius: "4px",
    transition: "all 0.2s",
    justifyContent: "center",
};

export const iconItemStyle: React.CSSProperties = {
    width: 24,
    height: 24,
    marginBottom: "4px",
};

export const iconNameStyle: React.CSSProperties = {
    fontSize: "10px",
    color: "var(--ant-color-text-secondary)",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
};

export const emptyPlaceholderStyle: React.CSSProperties = {
    height: "60px",
};

export const dropdownContainerStyle: React.CSSProperties = {
    padding: "16px",
    height: "410px", // 固定高度，防止跳动
    display: "flex",
    flexDirection: "column",
};

export const searchInputStyle: React.CSSProperties = {
    marginBottom: 10,
};

export const paginationContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between", // 改为两端对齐
    alignItems: "center", // 垂直居中对齐
    marginTop: 0,
    flexShrink: 0, // 防止分页组件被压缩
    padding: "8px", // 添加左右内边距
    borderTop: "1px solid var(--ant-color-border)", // 添加顶部分割线
};

export const paginationLeftStyle: React.CSSProperties = {
    width: "100px", // 固定左侧区域宽度
    textAlign: "left", // 左对齐
    flexShrink: 0, // 防止被压缩
    fontSize: "12px", // 固定字体大小
    color: "var(--ant-color-text-secondary)", // 设置颜色
};

export const paginationRightStyle: React.CSSProperties = {
    width: "220px", // 固定右侧区域宽度
    textAlign: "right", // 右对齐
    flexShrink: 0, // 防止被压缩
    display: "flex",
    justifyContent: "flex-end", // 右对齐
};

export const iconGridContainerStyle: React.CSSProperties = {
    flex: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
};

export const selectStyle: React.CSSProperties = {
    width: 360,
};

export const popupStyle = {
    popup: {
        root: {
            padding: 0,
        },
    },
};
