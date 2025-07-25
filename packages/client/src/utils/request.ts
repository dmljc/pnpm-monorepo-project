import { message } from "antd";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useUserStore, useSystemStore } from "@/store";

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
 * 认证服务接口定义
 * @interface
 */
interface AuthServiceType {
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
    /** 移除所有认证信息（令牌和用户信息） */
    removeAuth: () => void;
}

/**
 * 认证服务实现，统一管理 token 及用户信息
 * @constant
 * @type {AuthServiceType}
 */
const AuthService: AuthServiceType = {
    getAccessToken: () => {
        const { accessToken } = useUserStore.getState();
        return accessToken;
    },
    getRefreshToken: () => {
        const { refreshToken } = useUserStore.getState();
        return refreshToken;
    },
    setTokens: (accessToken: string, refreshToken: string) => {
        const { setAccessToken, setRefreshToken } = useUserStore.getState();
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    },
    removeAuth: () => {
        const { resetUserStore } = useUserStore.getState();
        resetUserStore();
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
    handleRefreshToken: () => Promise<any>,
    queue: PendingTask[],
) => {
    try {
        const res = await handleRefreshToken();
        const newAccessToken = res.data.data.accessToken;

        queue.forEach(({ config, resolve }) => {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            resolve(axios(config).then((r) => r.data));
        });

        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(config).then((r) => r.data); // 关键：只返回后端 data
    } catch (err) {
        message.error("登录过期，请重新登录");
        AuthService.removeAuth();
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
    const handleRefreshToken = async () => {
        const res = await axios.get(`${baseURL}/user/refresh`, {
            params: {
                refreshToken: AuthService.getRefreshToken(),
            },
        });

        const { accessToken, refreshToken } = res.data.data;
        AuthService.setTokens(accessToken, refreshToken);
        return res;
    };

    // 请求拦截器
    instance.interceptors.request.use(
        (config) => {
            const { getAccessToken } = AuthService;
            const { lang } = useSystemStore.getState();
            const accessToken = getAccessToken();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            if (lang) {
                config.headers["x-custom-lang"] = lang;
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
            const accessToken = data.data?.accessToken;

            if (accessToken) {
                response.headers.Authorization = `Bearer ${accessToken}`;
            }
            if (data.success === false) {
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
                if (data?.message?.includes("禁用")) {
                    message.error(data.message);
                    AuthService.removeAuth();
                    return Promise.reject(error);
                }
                return handleUnauthorizedError(
                    config,
                    handleRefreshToken,
                    queue,
                );
            }

            if (status === 400) {
                message.error(data.message);
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
