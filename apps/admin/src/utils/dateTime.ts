import dayjs from "dayjs";

/**
 * 格式化时间为完整的日期时间格式
 * @param time 时间字符串或undefined
 * @returns 格式化后的时间字符串 (YYYY-MM-DD HH:mm:ss) 或 "-"
 */
export const formatTime = (time: string | undefined): string => {
    if (!time) return "-";
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};

/**
 * 格式化日期为日期格式
 * @param time 时间字符串或undefined
 * @returns 格式化后的日期字符串 (YYYY-MM-DD) 或 "-"
 */
export const formatDate = (time: string | undefined): string => {
    if (!time) return "-";
    return dayjs(time).format("YYYY-MM-DD");
};
