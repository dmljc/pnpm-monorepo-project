import React from "react";

/**
 * 菜单项类型定义
 */
export interface MenuItem {
    /** 菜单唯一标识 */
    id: number;
    /** 菜单唯一标识 */
    key: string;
    /** 菜单名称 */
    label: string;
    /** 菜单类型（如目录、菜单、按钮等） */
    type: string;
    /** 父级菜单ID */
    parentId?: number;
    /** 菜单图标 */
    icon?: React.ReactNode;
    /** 路由地址 */
    path?: string;
    /** 权限编码 */
    code?: string;
    /** 组件路径 */
    component?: string;
    /** 子菜单 */
    children?: MenuItem[] | null;
}

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
 * 获取菜单项的层级映射
 * @param items 菜单项列表
 * @returns 键值对映射，key为菜单项key，value为层级
 */
export const getLevelKeys = (items: MenuItem[]): Record<string, number> => {
    const levelMap: Record<string, number> = {};

    const traverse = (menuItems: MenuItem[], level = 1) => {
        menuItems.forEach((item) => {
            if (item.key) {
                levelMap[item.key] = level;
            }
            if (item.children) {
                traverse(item.children, level + 1);
            }
        });
    };

    traverse(items);
    return levelMap;
};

/**
 * 递归获取所有菜单项的id
 * @param menuList 菜单列表
 * @returns 所有id的数组
 */
export function getAllMenuIds(menuList: MenuItem[]): number[] {
    const ids: number[] = [];

    const traverse = (items: MenuItem[]) => {
        items.forEach((item) => {
            if (item.id !== undefined) {
                ids.push(item.id);
            }
            if (item.children && item.children.length > 0) {
                traverse(item.children);
            }
        });
    };

    traverse(menuList);
    return ids;
}

/**
 * 收集所有 type === 'button' 的菜单项
 * @param menuList 菜单列表
 * @returns 按钮类型的菜单项数组
 */
export function collectButtonItems(menuList: MenuItem[]): MenuItem[] {
    const result: MenuItem[] = [];
    const stack: MenuItem[] = [...menuList];

    while (stack.length) {
        const current = stack.pop() as MenuItem;
        if (current.type === "button") {
            result.push(current);
        }
        const children = current.children;
        if (children && children.length) {
            stack.push(...children);
        }
    }

    return result;
}
