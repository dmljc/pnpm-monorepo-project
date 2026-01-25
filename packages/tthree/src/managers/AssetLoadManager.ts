import type { Scene } from "three";
import {
    ModelLoader,
    type ModelLoadResult,
    type ModelLoadProgress,
} from "../loaders/ModelLoader";
import { ProgressBar } from "../components/ProgressBar";

/**
 * 资源加载配置
 */
export interface AssetLoadConfig {
    /** 是否启用 Draco 压缩 */
    enableDraco?: boolean;
    /** Draco 解码器路径 */
    dracoDecoderPath?: string;
    /** 是否显示进度条 */
    showProgressBar?: boolean;
    /** 加载进度回调 */
    onLoadProgress?: (progress: ModelLoadProgress) => void;
    /** 加载完成回调 */
    onLoadComplete?: () => void;
    /** 加载错误回调 */
    onLoadError?: (url: string, error: Error) => void;
}

/**
 * 资源加载管理器
 *
 * 统一管理模型加载器和进度条
 */
export class AssetLoadManager {
    /** 模型加载器实例 */
    private modelLoader: ModelLoader | undefined;

    /** 进度条实例 */
    private progressBar: ProgressBar | undefined;

    /** 加载配置 */
    private config: AssetLoadConfig;

    /** 获取场景的回调 */
    private getScene: () => Scene | undefined;

    /**
     * 创建资源加载管理器实例
     *
     * @param config - 加载配置
     * @param getScene - 获取场景的函数
     */
    constructor(config: AssetLoadConfig, getScene: () => Scene | undefined) {
        this.config = config;
        this.getScene = getScene;
    }

    /**
     * 获取或创建进度条实例
     */
    private getProgressBar(): ProgressBar {
        if (!this.progressBar) {
            this.progressBar = new ProgressBar();
        }
        return this.progressBar;
    }

    /**
     * 获取或创建模型加载器实例
     */
    private getModelLoader(): ModelLoader {
        if (!this.modelLoader) {
            const shouldShowProgressBar = this.config.showProgressBar ?? true;

            this.modelLoader = new ModelLoader({
                enableDraco: this.config.enableDraco,
                dracoDecoderPath: this.config.dracoDecoderPath,
                onProgress: (progress: ModelLoadProgress) => {
                    // 如果启用进度条，更新进度条
                    if (shouldShowProgressBar) {
                        const progressBar = this.getProgressBar();
                        progressBar.update({
                            url: progress.url,
                            loaded: progress.loaded,
                            total: progress.total,
                            progress: progress.progress,
                        });
                    }
                    // 调用用户的进度回调
                    this.config.onLoadProgress?.(progress);
                },
                onLoadComplete: () => {
                    // 如果启用进度条，完成进度条
                    if (shouldShowProgressBar && this.progressBar) {
                        this.progressBar.complete();
                    }
                    // 调用用户的回调
                    this.config.onLoadComplete?.();
                },
                onLoadError: this.config.onLoadError,
            });
        }
        return this.modelLoader;
    }

    /**
     * 加载 GLTF/GLB 3D 模型
     *
     * @param url - 模型文件的 URL
     * @param autoAddToScene - 是否自动添加到场景（默认 true）
     * @returns Promise<ModelLoadResult | null> 加载结果，失败时返回 null
     */
    public async loadModel(
        url: string,
        autoAddToScene: boolean = true,
    ): Promise<ModelLoadResult | null> {
        try {
            const loader = this.getModelLoader();
            const result = await loader.loadModel(url);

            // 自动添加到场景
            if (autoAddToScene) {
                const scene = this.getScene();
                if (scene) {
                    scene.add(result.model);
                }
            }

            return result;
        } catch (error) {
            const err =
                error instanceof Error
                    ? error
                    : new Error(`Failed to load model: ${url}`);

            // 调用用户的错误回调（如果有）
            if (this.config.onLoadError) {
                this.config.onLoadError(url, err);
            } else {
                // 如果用户没有提供错误回调，输出到控制台
                console.error(`[AssetLoadManager] 模型加载失败: ${url}`, err);
            }

            return null;
        }
    }

    /**
     * 批量加载多个模型
     *
     * @param urls - 模型文件 URL 数组
     * @param autoAddToScene - 是否自动添加到场景（默认 true）
     * @returns Promise<ModelLoadResult[]> 成功加载的模型结果数组
     */
    public async loadModels(
        urls: string[],
        autoAddToScene: boolean = true,
    ): Promise<ModelLoadResult[]> {
        const results: ModelLoadResult[] = [];

        for (const url of urls) {
            const result = await this.loadModel(url, autoAddToScene);
            if (result) {
                results.push(result);
            }
        }

        return results;
    }

    /**
     * 释放资源
     */
    public dispose(): void {
        if (this.progressBar) {
            this.progressBar.dispose();
            this.progressBar = undefined;
        }

        if (this.modelLoader) {
            this.modelLoader.dispose();
            this.modelLoader = undefined;
        }
    }
}
