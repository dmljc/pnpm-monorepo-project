import React from "react";

/**
 * 处理菜单数据，将空的children数组转换为null
 * @param menuList 菜单列表
 * @returns 处理后的菜单列表
 */
export function processMenuChildren(menuList: MenuItem[]): MenuItem[] {
    return menuList.map((item) => {
        const processedItem = { ...item };

        if (processedItem.children && Array.isArray(processedItem.children)) {
            if (processedItem.children.length === 0) {
                // 如果children为空数组，设置为null
                processedItem.children = null;
            } else {
                // 递归处理子菜单
                processedItem.children = processMenuChildren(
                    processedItem.children,
                );
            }
        } else {
            // 如果没有children属性或不是数组，设置为null
            processedItem.children = null;
        }

        return processedItem;
    });
}

/**
 * 将menuList（Item[]）递归转换为menuItems（MenuItem[]）
 * 只保留类型为catalog（目录）和menu（菜单）的数据
 * @param menuList 菜单列表
 * @returns menuItems格式数组
 */
export function convertMenuListToMenuItems(menuList: MenuItem[]): MenuItem[] {
    // 首先处理children字段
    const processedMenuList = processMenuChildren(menuList);

    return processedMenuList
        .filter((item) => item.type === "catalog" || item.type === "menu")
        .map((item, idx) => {
            const children = item.children
                ? convertMenuListToMenuItems(item.children)
                : [];
            // 保证 key 唯一：优先 url，其次 id，否则用 type+name+idx
            const key =
                item.path ||
                (item.id !== undefined
                    ? String(item.id)
                    : `${item.type}-${item.label}-${idx}`);

            return {
                key,
                icon: item.icon, // 直接传递图标字符串，让 Ant Design Menu 组件自己处理
                id: item.id,
                label: item.label,
                type: item.type,
                path: item.path,
                ...(children.length >= 1 ? { children } : {}),
                // 不要 parentId、id、component、code 等无关字段
            };
        });
}

/**
 * 菜单项类型定义
 */
export interface MenuItem {
    id: number; // 菜单唯一标识
    key: string; // 菜单唯一标识
    label: string; // 菜单名称
    type: string; // 菜单类型（如目录、菜单、按钮等）
    parentId?: number; // 父级菜单ID
    icon?: React.ReactNode; // 菜单图标
    path?: string; // 路由地址
    code?: string; // 权限编码
    component?: string; // 组件路径
    children?: MenuItem[] | null; // 子菜单
}

export const getLevelKeys = (items1: MenuItem[]) => {
    const key: Record<string, number> = {};
    const func = (items2: MenuItem[], level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};
