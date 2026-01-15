/**
 * 将权限字符串转换为数字数组
 * @param permission 权限字符串
 * @returns 数字数组
 */
export const formatStringToNumberArray = (permission?: string | number[]) => {
    if (!permission) return [];
    if (Array.isArray(permission)) return permission;
    return permission
        .split(",")
        .filter((id) => id.trim() !== "")
        .map((id) => parseInt(id.trim()));
};
