import { message } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// 定义基础配置
export const baseURL = "http://localhost:3000/api";
const DEFAULT_TIMEOUT = 30000; // qq 邮箱接口响应比较慢，所以超时时间设置的稍微长点

// 定义接口类型
interface PendingTask {
    config: AxiosRequestConfig;
    resolve: (value?: unknown) => void;
}

// Token相关操作封装
const TokenService = {
    getAccessToken: () => localStorage.getItem("access_token"),
    getRefreshToken: () => localStorage.getItem("refresh_token"),
    setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
    },
    removeTokens: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("pro-table-singe-demos");
    },
};

export const createAxiosByinterceptors = (
    config?: AxiosRequestConfig,
): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        timeout: DEFAULT_TIMEOUT,
        ...config,
    });

    let refreshing = false;
    const queue: PendingTask[] = [];

    const refreshToken = async () => {
        const res = await axios.get(`${baseURL}/user/refresh`, {
            params: {
                refresh_token: TokenService.getRefreshToken(),
            },
        });

        const { access_token, refresh_token } = res.data.data;
        TokenService.setTokens(access_token, refresh_token);
        return res;
    };

    // 请求拦截器
    instance.interceptors.request.use(
        (config) => {
            const accessToken = TokenService.getAccessToken();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            message.error("网络错误，请稍后重试");
            return Promise.reject(error);
        },
    );

    // 响应拦截器
    instance.interceptors.response.use(
        (response) => {
            const { data } = response;
            const accessToken = data.data?.access_token;

            if (accessToken) {
                response.headers.Authorization = `Bearer ${accessToken}`;
            }

            if (!data?.success) {
                message.error(`${data?.message}请求失败`);
            }

            return data;
        },
        async (error) => {
            const { data, status, statusText, config } = error.response || {};
            const isRefreshRequest = config?.url?.includes("/user/refresh");

            if (refreshing && !isRefreshRequest) {
                return new Promise((resolve) => {
                    queue.push({ config, resolve });
                });
            }

            // 第三方邮箱授权失败
            if (status === 401 && statusText === "Unauthorized") {
                const msg = "邮箱登录失败，请重新登录";
                message.error(msg);
                return Promise.resolve({
                    code: 401,
                    message: msg,
                    success: false,
                });
            }

            if (data?.code === 401 && !isRefreshRequest) {
                refreshing = true;

                try {
                    const res = await refreshToken();
                    const newAccessToken = res.data.data.access_token;
                    refreshing = false;

                    if (res.status === 200) {
                        // 重试队列中的请求
                        queue.forEach(({ config, resolve }) => {
                            if (config.headers) {
                                config.headers.Authorization = `Bearer ${newAccessToken}`;
                            }
                            resolve(axios(config));
                        });

                        config.headers.Authorization = `Bearer ${newAccessToken}`;
                        return axios(config);
                    }
                } catch (err) {
                    refreshing = false;
                    message.error("登录过期，请重新登录");
                    TokenService.removeTokens();
                    window.location.href = "/login";
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        },
    );

    return instance;
};

export const request = createAxiosByinterceptors();
