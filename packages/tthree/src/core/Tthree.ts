import { Mesh } from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { RenderEngine } from "./RenderEngine";
import { SceneManager } from "./SceneManager";
import { CameraController } from "./CameraController";
import type { TthreeConfig } from "./interface";
import type { ModelLoadResult } from "../loaders/ModelLoader";
import { LifecycleManager } from "../managers/LifecycleManager";
import { ResizeManager } from "../managers/ResizeManager";
import { AnimationManager } from "../managers/AnimationManager";
import { AssetLoadManager } from "../managers/AssetLoadManager";

/**
 * Three.js 应用类：负责 Three.js 应用的创建、初始化、渲染和销毁
 *
 * ## 使用示例
 * @example
 * ```typescript
 * // 1. 创建实例
 * const app = new Tthree({
 *   container: document.getElementById('canvas-container'),
 *   showGrid: true,
 *   showAxes: true
 * });
 *
 * // 2. 初始化
 * app.init();
 *
 * // 3. 加载模型（新增）
 * const result = await app.loadModel('/models/character.glb');
 *
 * // 4. 清理资源
 * app.dispose();
 * ```
 */
export class Tthree {
    /** 场景管理器实例 */
    public sceneManager: SceneManager;

    /** 相机控制器实例 */
    public cameraController: CameraController;

    /** 渲染引擎实例 */
    public renderEngine: RenderEngine;

    /** 生命周期管理器实例 */
    private lifecycleManager: LifecycleManager;

    /** 尺寸管理器实例 */
    private resizeManager: ResizeManager | undefined;

    /** 动画管理器实例 */
    private animationManager: AnimationManager | undefined;

    /** 资源加载管理器实例 */
    private assetLoadManager: AssetLoadManager | undefined;

    /** Stats 性能监测实例 */
    public stats: Stats | undefined;

    /** 挂载容器 */
    private container: HTMLElement;

    /** 初始化配置缓存（用于延迟初始化） */
    private initOptions: TthreeConfig | undefined;

    /**
     * 创建 Tthree 实例
     *
     * @param config - 应用配置选项
     */
    constructor(config: TthreeConfig) {
        this.container = config.container;
        this.initOptions = config;

        // 初始化生命周期管理器
        this.lifecycleManager = new LifecycleManager();

        // 初始化场景管理器
        this.sceneManager = new SceneManager({
            showGrid: config.showGrid,
            showAxes: config.showAxes,
        });

        // 初始化相机控制器
        const containerSize = this.getContainerSize();
        this.cameraController = new CameraController({
            containerSize,
            camera: config.camera,
            controls: config.controls,
        });

        // 初始化渲染引擎
        this.renderEngine = new RenderEngine({ container: config.container });
    }

    /**
     * 设置尺寸自适应
     */
    private setupAutoResize(): void {
        this.resizeManager = new ResizeManager(
            this.container,
            (width, height) => {
                // 更新相机尺寸
                this.cameraController.updateSize(width, height);
                // 更新渲染器尺寸
                this.renderEngine.setSize(width, height);
            },
        );
        this.resizeManager.start();
    }

    /**
     * 初始化应用
     *
     * 1. 创建场景
     * 2. 创建相机
     * 3. 创建渲染器
     * 4. 创建控制器
     * 5. 启用尺寸自适应
     * 6. 设置初始化标记
     * @returns this - 支持链式调用
     */
    public init(): this {
        if (this.lifecycleManager.isInitialized()) {
            return this;
        }

        if (!this.initOptions) {
            throw new Error("初始化失败：缺少必要的配置参数");
        }

        const config = this.initOptions;

        // 初始化场景
        this.sceneManager.createScene();

        // 初始化相机
        if (!config.camera) {
            this.cameraController.createCamera();
        } else {
            this.cameraController.camera = config.camera;
        }

        // 初始化渲染器
        if (!config.renderer) {
            this.renderEngine.createRenderer({
                container: config.container,
                antialias: config.antialias,
            });
        } else {
            this.renderEngine.renderer = config.renderer;
            this.container.appendChild(config.renderer.domElement);
        }

        // 初始化控制器
        if (this.cameraController.getEnableControls() && this.renderer) {
            this.cameraController.createControls(this.renderer.domElement);
        }

        // 启用尺寸自适应
        this.setupAutoResize();

        // 初始化 Stats（在渲染器创建后）
        if (config.showStats && this.renderer) {
            this.stats = new Stats();
            document.body.appendChild(this.stats.dom);
        }

        // 初始化动画管理器
        this.animationManager = new AnimationManager(
            this.renderEngine,
            this.cameraController,
            () => this.scene,
            () => this.camera,
            this.stats,
        );

        this.lifecycleManager.setInitialized(true);

        // 启动渲染循环
        this.animate();

        return this;
    }

