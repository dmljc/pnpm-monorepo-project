import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "./interface";

type UserStoreState = {
    userInfo: User | null;
    accessToken: string;
    refreshToken: string;
    setUserInfo: (userInfo: User) => void;
    setAccessToken: (accessToken: string) => void;
    setRefreshToken: (refreshToken: string) => void;
    login: (userInfo: User) => void;
    logout: () => void;
};

export const useUserStore = create<UserStoreState>()(
    persist(
        (set) => ({
            userInfo: null,
            accessToken: "",
            refreshToken: "",

            setUserInfo: (userInfo: User) => set({ userInfo }),
            setAccessToken: (accessToken: string) => set({ accessToken }),
            setRefreshToken: (refreshToken: string) => set({ refreshToken }),

            login: (userInfo: User) => set({ userInfo }),
            logout: () => set({ userInfo: null }),
        }),
        {
            name: "user", // 唯一名称 localstorage 的 key
        },
    ),
);
