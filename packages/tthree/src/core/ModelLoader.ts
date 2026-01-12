import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Group, Object3D } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { LoadingManager, type LoadingProgress } from "./LoadingManager";
import { ProgressBar } from "../utils/ProgressBar";
import { disposeObject } from "../utils";

/**
 * 模型加载进度回调
 */
export interface ModelLoadProgress {
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
 * 模型加载配置选项
 */
export interface ModelLoaderConfig {
    /** 是否启用 Draco 压缩 */
    enableDraco?: boolean;
    /** Draco 解码器路径 */
    dracoDecoderPath?: string;
    /** 是否显示进度条（默认 false） */
    showProgressBar?: boolean;
    /** 进度条配置（仅在 showProgressBar 为 true 时有效） */
    progressBarConfig?: {
        /** 进度条颜色 */
        color?: string;
        /** 是否显示百分比 */
        showPercentage?: boolean;
        /** 是否显示加载信息 */
        showInfo?: boolean;
        /** 是否显示居中文本提示 */
        showCenterText?: boolean;
        /** 居中文本提示内容 */
        centerText?: string;
    };
    /** 加载开始回调 */
    onLoadStart?: (url: string) => void;
    /** 加载进度回调 */
    onProgress?: (progress: ModelLoadProgress) => void;
    /** 加载完成回调 */
    onLoadComplete?: () => void;
    /** 加载错误回调 */
    onLoadError?: (url: string, error: Error) => void;
}

/**
 * 模型加载结果
 */
export interface ModelLoadResult {
    /** 加载的模型对象 */
    model: Group | Object3D;
    /** 完整的 GLTF 数据 */
    gltf: GLTF;
    /** 模型 URL */
    url: string;
}

/**
 * 模型加载器类：负责 GLTF/GLB 模型的加载、解析和管理
 *
 * ## 使用示例
 *
 * ### 基础使用（最简单）
 * ```typescript
 * import { ModelLoader } from 'tthree';
 *
 * // 创建模型加载器
 * const modelLoader = new ModelLoader();
 *
 * // 加载模型
 * const result = await modelLoader.loadModel('/models/character.glb');
 * scene.add(result.model);
 * ```
 *
 * ### 带进度回调
 * ```typescript
 * const modelLoader = new ModelLoader({
 *   onProgress: (progress) => {
 *     console.log(`加载进度: ${progress.progress}%`);
 *   }
 * });
 * ```
 *
 * ### 带进度条
 * ```typescript
 * const modelLoader = new ModelLoader({
 *   showProgressBar: true,
 *   progressBarConfig: {
 *     color: '#4CAF50',
 *     showPercentage: true
 *   }
 * });
 * ```
 *
 * ### 启用 Draco 压缩
 * ```typescript
 * const modelLoader = new ModelLoader({
 *   enableDraco: true,
 *   dracoDecoderPath: '/draco/'
 * });
 * ```
 */
export class ModelLoader {
    /** GLTF 加载器实例 */
    private gltfLoader: GLTFLoader;

    /** Draco 加载器实例 */
    private dracoLoader: DRACOLoader | undefined;

    /** 加载管理器实例（内部自动创建） */
    private loadingManager: LoadingManager;

    /** 进度条实例 */
    private progressBar: ProgressBar | undefined;

    /** 已加载的模型缓存 */
    private cache: Map<string, ModelLoadResult> = new Map();

    /** 配置选项 */
    private config: ModelLoaderConfig;

    /**
     * 创建 ModelLoader 实例
     *
     * @param config - 模型加载器配置选项
     */
    constructor(config: ModelLoaderConfig = {}) {
        this.config = config;

        // 自动创建进度条（如果需要）
        if (config.showProgressBar) {
            this.progressBar = new ProgressBar({
                container: document.body,
                color: config.progressBarConfig?.color || "#4CAF50",
                showPercentage:
                    config.progressBarConfig?.showPercentage ?? true,
                showInfo: config.progressBarConfig?.showInfo ?? true,
                showCenterText:
                    config.progressBarConfig?.showCenterText ?? false,
                centerText: config.progressBarConfig?.centerText,
            });
        }

        // 自动创建加载管理器
        this.loadingManager = new LoadingManager({
            onStart: (url: string) => {
                config.onLoadStart?.(url);
            },
            onProgress: (progress: LoadingProgress) => {
                // 更新进度条
                if (this.progressBar) {
                    this.progressBar.update(progress);
                }
                // 调用用户的进度回调
                config.onProgress?.({
                    url: progress.url,
                    loaded: progress.loaded,
                    total: progress.total,
                    progress: progress.progress,
                });
            },
            onLoad: () => {
                // 完成进度条
                if (this.progressBar) {
                    this.progressBar.complete();
                }
                // 调用用户的完成回调
                config.onLoadComplete?.();
            },
            onError: (url: string, error?: Error) => {
                config.onLoadError?.(
                    url,
                    error || new Error(`Failed to load: ${url}`),
                );
            },
        });

        // 创建 GLTF 加载器
        const manager = this.loadingManager.getManager();
        this.gltfLoader = new GLTFLoader(manager);

        // 设置 Draco 解码器
        if (config.enableDraco) {
            this.setupDracoLoader(config.dracoDecoderPath);
        }
    }

