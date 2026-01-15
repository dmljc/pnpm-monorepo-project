import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Select, Input, Spin, Pagination, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import {
    iconCardStyle,
    iconItemStyle,
    emptyPlaceholderStyle,
    dropdownContainerStyle,
    searchInputStyle,
    paginationContainerStyle,
    paginationLeftStyle,
    paginationRightStyle,
    iconGridContainerStyle,
    selectStyle,
    popupStyle,
} from "./style";

// 常量定义
const CONSTANTS = {
    API: {
        DEFAULT_URL: "https://api.iconify.design/search?query=home&limit=210",
        SEARCH_URL: "https://api.iconify.design/search?query=",
        LIMIT: 210,
    },
    GRID: {
        COLS: 6,
        ROWS: 7,
        PAGE_SIZE: 42, // 6 * 7
    },
    DEBOUNCE_DELAY: 300,
} as const;

// 默认图标列表
const FALLBACK_ICONS = [
    "add",
    "edit",
    "delete",
    "search",
    "user",
    "settings",
    "home",
    "menu",
    "arrow-up",
    "arrow-down",
    "arrow-left",
    "arrow-right",
].map((name) => `carbon:${name}`);

// 全局状态管理
class IconCache {
    private static instance: IconCache;
    private cache: string[] = [];
    private loadingPromise: Promise<string[]> | null = null;

    static getInstance(): IconCache {
        if (!IconCache.instance) {
            IconCache.instance = new IconCache();
        }
        return IconCache.instance;
    }

