/**
 * 图标渲染组件
 * 基于 Ant Design Icons，零网络请求
 * 自动映射旧的 Iconify 图标名称
 */
import React, { memo } from "react";
import { getIconComponent } from "./icons";
import { mapIconName } from "@/utils/iconMapper";

interface IconRendererProps {
    /** 图标名称，支持 Iconify 和 Ant Design Icons 格式 */
    icon?: string;
    /** CSS 类名 */
    className?: string;
    /** 内联样式 */
    style?: React.CSSProperties;
    /** 图标大小（会设置 fontSize） */
    size?: number;
}

const IconRenderer: React.FC<IconRendererProps> = memo(
    ({ icon, className, style, size }) => {
        if (!icon || typeof icon !== "string") {
            return null;
        }

        // 自动映射图标名称（兼容旧的 Iconify 格式）
        const mappedIconName = mapIconName(icon);

        // 获取图标组件
        const IconComponent = getIconComponent(mappedIconName);

        if (!IconComponent) {
            console.warn(`图标 "${icon}" (映射后: "${mappedIconName}") 不存在`);
            return null;
        }

        const iconStyle: React.CSSProperties = {
            ...style,
            ...(size ? { fontSize: size } : {}),
        };

        return <IconComponent className={className} style={iconStyle} />;
    },
);

IconRenderer.displayName = "IconRenderer";

export default IconRenderer;
