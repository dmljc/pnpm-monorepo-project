import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SystemConfig {
    logo: string;
    name: string;
    description: string;
    copyright: string;
    icp: string;
    id?: number;
}

/**
 * 系统设置 Store 的状态类型定义
 * 包含主题、语言等全局配置项
 */
type State = {
    /** 当前主题（如 light/dark） */
    theme: string;
    /** 当前语言（如 zh/en） */
    lang: string;
    /** 系统配置 */
    systemConfig: SystemConfig;
    /** 设置系统配置 */
    setSystemConfig: (systemConfig: SystemConfig) => void;
};

/**
 * 系统设置 Store 的操作方法类型定义
 */
type Action = {
    /** 设置系统语言 */
    setLang: (lang: string) => void;
    /** 设置系统主题 */
    setTheme: (theme: string) => void;
    /** 设置系统配置 */
    setSystemConfig: (systemConfig: SystemConfig) => void;
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
            // 默认主题
            theme: "light",
            // 默认语言
            lang: "zh",
            // 系统配置
            systemConfig: {
                logo: "",
                name: "",
                description: "",
                copyright: "",
                icp: "",
            },
            // 设置系统语言
            setLang: (lang: string) => set({ lang: lang }),
            // 设置系统主题
            setTheme: (theme: string) => set({ theme: theme }),
            // 设置系统配置
            setSystemConfig: (systemConfig: SystemConfig) =>
                set({ systemConfig: systemConfig }),
            // 重置系统设置为默认值，并清除本地存储
            /**
             * 重置系统设置为默认值，并清除本地存储
             */
            resetSystemStore: () => {
                set({
                    theme: "light",
                    lang: "zh",
                    systemConfig: {
                        logo: "",
                        name: "",
                        description: "",
                        copyright: "",
                        icp: "",
                    },
                });
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