    async getIcons(): Promise<string[]> {
        if (this.cache.length > 0) {
            return this.cache;
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = this.fetchIcons();
        return this.loadingPromise;
    }

    private async fetchIcons(): Promise<string[]> {
        try {
            const response = await fetch(CONSTANTS.API.DEFAULT_URL);

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}: ${response.statusText}`,
                );
            }

            const data = await response.json();
            let icons: string[] = [];

            if (Array.isArray(data.icons)) {
                icons = data.icons.map((icon: string) =>
                    icon.replace(/^carbon:/, ""),
                );
            }

            // 合并默认图标和API返回的图标
            const allIcons = this.uniq([...FALLBACK_ICONS, ...icons]);
            this.cache = allIcons;

            return allIcons;
        } catch (error) {
            console.warn("Iconify API 请求失败，使用默认图标:", error);
            this.cache = FALLBACK_ICONS;
            return FALLBACK_ICONS;
        } finally {
            this.loadingPromise = null;
        }
    }

    private uniq(arr: string[]): string[] {
        return Array.from(new Set(arr));
    }
}

// 防抖Hook
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// 图标项组件
const IconItem = React.memo<{
    icon: string;
    onSelect: (icon: string) => void;
}>(({ icon, onSelect }) => {
    const handleClick = useCallback(() => {
        onSelect(icon);
    }, [icon, onSelect]);

    const handleMouseEnter = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.borderColor = "#1890ff";
            e.currentTarget.style.backgroundColor = "#f0f8ff";
        },
        [],
    );

    const handleMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.backgroundColor = "transparent";
        },
        [],
    );

    return (
        <div
            style={iconCardStyle}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            title={icon}
        >
            <Icon icon={icon} style={iconItemStyle} />
        </div>
    );
});

IconItem.displayName = "IconItem";

// 图标网格组件
const IconGrid = React.memo<{
    icons: string[];
    onSelect: (icon: string) => void;
}>(({ icons, onSelect }) => {
    const renderIconRows = useMemo(() => {
        const rows = [];
        for (let i = 0; i < icons.length; i += CONSTANTS.GRID.COLS) {
            const rowIcons = icons.slice(i, i + CONSTANTS.GRID.COLS);
            const cols = rowIcons.map((icon, index) => (
                <Col span={24 / CONSTANTS.GRID.COLS} key={`${icon}-${index}`}>
                    <IconItem icon={icon} onSelect={onSelect} />
                </Col>
            ));

            // 填充空位
            while (cols.length < CONSTANTS.GRID.COLS) {
                cols.push(
                    <Col
                        span={24 / CONSTANTS.GRID.COLS}
                        key={`empty-${cols.length}`}
                    >
                        <div style={emptyPlaceholderStyle} />
                    </Col>,
                );
            }

            rows.push(
                <Row key={i} gutter={[8, 8]}>
                    {cols}
                </Row>,
            );
        }
        return rows;
    }, [icons, onSelect]);

    return <>{renderIconRows}</>;
});

IconGrid.displayName = "IconGrid";

// 搜索组件
const IconSearch = React.memo<{
    value: string;
    onChange: (value: string) => void;
    onSearch: (query: string) => void;
}>(({ value, onChange, onSearch }) => {
    const { t } = useTranslation();
    const debouncedValue = useDebounce(value, CONSTANTS.DEBOUNCE_DELAY);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
        },
        [onChange],
    );

    return (
        <Input
            placeholder={t("menu:form.icon.searchPlaceholder", {
                defaultValue: "搜索图标名称",
            })}
            value={value}
            onChange={handleChange}
            allowClear
            style={searchInputStyle}
            onPressEnter={(e) => e.preventDefault()}
            prefix={<Icon icon="search" width={16} height={16} />}
        />
    );
});

IconSearch.displayName = "IconSearch";

// 图标选择器组件
const IconSelector: React.FC<{
    value?: string;
    onChange?: (val: string) => void;
    style?: React.CSSProperties;
    pageSize?: number;
    showSearch?: boolean;
}> = ({
    value,
    onChange,
    style,
    pageSize = CONSTANTS.GRID.PAGE_SIZE,
    showSearch = true,
}) => {
    const [iconList, setIconList] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [current, setCurrent] = useState(1);
    const [filtered, setFiltered] = useState<string[]>([]);

    // 图标缓存实例
    const iconCache = useMemo(() => IconCache.getInstance(), []);

    // 初始化加载图标
    useEffect(() => {
        const loadIcons = async () => {
            setLoading(true);

            try {
                const icons = await iconCache.getIcons();
                setIconList(icons);
                setFiltered(icons);
            } catch (error) {
                console.error("加载图标失败:", error);
                setIconList(FALLBACK_ICONS);
                setFiltered(FALLBACK_ICONS);
            } finally {
                setLoading(false);
            }
        };

        loadIcons();
    }, [iconCache]);

    // 搜索处理
    const handleSearch = useCallback(
        async (query: string) => {
            if (!query.trim()) {
                setFiltered(iconList);
                setCurrent(1);
                return;
            }

            setLoading(true);
            setCurrent(1);

            try {
                const safeQuery = query.replace(/[^a-zA-Z0-9-_]/g, "");
                if (!safeQuery) {
                    setFiltered(iconList);
                    return;
                }

                const url = `${CONSTANTS.API.SEARCH_URL}${encodeURIComponent(safeQuery)}&limit=${CONSTANTS.API.LIMIT}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}: ${response.statusText}`,
                    );
                }

                const data = await response.json();
                let icons: string[] = [];

                if (Array.isArray(data.icons)) {
                    icons = data.icons.map((icon: string) =>
                        icon.replace(/^carbon:/, ""),
                    );
                }

                setFiltered(Array.from(new Set(icons)));
            } catch (error) {
                console.warn("搜索图标失败:", error);
                // 本地过滤作为备选
                const localFiltered = iconList.filter((icon) =>
                    icon.toLowerCase().includes(query.toLowerCase()),
                );
                setFiltered(localFiltered);
            } finally {
                setLoading(false);
            }
        },
        [iconList],
    );

    // 分页计算
    const paginationData = useMemo(() => {
        const total = filtered.length;
        const pageIcons = filtered.slice(
            (current - 1) * pageSize,
            current * pageSize,
        );
        return { total, pageIcons };
    }, [filtered, current, pageSize]);

    // 图标选择处理
    const handleIconSelect = useCallback(
        (icon: string) => {
            onChange?.(icon);
        },
        [onChange],
    );

    // 分页变化处理
    const handlePageChange = useCallback(
        (page: number) => {
            // 防止快速点击导致的跳动
            if (loading) return;
            setCurrent(page);
        },
        [loading],
    );

    // 搜索变化处理
    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);
    }, []);

    const { t } = useTranslation();

    return (
        <Select
            showSearch={false}
            value={value}
            onChange={onChange}
            style={{ ...selectStyle, ...style }}
            placeholder={t("menu:form.icon.placeholder")}
            popupRender={() => (
                <div style={dropdownContainerStyle}>
                    {showSearch && (
                        <IconSearch
                            value={search}
                            onChange={handleSearchChange}
                            onSearch={handleSearch}
                        />
                    )}
                    <div style={iconGridContainerStyle}>
                        <Spin spinning={loading}>
                            <IconGrid
                                icons={paginationData.pageIcons}
                                onSelect={handleIconSelect}
                            />
                        </Spin>
                    </div>
                    <div style={paginationContainerStyle}>
                        <div style={paginationLeftStyle}>
                            {paginationData.total > 0
                                ? `${(current - 1) * pageSize + 1}-${Math.min(current * pageSize, paginationData.total)} / ${paginationData.total}`
                                : "0-0 / 0"}
                        </div>
                        <div style={paginationRightStyle}>
                            <Pagination
                                size="small"
                                current={current}
                                pageSize={pageSize}
                                total={paginationData.total}
                                showSizeChanger={false}
                                showTotal={() => null} // 不显示默认的total，因为我们自定义了
                                onChange={handlePageChange}
                                // 添加分页组件的样式，防止跳动
                                style={{
                                    margin: 0,
                                    padding: 0,
                                }}
                                // 添加loading延迟，避免快速切换时的闪烁
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>
            )}
            options={[]}
            filterOption={false}
            allowClear
            styles={popupStyle}
            notFoundContent={
                loading ? (
                    <Spin size="small" />
                ) : (
                    t("menu:messages.noData", { defaultValue: "暂无数据" })
                )
            }
        />
    );
};

// 主组件接口
interface IconComponentProps {
    value?: string;
    onChange?: (val: string) => void;
    style?: React.CSSProperties;
    pageSize?: number;
    showSearch?: boolean;
    // 新增：用于渲染单个图标的属性
    icon?: string;
    className?: string;
}

const IconComponent: React.FC<IconComponentProps> = (props) => {
    // 如果提供了 icon 属性，则渲染单个图标
    if (props.icon) {
        return (
            <Icon
                icon={props.icon}
                className={props.className}
                style={props.style}
            />
        );
    }

    // 否则渲染图标选择器
    return <IconSelector {...props} />;
};

export default React.memo(IconComponent);
