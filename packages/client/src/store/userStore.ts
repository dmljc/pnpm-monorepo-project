import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "./interface";
import { authLogin } from "./api";
import { useSystemStore } from "./systemStore";
import { useMenuStore } from "./menuStore";

interface LogigParams {
    login: string;
    code: string;
}

/**
 * 用户状态类型，包含用户信息和 Token
 */
type UserState = {
    /** 当前用户信息，初始为 null */
    userInfo: User | null;
    /** 是否有通知 */
    hasNotification: boolean;
    /** 当前访问令牌，初始为 null */
    accessToken: string | null;
    /** 当前刷新令牌，初始为 null */
    refreshToken: string | null;
};

/**
 * 用户操作方法类型
 */
type UserAction = {
    /** 设置用户信息 */
    setUserInfo: (userInfo: User | null) => void;
    /** 设置是否有通知 */
    setHasNotification: (hasNotification: boolean) => void;
    /** 设置访问令牌 */
    setAccessToken: (accessToken: string | null) => void;
    /** 设置刷新令牌 */
    setRefreshToken: (refreshToken: string | null) => void;
    /** 登录方法，设置用户信息 */
    login: (params: LogigParams) => Promise<boolean>;
    /** 退出登录方法，重置用户状态 */
    logout: () => void;
    /** 重置 Store 状态方法 */
    resetUserStore: () => void;
    /** 仅清除本地存储中的用户数据 */
    removeUserStore: () => void;
};

/**
 * 用户 Store，包含用户信息和 token 的持久化管理
 * 使用 zustand + persist 插件实现本地存储
 */
export const useUserStore = create<UserState & UserAction>()(
    persist(
        (set, get) => ({
            /** 当前用户信息，初始为 null */
            userInfo: null,
            /** 是否有通知 */
            hasNotification: false,
            /** 当前访问令牌，初始为 null */
            accessToken: null,
            /** 当前刷新令牌，初始为 null */
            refreshToken: null,

            /** 设置用户信息 */
            setUserInfo: (userInfo: User | null) => set({ userInfo }),
            /** 设置访问令牌 */
            setAccessToken: (accessToken: string | null) =>
                set({ accessToken }),
            /** 设置刷新令牌 */
            setRefreshToken: (refreshToken: string | null) =>
                set({ refreshToken }),

            /** 登录方法，设置用户信息 */
            login: async (params: LogigParams): Promise<boolean> => {
                const res = await authLogin(params);
                if (res.success) {
                    const { userInfo, accessToken, refreshToken } = res.data;
                    set({
                        userInfo,
                        accessToken,
                        refreshToken,
                    });
                    useSystemStore.setState({ lang: "zh", theme: "light" });
                    useMenuStore.getState().getMenuList();
                    return true;
                } else {
                    return false;
                }
            },
            setHasNotification: (hasNotification: boolean) =>
                set({ hasNotification }),
            /**
             * 退出登录方法
             * 会调用 resetUserStore 重置所有用户相关状态
             */
            logout: () => {
                get().resetUserStore();
                useSystemStore.getState().resetSystemStore();
                useMenuStore.getState().resetMenuList();
                localStorage.removeItem("pro-table-singe-demos");
            },

            /**
             * 重置 Store 状态方法
             * 将所有用户相关状态重置为初始值，并移除 localStorage 中的 userStore 数据
             */
            resetUserStore: () => {
                set({
                    userInfo: null,
                    accessToken: null,
                    refreshToken: null,
                    hasNotification: false, // 这里重置
                });
                get().removeUserStore();
            },

            /**
             * 仅清除本地存储中的用户数据
             * 不会重置用户状态，仅移除 localStorage 中的数据
             */
            removeUserStore: () => {
                localStorage.removeItem("userStore");
            },
        }),
        {
            name: "userStore", // localStorage 的 key，唯一标识
            storage: createJSONStorage(() => localStorage), // 使用 localStorage 持久化
        },
    ),
);
