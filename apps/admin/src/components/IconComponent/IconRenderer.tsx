import React, { useState, useEffect, useRef, memo } from "react";
import { Icon, loadIcon } from "@iconify/react";
import * as AntdIcons from "@ant-design/icons";

interface IconRendererProps {
    icon?: string;
    className?: string;
    style?: React.CSSProperties;
}

// 图标加载状态缓存（全局共享）
const iconLoadedCache = new Set<string>();
const iconLoadingCache = new Map<string, Promise<void>>();

// 预加载图标并缓存
const preloadIcon = async (iconName: string): Promise<void> => {
    // 已加载过，直接返回
    if (iconLoadedCache.has(iconName)) {
        return;
    }

    // 正在加载中，返回现有的 Promise
    if (iconLoadingCache.has(iconName)) {
        return iconLoadingCache.get(iconName);
    }

    // 开始加载
    const loadPromise = loadIcon(iconName)
        .then(() => {
            iconLoadedCache.add(iconName);
            iconLoadingCache.delete(iconName);
        })
        .catch(() => {
            iconLoadingCache.delete(iconName);
        });

    iconLoadingCache.set(iconName, loadPromise);
    return loadPromise;
};

const IconRenderer: React.FC<IconRendererProps> = memo(
    ({ icon, className, style }) => {
        const [isVisible, setIsVisible] = useState(false);
        const [isLoaded, setIsLoaded] = useState(false);
        const containerRef = useRef<HTMLSpanElement>(null);

        // 检查是否是 Ant Design 图标
        const isAntdIcon =
            icon &&
            typeof icon === "string" &&
            icon.startsWith("@ant-design/icons:");

        // 使用 IntersectionObserver 实现懒加载
        useEffect(() => {
            if (!icon || typeof icon !== "string" || isAntdIcon) {
                return;
            }

            // 如果图标已经在缓存中，直接显示
            if (iconLoadedCache.has(icon)) {
                setIsVisible(true);
                setIsLoaded(true);
                return;
            }

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setIsVisible(true);
                            observer.disconnect();
                        }
                    });
                },
                {
                    rootMargin: "50px", // 提前 50px 开始加载
                    threshold: 0,
                },
            );

            if (containerRef.current) {
                observer.observe(containerRef.current);
            }

            return () => {
                observer.disconnect();
            };
        }, [icon, isAntdIcon]);

        // 当图标变为可见时，预加载图标
        useEffect(() => {
            if (!isVisible || !icon || typeof icon !== "string" || isAntdIcon) {
                return;
            }

            preloadIcon(icon).then(() => {
                setIsLoaded(true);
            });
        }, [isVisible, icon, isAntdIcon]);

        if (!icon || typeof icon !== "string") {
            return null;
        }

        // Ant Design 图标直接渲染（本地图标，无需网络请求）
        if (isAntdIcon) {
            const iconName = icon.replace("@ant-design/icons:", "");
            const AntdIcon = (AntdIcons as any)[iconName];
            if (AntdIcon) {
                return <AntdIcon className={className} style={style} />;
            }
            return null;
        }

        // Iconify 图标 - 懒加载
        return (
            <span
                ref={containerRef}
                className={className}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: style?.width ?? "1em",
                    height: style?.height ?? "1em",
                    ...style,
                }}
            >
                {isLoaded && (
                    <Icon
                        icon={icon}
                        style={{ width: "100%", height: "100%" }}
                    />
                )}
            </span>
        );
    },
);

IconRenderer.displayName = "IconRenderer";

export default IconRenderer;
