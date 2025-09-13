import { useMenuStore } from "@/store/menuStore";
// 自定义 hook 判断是否有权限
const usePermission = (code: string) => {
    const buttonList = useMenuStore()?.menuMeButtonList;
    return buttonList?.some((item) => item.code === code);
};

export { usePermission };
