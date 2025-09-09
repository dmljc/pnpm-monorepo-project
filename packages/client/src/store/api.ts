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
 * menuStore
 * 获取当前账号的菜单列表
 * @returns 菜单列表
 */
export const menuMeList = (): Promise<any> => {
    return request.get("/menu/me/list");
};

/**
 * menuStore
 * 获取所有菜单列表
 * @returns 菜单列表
 */
export const menuList = (): Promise<any> => {
    return request.get("/menu/list");
};
