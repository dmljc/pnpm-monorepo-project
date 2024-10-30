import { message } from 'antd';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export const createAxiosByinterceptors = (config?: AxiosRequestConfig): AxiosInstance => {
    const instance = axios.create({
        timeout: 1000, //超时配置
        // withCredentials: true, //跨域携带cookie
        ...config // 自定义配置覆盖基本配置
    });

    // 添加请求拦截器
    instance.interceptors.request.use(
        (config) => {
            const token = '222';
            config.headers.authorization = 'Bearer ' + token;
            return config;
        },
        (error) => {
            message.error('网络错误，请稍后重试');
            return Promise.reject(error);
        }
    );

    // 添加响应拦截器
    instance.interceptors.response.use(
        (config) => {
            const { data } = config;
            if (data?.success === false) {
                message.error(data?.message);
            }

            return data;
        },
        (error) => {
            const { response } = error;
            const { data } = response;
            if (data?.success === false) {
                message.error(data?.message);
            }

            return Promise.reject(error);
        }
    );
    return instance;
};

export const request = createAxiosByinterceptors({
    baseURL: 'http://localhost:3000/api',
    timeout: 3000,
});