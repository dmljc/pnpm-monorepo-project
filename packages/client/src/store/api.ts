import { request } from "@/utils/request";

/**
 * userStore
 * 登录
 * @param data 登录数据
 * @returns 登录结果
 */
export const authLogin = (data: any): Promise<any> => {
    return request.post("/auth/login", data);
};

/**
 * userStore
 * 获取用户信息
 * @param accessToken 访问令牌
 * @returns 用户信息
 */
export const userInfoApi = (accessToken: string): Promise<any> => {
    return request.get("/user/info", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

/**
 * menuStore
 * 获取菜单列表
 * @returns 菜单列表
 */
export const menuListApi = (): Promise<any> => {
    return request.get("/menu/list", {});
};
