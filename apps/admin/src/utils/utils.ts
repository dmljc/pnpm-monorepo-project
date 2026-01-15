import { useMenuStore } from "@/store/menuStore";

/**
 * 自定义 Hook - 判断当前用户是否有指定权限
 * @param code 权限编码
 * @returns 是否有权限
 */
const usePermission = (code: string): boolean => {
    const buttonList = useMenuStore()?.menuMeButtonList;
    return buttonList?.some((item) => item.code === code) ?? false;
};

export { usePermission };
