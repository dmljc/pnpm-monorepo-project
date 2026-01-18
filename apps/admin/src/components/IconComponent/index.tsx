/**
 * 图标选择器组件
 * 重构版：基于 Ant Design Icons，零网络请求，高性能
 * 无分类，6行6列分页显示
 */
import React, { useState, useCallback, useMemo } from "react";
import { Select, Input, Empty, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { ALL_ICONS, searchIcons, getIconComponent } from "./icons";
import IconRenderer from "./IconRenderer";
import {
    dropdownContainerStyle,
    searchInputStyle,
    iconGridContainerStyle,
    iconCardClass,
    iconItemStyle,
    emptyStyle,
    selectStyle,
    paginationContainerStyle,
} from "./style";

// 主组件接口
interface IconComponentProps {
    /** 当前选中的图标 */
    value?: string;
    /** 图标变化回调 */
    onChange?: (val: string) => void;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /** 占位符 */
    placeholder?: string;
    /** 每页显示数量（已废弃，新版本不需要分页） */
    pageSize?: number;
    /** 是否显示搜索（已废弃，新版本始终显示） */
    showSearch?: boolean;
    /** 用于渲染单个图标的属性 */
    icon?: string;
    /** CSS 类名 */
    className?: string;
}

const IconComponent: React.FC<IconComponentProps> = (props) => {
    // 如果提供了 icon 属性，则渲染单个图标（兼容旧用法）
    if (props.icon) {
        return (
            <IconRenderer
                icon={props.icon}
                className={props.className}
                style={props.style}
            />
        );
    }

    // 否则渲染图标选择器
    return <IconSelector {...props} />;
};

// 常量：每页显示 6行6列 = 36 个图标
const PAGE_SIZE = 36; // 6 rows × 6 columns

// 图标选择器组件
const IconSelector: React.FC<IconComponentProps> = ({
    value,
    onChange,
    style,
    placeholder,
}) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // 搜索过滤
    const filteredIcons = useMemo(() => {
        if (search) {
            return searchIcons(search);
        }
        return ALL_ICONS;
    }, [search]);

    // 分页数据
    const paginationData = useMemo(() => {
        const total = filteredIcons.length;
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const pageIcons = filteredIcons.slice(start, end);

        return {
            total,
            pageIcons,
            current: currentPage,
            totalPages: Math.ceil(total / PAGE_SIZE),
        };
    }, [filteredIcons, currentPage]);

    // 搜索时重置到第一页
    React.useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // 图标选择
    const handleIconSelect = useCallback(
        (iconName: string) => {
            onChange?.(iconName);
        },
        [onChange],
    );

    // 分页变化
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // 渲染图标网格
    const renderIconGrid = () => {
        if (paginationData.pageIcons.length === 0) {
            return (
                <div style={emptyStyle}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            search
                                ? `未找到 "${search}" 相关图标`
                                : t("common:noData", {
                                      defaultValue: "暂无图标",
                                  })
                        }
                    />
                </div>
            );
        }

        return (
            <div style={iconGridContainerStyle}>
                {paginationData.pageIcons.map((iconName) => {
                    const IconComponent = getIconComponent(iconName);
                    if (!IconComponent) return null;

                    const isSelected = value === iconName;

                    return (
                        <div
                            key={iconName}
                            className={`${iconCardClass} ${isSelected ? "selected" : ""}`}
                            onClick={() => handleIconSelect(iconName)}
                            title={iconName}
                        >
                            <IconComponent style={iconItemStyle} />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <Select
            value={value}
            onChange={onChange}
            style={{ ...selectStyle, ...style }}
            placeholder={
                placeholder ||
                t("menu:form.icon.placeholder", {
                    defaultValue: "请选择图标",
                })
            }
            popupMatchSelectWidth={false} // 不匹配选择框宽度，使用自定义宽度
            styles={{
                popup: {
                    root: {
                        minWidth: "354px",
                        width: "354px",
                        maxWidth: "354px",
                    },
                },
            }}
            placement="bottomLeft" // 确保下拉面板正确定位
            getPopupContainer={(triggerNode) => {
                // 返回最近的定位父元素，如果没有则返回 body
                let parent = triggerNode.parentElement;
                while (
                    parent &&
                    getComputedStyle(parent).position === "static"
                ) {
                    parent = parent.parentElement;
                }
                return parent || document.body;
            }}
            popupRender={() => (
                <div style={dropdownContainerStyle}>
                    {/* 搜索框 */}
                    <Input
                        placeholder={t("menu:form.icon.searchPlaceholder", {
                            defaultValue: "搜索图标名称...",
                        })}
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                        style={searchInputStyle}
                    />

                    {/* 搜索结果统计 */}
                    {search && (
                        <div
                            style={{
                                marginBottom: "12px",
                                fontSize: "13px",
                                color: "var(--ant-color-text-secondary)",
                            }}
                        >
                            找到 {filteredIcons.length} 个图标
                        </div>
                    )}

                    {/* 图标网格 */}
                    {renderIconGrid()}

                    {/* 分页 */}
                    {paginationData.total > PAGE_SIZE && (
                        <div style={paginationContainerStyle}>
                            <Pagination
                                current={paginationData.current}
                                total={paginationData.total}
                                pageSize={PAGE_SIZE}
                                size="small"
                                showSizeChanger={false}
                                showTotal={(total, range) =>
                                    `${String(range[0]).padStart(2, "0")}-${String(range[1]).padStart(2, "0")} / ${total}`
                                }
                                onChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            )}
            options={[]}
            labelRender={() => (value ? <IconRenderer icon={value} /> : null)}
        />
    );
};

export default React.memo(IconComponent);