    /**
     * 设置 Draco 解码器
     *
     * @param decoderPath - Draco 解码器路径
     */
    private setupDracoLoader(decoderPath?: string): void {
        this.dracoLoader = new DRACOLoader();

        // 设置解码器路径
        const path =
            decoderPath || "https://www.gstatic.com/draco/v1/decoders/";
        this.dracoLoader.setDecoderPath(path);

        // 配置 GLTF 加载器使用 Draco
        this.gltfLoader.setDRACOLoader(this.dracoLoader);
    }

    /**
     * 加载单个 GLTF/GLB 模型
     *
     * @param url - 模型文件的 URL
     * @param useCache - 是否使用缓存（默认为 true）
     * @returns Promise<ModelLoadResult> 加载结果
     *
     * @example
     * ```typescript
     * const result = await modelLoader.loadModel('/models/character.glb');
     * scene.add(result.model);
     * ```
     */
    public async loadModel(
        url: string,
        useCache: boolean = true,
    ): Promise<ModelLoadResult> {
        // 检查缓存
        if (useCache && this.cache.has(url)) {
            const cached = this.cache.get(url)!;
            // 克隆模型以避免共享引用
            return {
                ...cached,
                model: cached.model.clone(),
            };
        }

        return new Promise((resolve, reject) => {
            this.gltfLoader.load(
                url,
                (gltf: GLTF) => {
                    const result: ModelLoadResult = {
                        model: gltf.scene,
                        gltf,
                        url,
                    };

                    // 缓存模型
                    if (useCache) {
                        this.cache.set(url, result);
                    }

                    resolve(result);
                },
                // 进度回调（已由 LoadingManager 处理）
                undefined,
                (error) => {
                    reject(
                        new Error(`Failed to load model: ${url} - ${error}`),
                    );
                },
            );
        });
    }

    /**
     * 批量加载多个模型
     *
     * @param urls - 模型文件 URL 数组
     * @param useCache - 是否使用缓存（默认为 true）
     * @returns Promise<ModelLoadResult[]> 加载结果数组
     *
     * @example
     * ```typescript
     * const results = await modelLoader.loadModels([
     *   '/models/model1.glb',
     *   '/models/model2.glb'
     * ]);
     *
     * results.forEach(result => scene.add(result.model));
     * ```
     */
    public async loadModels(
        urls: string[],
        useCache: boolean = true,
    ): Promise<ModelLoadResult[]> {
        const promises = urls.map((url) => this.loadModel(url, useCache));
        return Promise.all(promises);
    }

    /**
     * 从缓存中获取模型
     *
     * @param url - 模型文件的 URL
     * @returns ModelLoadResult | undefined 缓存的模型或 undefined
     */
    public getCachedModel(url: string): ModelLoadResult | undefined {
        const cached = this.cache.get(url);
        if (cached) {
            return {
                ...cached,
                model: cached.model.clone(),
            };
        }
        return undefined;
    }

    /**
     * 清除指定 URL 的缓存
     *
     * @param url - 模型文件的 URL
     * @returns 是否成功清除
     */
    public clearCache(url: string): boolean {
        const cached = this.cache.get(url);
        if (cached) {
            // 释放模型资源
            disposeObject(cached.model);
            this.cache.delete(url);
            return true;
        }
        return false;
    }

    /**
     * 清除所有缓存
     */
    public clearAllCache(): void {
        this.cache.forEach((result) => {
            disposeObject(result.model);
        });
        this.cache.clear();
    }

    /**
     * 获取缓存的模型数量
     *
     * @returns 缓存中的模型数量
     */
    public getCacheSize(): number {
        return this.cache.size;
    }

    /**
     * 获取缓存的所有模型 URL
     *
     * @returns 模型 URL 数组
     */
    public getCachedUrls(): string[] {
        return Array.from(this.cache.keys());
    }

    /**
     * 销毁模型加载器
     */
    public destroy(): void {
        // 清除所有缓存
        this.clearAllCache();

        // 销毁 Draco 加载器
        if (this.dracoLoader) {
            this.dracoLoader.dispose();
            this.dracoLoader = undefined;
        }

        // 销毁加载管理器
        this.loadingManager?.destroy();

        // 销毁进度条
        if (this.progressBar) {
            this.progressBar.destroy();
            this.progressBar = undefined;
        }
    }
}
