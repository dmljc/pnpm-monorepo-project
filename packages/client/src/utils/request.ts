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
    interface PendingTask {
        config: AxiosRequestConfig;
        resolve: (value?: unknown) => void;
    }

    let refreshing = false;
    const queue: PendingTask[] = [];

    const refreshToken = async () => {
        const res = await axios.get("http://localhost:3000/api/user/refresh", {
            params: {
                refresh_token: localStorage.getItem("refresh_token"),
            },
        });

        localStorage.setItem("access_token", res.data.data.access_token);
        localStorage.setItem("refresh_token", res.data.data.refresh_token);
        return res;
    };

    // 添加请求拦截器
    instance.interceptors.request.use(
        (config) => {
            const accessToken = localStorage.getItem("access_token");
            if (accessToken) {
                config.headers.Authorization = "Bearer " + accessToken;
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
            const access_token = data.data.access_token;
            if (access_token) {
                config.headers.Authorization = "Bearer " + access_token;
            }

            if (!data?.success) {
                message.error(data?.message);
            }

            return data;
        },
        async (error) => {
            const data = error?.response?.data;
            const config = error?.response?.config;

            if (refreshing && !config.url.includes("/user/refresh")) {
                return new Promise((resolve) => {
                    queue.push({
                        config,
                        resolve,
                    });
                });
            }

            if (data.code === 401 && !config.url.includes("/user/refresh")) {
                refreshing = true;

                const res = await refreshToken();
                const newAccessToken = res.data.data.access_token;

                refreshing = false;

                if (res.status === 200) {
                    queue.forEach(({ config, resolve }) => {
                        if (config.headers) {
                            config.headers.Authorization = `Bearer ${newAccessToken}`;
                        }

                        resolve(axios(config));
                    });
                    config.headers.Authorization = `Bearer ${newAccessToken}`;

                    return axios(config);
                } else {
                    message.error("登录过期，请重新登录");
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("pro-table-singe-demos");
                    window.location.href = "/login";
                    return Promise.reject(res.data);
                }
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
