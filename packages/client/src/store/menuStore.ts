import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { convertMenuListToMenuItems } from "@/layout/utils";
import type { LevelKeysProps } from "@/layout/utils";
import { menuListApi } from "./api";

/**
 * 菜单项类型定义
 */
export interface Item {
    id: number; // 菜单唯一标识
    name: string; // 菜单名称
    type: string; // 菜单类型（如目录、菜单、按钮等）
    parentId?: string; // 父级菜单ID
    icon?: string; // 菜单图标
    url?: string; // 路由地址
    code?: string; // 权限编码
    component?: string; // 组件路径
    children?: Item[]; // 子菜单
}

/**
 * 菜单状态类型
 */
type State = {
    menuList: LevelKeysProps[]; // 菜单列表（已转换）
};

/**
 * 菜单操作方法类型
 */
type Action = {
    /**
     * 获取菜单列表
     */
    getMenuList: () => void;
    /**
     * 设置菜单列表
     * @param menuList 新的菜单列表
     */
    setMenuList: (menuList: Item[]) => void;
    /**
     * 重置菜单列表
     */
    resetMenuList: () => void;
};

/**
 * 菜单store，包含菜单的增删查改等操作
 */
export const useMenuStore = create<State & Action>()(
    persist(
        (set) => ({
            menuList: [],
            getMenuList: async () => {
                const res = await menuListApi();
                if (res.success) {
                    set({ menuList: convertMenuListToMenuItems(res.data) });
                }
            },
            setMenuList: (menuList) => set({ menuList }),
            resetMenuList: () => {
                set({ menuList: [] });
            },
        }),
        {
            name: "menuStore", // 本地存储的key
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
