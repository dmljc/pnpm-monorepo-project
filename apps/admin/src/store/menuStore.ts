// 第三方库
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 类型定义
import type { MenuItem } from "@/layout/utils";

// 工具/常量
import {
    processMenuChildren,
    convertMenuListToMenuItems,
    collectButtonItems,
} from "@/layout/utils";

// API 调用
import { menuMeList, menuList } from "./api";

/**
 * 菜单状态类型
 */
type State = {
    // 当前登录用户的原始菜单列表
    menuMeOriginList: MenuItem[];
    // 当前登录用户的菜单列表（已转换）
    menuMeList: MenuItem[];
    // 当前登录用户的按钮列表
    menuMeButtonList: MenuItem[];

    // 所有菜单列表
    menuOriginList: MenuItem[];
};

/**
 * 菜单操作方法类型
 */
type Action = {
    /**
     * 获取当前登录用户的菜单列表
     */
    getMenuMeList: () => void;
    /**
     * 设置原始菜单列表
     * @param menuMeOriginList 原始菜单列表
     */
    setMenuMeOriginList: (menuMeOriginList: MenuItem[]) => void;
    /**
     * 设置菜单列表
     * @param menuList 新的菜单列表
     */
    setMenuMeList: (menuMeList: MenuItem[]) => void;
    /**
     * 重置菜单列表
     */
    resetMenuMeList: () => void;
    /**
     * 仅清除本地存储中的菜单列表
     */
    removeMenuMeList: () => void;
    /**
     * 设置所有菜单列表
     * @param menuOriginList 所有菜单列表
     */
    setMenuOriginList: (menuOriginList: MenuItem[]) => void;
    /**
     * 重置所有菜单列表
     */
    resetMenuOriginList: () => void;
    /**
     * 仅清除本地存储中的所有菜单列表
     */
    removeMenuOriginList: () => void;
    /**
     * 获取所有菜单列表
     */
    getMenuOriginList: () => void;
};

/**
 * 菜单store，包含菜单的增删查改等操作
 */
export const useMenuStore = create<State & Action>()(
    persist(
        (set, get) => ({
            menuMeOriginList: [],
            menuMeList: [],
            menuMeButtonList: [],
            menuOriginList: [],
            getMenuMeList: async () => {
                const res = await menuMeList();
                if (res.success) {
                    // 处理原始数据，将空的children数组转换为null
                    const processedData = processMenuChildren(res.data);

                    set({
                        menuMeOriginList: processedData,
                        menuMeList: convertMenuListToMenuItems(processedData),
                    });

                    // 获取菜单数据后，同时更新按钮列表
                    const menuMeButtonList = collectButtonItems(processedData);
                    set({ menuMeButtonList });
                }
            },
            setMenuMeList: (menuMeList) => set({ menuMeList }),
            setMenuMeOriginList: (menuMeOriginList) =>
                set({ menuMeOriginList }),
            resetMenuMeList: () => {
                set({ menuMeList: [] });
                get().removeMenuMeList();
            },
            removeMenuMeList: () => {
                localStorage.removeItem("menuStore");
            },
            setMenuOriginList: (menuOriginList) => set({ menuOriginList }),
            resetMenuOriginList: () => {
                set({ menuOriginList: [] });
                get().removeMenuOriginList();
            },
            removeMenuOriginList: () => {
                localStorage.removeItem("menuStore");
            },
            getMenuOriginList: async () => {
                const res = await menuList();
                if (res.success) {
                    set({ menuOriginList: res.data });
                }
            },
        }),
        {
            name: "menuStore", // 本地存储的key
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
