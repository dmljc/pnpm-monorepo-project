import dayjs from "dayjs";

/**
 * 格式化时间
 * @param time 时间
 * @returns 格式化后的时间
 */
export const formatTime = (time: string | undefined) => {
    if (!time) return "-";
    return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
};

/**
 * 格式化日期
 * @param time 时间
 * @returns 格式化后的日期
 */
export const formatDate = (time: string | undefined) => {
    if (!time) return "-";
    return dayjs(time).format("YYYY-MM-DD");
};
