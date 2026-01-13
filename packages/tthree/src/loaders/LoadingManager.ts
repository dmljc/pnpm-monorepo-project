import { LoadingManager as ThreeLoadingManager } from "three";

/**
 * 加载进度信息
 */
export interface LoadingProgress {
    /** 正在加载的资源 URL */
    url: string;
    /** 已加载的资源数量 */
    loaded: number;
    /** 总资源数量 */
    total: number;
    /** 加载进度百分比 (0-100) */
    progress: number;
}

/**
 * 加载管理器配置选项
 */
export interface LoadingManagerConfig {
    /** 加载开始回调 */
    onStart?: (url: string, loaded: number, total: number) => void;
    /** 加载进度回调 */
    onProgress?: (progress: LoadingProgress) => void;
    /** 加载完成回调 */
    onLoad?: () => void;
    /** 加载错误回调 */
    onError?: (url: string, error?: Error) => void;
    /** URL 修改器（用于路径转换） */
    urlModifier?: (url: string) => string;
}

/**
 * 加载管理器类：负责管理资源加载进度、回调和统计信息
 *
 * ## 使用示例
 *
 * ```typescript
 * import { LoadingManager } from 'tthree';
 *
 * // 创建加载管理器
 * const loadingManager = new LoadingManager({
 *   onStart: (url, loaded, total) => {
 *     console.log(`开始加载: ${url}`);
 *   },
 *   onProgress: (progress) => {
 *     console.log(`加载进度: ${progress.progress}%`);
 *     // 更新进度条
 *     updateProgressBar(progress.progress);
 *   },
 *   onLoad: () => {
 *     console.log('所有资源加载完成');
 *   },
 *   onError: (url, error) => {
 *     console.error(`加载失败: ${url}`, error);
 *   }
 * });
 *
 * // 获取 Three.js LoadingManager 实例
 * const manager = loadingManager.getManager();
 *
 * // 使用 manager 加载资源
 * const loader = new GLTFLoader(manager);
 * ```
 */
export class LoadingManager {
    /** Three.js 加载管理器实例 */
    private manager: ThreeLoadingManager;

    /** 配置选项 */
    private config: LoadingManagerConfig;

    /** 是否正在加载 */
    private isLoading: boolean = false;

    /** 加载统计信息 */
    private stats = {
        totalItems: 0,
        loadedItems: 0,
        errorItems: 0,
        startTime: 0,
        endTime: 0,
    };

    /**
     * 创建 LoadingManager 实例
     *
     * @param config - 加载管理器配置选项
     */
    constructor(config: LoadingManagerConfig = {}) {
        this.config = config;
        this.manager = new ThreeLoadingManager();

        this.setupCallbacks();
    }

    /**
     * 设置加载管理器的回调函数
     */
    private setupCallbacks(): void {
        // 开始加载回调
        this.manager.onStart = (url: string, loaded: number, total: number) => {
            this.isLoading = true;
            this.stats.totalItems = total;
            this.stats.loadedItems = loaded;
            this.stats.startTime = performance.now();

            this.config.onStart?.(url, loaded, total);
        };

        // 加载进度回调
        this.manager.onProgress = (
            url: string,
            loaded: number,
            total: number,
        ) => {
            this.stats.loadedItems = loaded;
            this.stats.totalItems = total;

            const progress: LoadingProgress = {
                url,
                loaded,
                total,
                progress: total > 0 ? Math.round((loaded / total) * 100) : 0,
            };

            this.config.onProgress?.(progress);
        };

        // 加载完成回调
        this.manager.onLoad = () => {
            this.isLoading = false;
            this.stats.endTime = performance.now();

            this.config.onLoad?.();
        };

        // 加载错误回调
        this.manager.onError = (url: string) => {
            this.stats.errorItems++;

            const error = new Error(`Failed to load resource: ${url}`);
            this.config.onError?.(url, error);
        };

        // URL 修改器
        if (this.config.urlModifier) {
            this.manager.setURLModifier(this.config.urlModifier);
        }
    }

    /**
     * 获取 Three.js LoadingManager 实例
     *
     * @returns Three.js LoadingManager 实例
     */
    public getManager(): ThreeLoadingManager {
        return this.manager;
    }

    /**
     * 获取是否正在加载
     *
     * @returns 是否正在加载
     */
    public getIsLoading(): boolean {
        return this.isLoading;
    }

    /**
     * 获取加载统计信息
     *
     * @returns 加载统计信息
     */
    public getStats() {
        return {
            ...this.stats,
            loadTime: this.stats.endTime - this.stats.startTime,
            successRate:
                this.stats.totalItems > 0
                    ? ((this.stats.loadedItems - this.stats.errorItems) /
                          this.stats.totalItems) *
                      100
                    : 0,
        };
    }

    /**
     * 重置加载统计信息
     */
    public resetStats(): void {
        this.stats = {
            totalItems: 0,
            loadedItems: 0,
            errorItems: 0,
            startTime: 0,
            endTime: 0,
        };
    }

    /**
     * 更新配置
     *
     * @param config - 新的配置选项
     */
    public updateConfig(config: Partial<LoadingManagerConfig>): void {
        this.config = { ...this.config, ...config };
        this.setupCallbacks();
    }

    /**
     * 销毁加载管理器
     */
    public destroy(): void {
        // 清理回调
        this.manager.onStart = () => {};
        this.manager.onProgress = () => {};
        this.manager.onLoad = () => {};
        this.manager.onError = () => {};

        this.resetStats();
    }
}
