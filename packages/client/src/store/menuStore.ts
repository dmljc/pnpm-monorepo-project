import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { convertMenuListToMenuItems } from "@/layout/utils";
import type { MenuItem } from "@/layout/utils";
import { menuListApi } from "./api";

/**
 * 菜单状态类型
 */
type State = {
    menuList: MenuItem[]; // 菜单列表（已转换）
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
    setMenuList: (menuList: MenuItem[]) => void;
    /**
     * 重置菜单列表
     */
    resetMenuList: () => void;
    /**
     * 仅清除本地存储中的菜单列表
     */
    removeMenuList: () => void;
};

/**
 * 菜单store，包含菜单的增删查改等操作
 */
export const useMenuStore = create<State & Action>()(
    persist(
        (set, get) => ({
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
                get().removeMenuList();
            },
            removeMenuList: () => {
                localStorage.removeItem("menuStore");
            },
        }),
        {
            name: "menuStore", // 本地存储的key
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
