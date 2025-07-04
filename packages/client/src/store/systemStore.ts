import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * 系统设置 Store 的状态类型定义
 * 包含主题、语言等全局配置项
 */
type State = {
    /** 当前主题（如 light/dark） */
    theme: string;
    /** 当前语言（如 zh/en） */
    lang: string;
};

/**
 * 系统设置 Store 的操作方法类型定义
 */
type Action = {
    /** 设置系统语言 */
    setLang: (lang: string) => void;
    /** 设置系统主题 */
    setTheme: (theme: string) => void;
    /** 重置系统设置为默认值，并清除本地存储 */
    resetSystemStore: () => void;
    /** 仅清除本地存储中的系统设置 */
    removeSystemStore: () => void;
};

/**
 * 系统设置 Store，管理全局主题和语言，支持持久化与重置
 */
export const useSystemStore = create<State & Action>()(
    persist(
        (set, get) => ({
            theme: "light", // 默认主题
            lang: "zh", // 默认语言
            setLang: (lang: string) => set({ lang: lang }),
            setTheme: (theme: string) => set({ theme: theme }),
            /**
             * 重置系统设置为默认值，并清除本地存储
             */
            resetSystemStore: () => {
                set({ theme: "light", lang: "zh" });
                get().removeSystemStore();
            },
            /**
             * 仅清除本地存储中的系统设置
             */
            removeSystemStore: () => {
                localStorage.removeItem("systemStore");
            },
        }),
        {
            name: "systemStore", // localStorage 的 key
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
