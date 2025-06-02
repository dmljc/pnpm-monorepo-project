import { message } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * API基础URL配置
 * @constant
 * @type {string}
 */
export const baseURL = "http://localhost:3000/api";

/**
 * 默认请求超时时间(毫秒)
 * @constant
 * @type {number}
 */
const DEFAULT_TIMEOUT = 1000 * 30;

/**
 * 待处理任务接口定义
 * @interface
 */
interface PendingTask {
    /** 请求配置 */
    config: AxiosRequestConfig;
    /** Promise解决函数 */
    resolve: (value?: unknown) => void;
}

/**
 * Token服务接口定义
 * @interface
 */
interface TokenServiceType {
    /** 获取访问令牌 */
    getAccessToken: () => string | null;
    /** 获取刷新令牌 */
    getRefreshToken: () => string | null;
    /**
     * 设置令牌
     * @param {string} accessToken - 访问令牌
     * @param {string} refreshToken - 刷新令牌
     */
    setTokens: (accessToken: string, refreshToken: string) => void;
    /** 移除所有令牌 */
    removeTokens: () => void;
}

/**
 * Token服务实现
 * @constant
 * @type {TokenServiceType}
 */
const TokenService: TokenServiceType = {
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

/**
 * 处理未授权错误并重试请求
 * @async
 * @function
 * @param {AxiosRequestConfig} config - 原始请求配置
 * @param {Function} refreshToken - 刷新令牌函数
 * @param {PendingTask[]} queue - 待处理请求队列
 * @returns {Promise<any>} 重试后的请求结果
 */
const handleUnauthorizedError = async (
    config: AxiosRequestConfig,
    refreshToken: () => Promise<any>,
    queue: PendingTask[],
) => {
    try {
        const res = await refreshToken();
        const newAccessToken = res.data.data.access_token;

        queue.forEach(({ config, resolve }) => {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(axios(config));
        });

        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(config);
    } catch (err) {
        message.error("登录过期，请重新登录");
        TokenService.removeTokens();
        window.location.href = "/login";
        return Promise.reject(err);
    }
};

/**
 * 创建带有拦截器的Axios实例
 * @function
 * @param {AxiosRequestConfig} [config] - 可选的自定义配置
 * @returns {AxiosInstance} 配置好的Axios实例
 */
export const createAxiosByinterceptors = (
    config?: AxiosRequestConfig,
): AxiosInstance => {
    const instance = axios.create({
        baseURL,
        timeout: DEFAULT_TIMEOUT,
        ...config,
    });

    /** @type {boolean} 是否正在刷新令牌标志 */
    const refreshing = false;
    /** @type {PendingTask[]} 待处理请求队列 */
    const queue: PendingTask[] = [];

    /**
     * 刷新令牌函数
     * @async
     * @function
     * @returns {Promise<any>} 刷新令牌的响应结果
     */
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
            if (data.success && data.success === false) {
                message.error(`${data.message || ""}请求失败`);
            }

            return data;
        },
        async (error) => {
            const { config, response } = error || {};
            const { status, data } = response || {};
            const isRefreshRequest = config?.url?.includes("/user/refresh");

            if (refreshing && !isRefreshRequest) {
                return new Promise((resolve) => {
                    queue.push({ config, resolve });
                });
            }
            // status === 401 业务接口返回 401 错误
            // data?.code === 401 第三方接口返回 401 错误，比如QQ登录
            if ((status === 401 || data?.code === 401) && !isRefreshRequest) {
                return handleUnauthorizedError(config, refreshToken, queue);
            }

            return Promise.reject(error);
        },
    );

    return instance;
};

/**
 * 默认导出的请求实例
 * @constant
 * @type {AxiosInstance}
 */
export const request = createAxiosByinterceptors();