    /**
     * 一键启动：初始化 + 开始渲染循环。
     *
     * @remarks
     * 常见页面只需要调用 {@link Tthree.init} 即可（init 内部会自动启动渲染循环）。
     *
     * @deprecated 请直接使用 {@link Tthree.init}
     */
    public start(): this {
        this.init();
        return this;
    }

    /** 获取场景实例
     *
     * @returns 场景实例(Scene)
     */
    public get scene() {
        return this.sceneManager?.scene;
    }

    /** 获取相机实例
     *
     * @returns 相机实例(PerspectiveCamera)
     */
    public get camera() {
        return this.cameraController?.camera;
    }

    /** 获取渲染器实例
     *
     * @returns 渲染器实例(WebGLRenderer)
     */
    public get renderer() {
        return this.renderEngine?.renderer;
    }

    /** 获取 OrbitControls 控制器实例
     *
     * @returns 控制器实例(OrbitControls)
     */
    public get controls() {
        return this.cameraController?.controls;
    }

    /**
     * 获取应用运行状态
     *
     * @returns 是否正在运行(boolean)
     */
    public getIsRunning(): boolean {
        return this.renderEngine.getIsRunning();
    }

    /**
     * 获取容器元素
     *
     * @returns 容器DOM元素(HTMLElement)
     */
    public getContainer(): HTMLElement {
        return this.container;
    }

    /**
     * 向场景添加网格对象
     *
     * **功能说明：**
     * - 自动将网格添加到场景中
     * - 如果未初始化，会自动调用 init()
     *
     * @param mesh 要添加的网格对象
     * @example
     * ```typescript
     * const app = new Tthree({
     *   container: el
     * });
     *
     * // 添加网格
     * app.addMesh(mesh);
     * ```
     */
    public addMesh(mesh: Mesh): void {
        if (!this.lifecycleManager.isInitialized()) {
            this.init();
        }

        this.sceneManager.addMesh(mesh);
    }

