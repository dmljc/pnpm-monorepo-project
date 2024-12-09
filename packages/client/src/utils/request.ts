import { message } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const createAxiosByinterceptors = (
    config?: AxiosRequestConfig,
): AxiosInstance => {
    const instance = axios.create({
        timeout: 1000, //超时配置
        // withCredentials: true, //跨域携带cookie
        ...config, // 自定义配置覆盖基本配置
    });

    // 添加请求拦截器
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = "Bearer " + token;
            }
            return config;
        },
        (error) => {
            message.error("网络错误，请稍后重试");
            return Promise.reject(error);
        },
    );

    // 添加响应拦截器
    instance.interceptors.response.use(
        (config) => {
            const { data } = config;
            const token = data.data;
            if (token) {
                config.headers.Authorization = "Bearer " + token;
            }

            if (!data?.success) {
                message.error(data?.message);
            }

            return data;
        },
        (error) => {
            const data = error?.response?.data;

            if (!data) {
                message.error("网络异常");
            }

            if (data?.success === false) {
                message.error(data?.message);
            }

            // token 失效，跳转到登录页面
            if (data.code === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("pro-table-singe-demos");
                window.location.href = "/login";
            }

            return Promise.reject(error);
        },
    );
    return instance;
};

export const baseURL = "http://localhost:3000/api";

export const request = createAxiosByinterceptors({
    baseURL: baseURL,
    timeout: 3000,
});
