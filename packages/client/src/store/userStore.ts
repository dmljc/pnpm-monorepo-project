import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "./interface";

/**
 * 用户 Store 的状态类型定义
 * 包含用户信息、token 及相关操作方法
 */
type UserStoreState = {
    /** 用户信息对象，未登录时为 null */
    userInfo: User | null;
    /** 访问令牌，未登录时为 null */
    accessToken: string | null;
    /** 刷新令牌，未登录时为 null */
    refreshToken: string | null;
    /** 设置用户信息 */
    setUserInfo: (userInfo: User | null) => void;
    /** 设置访问令牌 */
    setAccessToken: (accessToken: string | null) => void;
    /** 设置刷新令牌 */
    setRefreshToken: (refreshToken: string | null) => void;
    /** 登录方法，设置用户信息 */
    login: (userInfo: User) => void;
    /** 退出登录方法，重置用户状态 */
    logout: () => void;
    /** 重置 Store 状态方法 */
    resetUserStore: () => void;
};

/**
 * 用户 Store，包含用户信息和 token 的持久化管理
 * 使用 zustand + persist 插件实现本地存储
 */
export const useUserStore = create<UserStoreState>()(
    persist(
        (set, get) => ({
            /** 当前用户信息，初始为 null */
            userInfo: null,
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
            login: (userInfo: User) => set({ userInfo }),
            /**
             * 退出登录方法
             * 会调用 resetUserStore 重置所有用户相关状态
             */
            logout: () => {
                get().resetUserStore();
            },

            /**
             * 重置 Store 状态方法
             * 将所有用户相关状态重置为初始值，并移除 localStorage 中的 user 数据
             */
            resetUserStore: () => {
                set({
                    userInfo: null,
                    accessToken: null,
                    refreshToken: null,
                });
                localStorage.removeItem("user"); // 移除 localstorage 中的 user 数据
            },
        }),
        {
            name: "user", // localStorage 的 key，唯一标识
            storage: createJSONStorage(() => localStorage), // 使用 localStorage 持久化
        },
    ),
);
