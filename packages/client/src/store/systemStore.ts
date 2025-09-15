import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// 类型定义
interface SystemConfig {
    /** 系统logo */
    logo: string;
    /** 系统名称 */
    name: string;
    /** 系统描述 */
    description: string;
    /** 系统版权 */
    copyright: string;
    /** 系统icp */
    icp: string;
    /** 系统id */
    id?: number;
}

/**
 * 系统设置 Store 的状态类型定义
 * 包含主题、语言、全屏等全局配置项
 */
type State = {
    /** 当前主题（如 light/dark） */
    theme: string;
    /** 当前语言（如 zh/en） */
    lang: string;
    /** 是否全屏显示 */
    isFullscreen: boolean;
    /** 系统配置 */
    systemConfig: SystemConfig;
};

/**
 * 系统设置 Store 的操作方法类型定义
 */
type Action = {
    /** 设置系统语言 */
    setLang: (lang: string) => void;
    /** 设置系统主题 */
    setTheme: (theme: string) => void;
    /** 切换全屏状态 */
    toggleFullscreen: () => void;
    /** 进入全屏 */
    enterFullscreen: () => void;
    /** 退出全屏 */
    exitFullscreen: () => void;
    /** 监听浏览器全屏状态变化 */
    syncFullscreenState: () => void;
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
            // 默认非全屏
            isFullscreen: false,
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
            // 切换全屏状态
            toggleFullscreen: () => {
                const { isFullscreen } = get();
                set({ isFullscreen: !isFullscreen });

                // 是全屏则退出全屏，否则进入全屏
                if (isFullscreen) {
                    document.exitFullscreen?.();
                } else {
                    document.documentElement.requestFullscreen?.();
                }
            },
            // 进入全屏
            enterFullscreen: () => {
                set({ isFullscreen: true });
                document.documentElement.requestFullscreen?.();
            },
            // 退出全屏
            exitFullscreen: () => {
                set({ isFullscreen: false });
                document.exitFullscreen?.();
            },
            // 同步浏览器全屏状态
            syncFullscreenState: () => {
                set({ isFullscreen: !!document.fullscreenElement });
            },
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
                    isFullscreen: false,
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
