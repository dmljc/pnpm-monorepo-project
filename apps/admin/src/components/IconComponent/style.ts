/**
 * 图标组件样式
 * 参考旧版设计，简洁优雅
 */
import { css } from "@emotion/css";

// 下拉容器样式
export const dropdownContainerStyle: React.CSSProperties = {
    width: "354px",
    minWidth: "354px", // 确保最小宽度
    maxWidth: "354px", // 确保最大宽度
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box", // 确保 padding 包含在宽度内
    overflow: "visible", // 允许内容正常显示
};

// 搜索框样式
export const searchInputStyle: React.CSSProperties = {
    marginBottom: "12px",
    width: "100%",
    boxSizing: "border-box",
};

// 图标网格容器样式（6列布局）
export const iconGridContainerStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)", // 6列
    gap: "4px", // 减小间距，使图标更紧凑
    padding: "4px 0", // 减小上下 padding
    height: "280px", // 固定高度：6行 × 42px + 5个gap × 4px + padding 8px = 280px
    width: "100%",
    boxSizing: "border-box",
    alignContent: "start", // 确保图标从顶部开始排列
};

// 图标卡片样式（参考旧版，简洁设计）
export const iconCardClass = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 6px;
    cursor: pointer;
    border: 2px solid transparent;
    background-color: transparent;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--ant-color-primary);
        background-color: var(--ant-color-primary-bg);
    }

    &.selected {
        border-color: var(--ant-color-primary);
        background-color: var(--ant-color-primary-bg);
    }
`;

// 图标样式
export const iconItemStyle: React.CSSProperties = {
    fontSize: 22,
    color: "var(--ant-color-text)",
};

// 分页容器样式
export const paginationContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid var(--ant-color-border)",
    width: "100%",
    boxSizing: "border-box",
    flexShrink: 0, // 防止压缩
};

// 空状态样式
export const emptyStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
};

// Select 样式
export const selectStyle: React.CSSProperties = {
    width: 300,
};

// ============================================
// 以下是为了兼容旧代码，保留的样式定义
// ============================================

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

export const paginationLeftStyle: React.CSSProperties = {
    width: "100px",
    textAlign: "left",
    flexShrink: 0,
    fontSize: "12px",
    color: "var(--ant-color-text-secondary)",
};

export const paginationRightStyle: React.CSSProperties = {
    width: "220px",
    textAlign: "right",
    flexShrink: 0,
    display: "flex",
    justifyContent: "flex-end",
};

export const popupStyle = {
    popup: {
        root: {
            padding: 0,
        },
    },
};
