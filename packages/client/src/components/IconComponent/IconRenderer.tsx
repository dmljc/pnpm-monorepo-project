import React from "react";
import { Icon } from "@iconify/react";
import * as AntdIcons from "@ant-design/icons";

interface IconRendererProps {
    icon?: string;
    className?: string;
    style?: React.CSSProperties;
}

const IconRenderer: React.FC<IconRendererProps> = ({
    icon,
    className,
    style,
}) => {
    if (!icon || typeof icon !== "string") {
        return null;
    }

    // 检查是否是 Ant Design 图标
    if (icon.startsWith("@ant-design/icons:")) {
        const iconName = icon.replace("@ant-design/icons:", "");
        const AntdIcon = (AntdIcons as any)[iconName];
        if (AntdIcon) {
            return <AntdIcon className={className} style={style} />;
        }
    }

    // 检查是否是 Iconify 图标（包含冒号的格式）
    if (icon.includes(":")) {
        return <Icon icon={icon} className={className} style={style} />;
    }

    // 默认作为 Iconify 图标处理
    return <Icon icon={icon} className={className} style={style} />;
};

export default IconRenderer;
