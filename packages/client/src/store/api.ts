import { request } from "@/utils/request";

/**
 * 用户登录
 * @param data 登录数据（包含用户名、密码等）
 * @returns 登录结果
 */
export const authLogin = (data: any): Promise<any> => {
    return request.post("/auth/login", data);
};

/**
 * 获取当前用户的菜单列表
 * @returns 当前用户有权限的菜单列表
 */
export const menuMeList = (): Promise<any> => {
    return request.get("/menu/me/list");
};

/**
 * 获取所有菜单列表（管理员用）
 * @returns 系统中所有菜单列表
 */
export const menuList = (): Promise<any> => {
    return request.get("/menu/list");
};