    /**
     * 获取容器尺寸
     *
     * @returns 容器宽度和高度(number, number)
     */
    public getContainerSize(): { width: number; height: number } {
        if (this.resizeManager) {
            return this.resizeManager.getContainerSize();
        }
        // 初始化前的回退方案
        const rect = this.container.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
        };
    }

    /**
     * 获取或创建资源加载管理器实例
     */
    private getAssetLoadManager(): AssetLoadManager {
        if (!this.assetLoadManager) {
            const config = this.initOptions;
            this.assetLoadManager = new AssetLoadManager(
                {
                    enableDraco: config?.enableDraco,
                    dracoDecoderPath: config?.dracoDecoderPath,
                    showProgressBar: config?.showProgressBar,
                    onLoadProgress: config?.onLoadProgress,
                    onLoadComplete: () => {
                        // 先调用用户的回调（如果有）
                        config?.onLoadComplete?.();
                        // 如果用户没有提供回调，自动启动动画
                        if (!config?.onLoadComplete) {
                            this.animate();
                        }
                    },
                    onLoadError: config?.onLoadError,
                },
                () => this.scene,
            );
        }
        return this.assetLoadManager;
    }

    /**
     * 加载 GLTF/GLB 3D 模型
     *
     * **功能说明：**
     * - 自动创建模型加载器
     * - 自动将模型添加到场景
     * - 内置错误处理，无需外部 try-catch
     * - 支持进度条显示（通过配置 showProgressBar: true）
     * - 如果未初始化，会自动调用 init()
     *
     * @param url - 模型文件的 URL
     * @param autoAddToScene - 是否自动添加到场景（默认 true）
     * @returns Promise<ModelLoadResult | null> 加载结果，失败时返回 null
     *
     * @example
     * ```typescript
     * // 基础使用（无需 try-catch）
     * const app = new Tthree({ container: el });
     * app.init();
     * await app.loadModel('/models/character.glb');
     *
     * // 带错误处理
     * const app = new Tthree({
     *   container: el,
     *   onLoadError: (url, error) => {
     *     console.error('加载失败:', url, error);
     *   }
     * });
     * await app.loadModel('/models/character.glb');
     * ```
     */
    public async loadModel(
        url: string,
        autoAddToScene: boolean = true,
    ): Promise<ModelLoadResult | null> {
        // 确保已初始化
        if (!this.lifecycleManager.isInitialized()) {
            this.init();
        }

        const manager = this.getAssetLoadManager();
        return manager.loadModel(url, autoAddToScene);
    }

    /**
     * 批量加载多个模型
     *
     * **功能说明：**
     * - 内置错误处理，部分失败不影响其他模型加载
     * - 自动将成功加载的模型添加到场景
     * - 无需外部 try-catch
     *
     * @param urls - 模型文件 URL 数组
     * @param autoAddToScene - 是否自动添加到场景（默认 true）
     * @returns Promise<ModelLoadResult[]> 成功加载的模型结果数组
     *
     * @example
     * ```typescript
     * const app = new Tthree({ container: el });
     * app.init();
     *
     * // 批量加载，即使部分失败也不会中断
     * await app.loadModels([
     *   '/models/model1.glb',
     *   '/models/model2.glb',
     *   '/models/model3.glb'
     * ]);
     * ```
     */
    public async loadModels(
        urls: string[],
        autoAddToScene: boolean = true,
    ): Promise<ModelLoadResult[]> {
        // 确保已初始化
        if (!this.lifecycleManager.isInitialized()) {
            this.init();
        }

        const manager = this.getAssetLoadManager();
        return manager.loadModels(urls, autoAddToScene);
    }

    /**
     * 启动渲染循环（内部方法）
     *
     * @remarks
     * 外部调用请使用 {@link Tthree.init}，该方法会在初始化完成后自动启动渲染循环。
     */
    private animate(): void {
        if (!this.animationManager) {
            throw new Error("动画管理器未初始化");
        }
        this.animationManager.start();
    }

    /**
     * 注册帧更新回调
     *
     * 用于天气系统、动画系统等需要每帧更新的扩展模块
     *
     * @param updater - 每帧调用的回调函数，参数为 (deltaTime, elapsedTime)
     * @returns this - 支持链式调用
     *
     * @example
     * ```typescript
     * // 注册天气系统的 update 方法
     * app.addFrameUpdater((delta) => weatherSystem.update(delta));
     * ```
     */
    public addFrameUpdater(updater: (dt: number, t: number) => void): this {
        if (!this.animationManager) {
            throw new Error("动画管理器未初始化，请先调用 init()");
        }
        this.animationManager.addFrameUpdater(updater);
        return this;
    }

    /**
     * 注册一个在 {@link Tthree.dispose} 时执行的清理函数
     *
     * @remarks
     * 用于把 `setupRainWeather` 之类返回的 `handle.dispose()` 自动挂到 app 的生命周期里。
     */
    public addDisposer(disposer: () => void): this {
        this.lifecycleManager.addDisposer(disposer);
        return this;
    }

    /**
     * 移除帧更新回调
     *
     * @param updater - 要移除的回调函数
     * @returns this - 支持链式调用
     */
    public removeFrameUpdater(updater: (dt: number, t: number) => void): this {
        if (this.animationManager) {
            this.animationManager.removeFrameUpdater(updater);
        }
        return this;
    }

    /**
     * 清空所有帧更新回调
     *
     * @returns this - 支持链式调用
     */
    public clearFrameUpdaters(): this {
        if (this.animationManager) {
            this.animationManager.clearFrameUpdaters();
        }
        return this;
    }

    /**
     * 停止应用和动画循环
     *
     * @returns this - 支持链式调用
     */
    public stop(): this {
        if (this.animationManager) {
            this.animationManager.stop();
        } else {
            this.renderEngine.stop();
        }
        return this;
    }

    /**
     * 释放应用占用的所有资源
     */
    public dispose(): void {
        this.lifecycleManager.setInitialized(false);

        this.stop();

        // 先执行外部扩展的清理（例如天气系统、后处理等）
        this.lifecycleManager.dispose();

        // 释放动画管理器
        if (this.animationManager) {
            this.animationManager.dispose();
            this.animationManager = undefined;
        }

        // 释放尺寸管理器
        if (this.resizeManager) {
            this.resizeManager.dispose();
            this.resizeManager = undefined;
        }

        // 释放资源加载管理器
        if (this.assetLoadManager) {
            this.assetLoadManager.dispose();
            this.assetLoadManager = undefined;
        }

        // 销毁 Stats
        if (this.stats) {
            this.stats.dom.remove();
            this.stats = undefined;
        }

        // 释放核心模块
        this.renderEngine.dispose();
        this.sceneManager.dispose();
        this.cameraController.dispose();
    }
}
