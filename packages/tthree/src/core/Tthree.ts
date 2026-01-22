import { Mesh } from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { RenderEngine } from "./RenderEngine";
import { SceneManager } from "./SceneManager";
import { CameraController } from "./CameraController";
import type { TthreeConfig } from "./interface";
import {
    setupRainWeather,
    type RainWeatherHandle,
    type SetupRainWeatherOptions,
} from "../effects/presets";
import {
    ModelLoader,
    type ModelLoadResult,
    type ModelLoadProgress,
} from "../loaders/ModelLoader";
import { ProgressBar } from "../components/ProgressBar";

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

    /** 模型加载器实例 */
    private modelLoader: ModelLoader | undefined;

    /** 进度条实例（独立管理） */
    private progressBar: ProgressBar | undefined;

    /** Stats 性能监测实例 */
    public stats: Stats | undefined;

    /** 是否已初始化（延迟初始化标记） */
    private initialized: boolean = false;

    /** 挂载容器 */
    private container: HTMLElement;

    /** 初始化配置缓存（用于延迟初始化） */
    private initOptions: TthreeConfig | undefined;

    /** 尺寸观察器 */
    private resizeObserver: ResizeObserver | undefined;

    /** 帧时间数据 */
    protected deltaTime: number = 0;
    protected elapsedTime: number = 0;

    /** 帧更新回调列表（用于天气系统等扩展） */
    private frameUpdaters: Array<(dt: number, t: number) => void> = [];

    /**
     * 统一资源释放回调列表。
     *
     * @remarks
     * 用于把"外部挂载的扩展/效果"的清理逻辑内置到 app 生命周期里，
     * 从而让调用端只需要 `app.dispose()`。
     */
    private disposers: Array<() => void> = [];

    /**
     * 创建 Tthree 实例
     *
     * @param config - 应用配置选项
     */
    constructor(config: TthreeConfig) {
        this.container = config.container;
        this.initOptions = config;

        // 初始化场景管理器
        this.sceneManager = new SceneManager({
            showGrid: config.showGrid,
            showAxes: config.showAxes,
        });

        // 获取容器尺寸
        const containerSize = this.getContainerSize();

        // 初始化相机控制器
        this.cameraController = new CameraController({
            containerSize,
            camera: config.camera,
            controls: config.controls,
        });

        // 初始化渲染引擎
        this.renderEngine = new RenderEngine({ container: config.container });

        // 初始化模型加载器（延迟创建，在首次使用时创建）
    }

    /**
     * 设置尺寸自适应
     *
     * 解释 ResizeObserver 与 window resize 的区别，以及为什么这里使用 ResizeObserver
     *
     * 1. 监听范围不同
     * window resize 事件：
     * - 仅在浏览器窗口大小改变时触发
     * - 无法检测容器元素本身的尺寸变化
     * ResizeObserver：
     * - 可监听任意 DOM 元素的尺寸变化
     * - 不仅响应窗口大小变化，还响应容器元素本身尺寸的变化
     * 2. 性能优势
     * - ResizeObserver 由浏览器优化，性能更好
     * - 回调在布局完成后触发，避免重复计算
     * - 可精确监听特定元素，减少不必要的处理
     * @returns void
     */
    private setupAutoResize(): void {
        this.resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });

        this.resizeObserver.observe(this.container);
    }

    // 处理容器尺寸变化
    private handleResize(): void {
        const { width, height } = this.getContainerSize();

        // 更新相机尺寸
        this.cameraController.updateSize(width, height);

        // 更新渲染器尺寸
        this.renderEngine.setSize(width, height);
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
        if (this.initialized) return this;

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

        this.initialized = true;

        // 启动渲染循环（对外不暴露 animate，外部只需调用 init）
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
        if (!this.initialized) {
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
        const rect = this.container.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
        };
    }

    /**
     * 获取或创建进度条实例
     *
     * @returns ProgressBar 实例
     */
    private getProgressBar(): ProgressBar {
        if (!this.progressBar) {
            // ProgressBar 内部已包含默认配置，无需传递参数
            this.progressBar = new ProgressBar();
        }
        return this.progressBar;
    }

    /**
     * 获取或创建模型加载器实例
     *
     * @returns ModelLoader 实例
     */
    private getModelLoader(): ModelLoader {
        if (!this.modelLoader) {
            const config = this.initOptions;
            const shouldShowProgressBar = config?.showProgressBar ?? true;

            this.modelLoader = new ModelLoader({
                enableDraco: config?.enableDraco,
                dracoDecoderPath: config?.dracoDecoderPath,
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
                    config?.onLoadProgress?.(progress);
                },
                onLoadComplete: () => {
                    // 如果启用进度条，完成进度条
                    if (shouldShowProgressBar && this.progressBar) {
                        this.progressBar.complete();
                    }

                    // 先调用用户的回调（如果有）
                    config?.onLoadComplete?.();

                    // 如果用户没有提供回调，自动启动动画
                    if (!config?.onLoadComplete) {
                        this.animate();
                    }
                },
                onLoadError: config?.onLoadError,
            });
        }
        return this.modelLoader;
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
        try {
            // 确保已初始化
            if (!this.initialized) {
                this.init();
            }

            // 获取模型加载器
            const loader = this.getModelLoader();

            // 加载模型
            const result = await loader.loadModel(url);

            // 自动添加到场景
            if (autoAddToScene && this.scene) {
                this.scene.add(result.model);
            }

            return result;
        } catch (error) {
            // 内部错误处理
            const err =
                error instanceof Error
                    ? error
                    : new Error(`Failed to load model: ${url}`);

            // 调用用户的错误回调（如果有）
            if (this.initOptions?.onLoadError) {
                this.initOptions.onLoadError(url, err);
            } else {
                // 如果用户没有提供错误回调，输出到控制台
                console.error(`[Tthree] 模型加载失败: ${url}`, err);
            }

            return null;
        }
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
        if (!this.initialized) {
            this.init();
        }

        // 逐个加载模型，收集成功的结果
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
     * 启动渲染循环（内部方法）。
     *
     * @remarks
     * 外部调用请使用 {@link Tthree.init}，该方法会在初始化完成后自动启动渲染循环。
     */
    private animate(): void {
        // 避免重复启动
        if (this.renderEngine.getIsRunning()) return;

        if (!this.scene || !this.camera) {
            throw new Error("场景或相机未初始化，请先调用 init() 方法");
        }

        this.renderEngine.start(() => this.renderFrame());
    }

    /**
     * 渲染帧
     *
     * @returns void
     */
    private renderFrame(): void {
        if (!this.scene || !this.camera) return;

        // 更新时间数据
        const timeData = this.renderEngine.getTimeData();
        this.deltaTime = timeData.deltaTime;
        this.elapsedTime = timeData.elapsedTime;

        // 更新控制器
        this.cameraController.update();

        // 调用帧更新回调（天气系统等扩展）
        for (const updater of this.frameUpdaters) {
            updater(this.deltaTime, this.elapsedTime);
        }

        // 渲染场景
        this.renderEngine.render(this.scene, this.camera);

        // 更新 Stats（在渲染后）
        this.stats?.update();
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
     * // 注册天气系统的 tick 方法
     * app.addFrameUpdater((dt, t) => weatherSystem.tick(dt, t));
     *
     * // 或者直接绑定
     * app.addFrameUpdater(weatherSystem.tick.bind(weatherSystem));
     * ```
     */
    public addFrameUpdater(updater: (dt: number, t: number) => void): this {
        if (!this.frameUpdaters.includes(updater)) {
            this.frameUpdaters.push(updater);
        }
        return this;
    }

    /**
     * 注册一个在 {@link Tthree.dispose} 时执行的清理函数。
     *
     * @remarks
     * 用于把 `setupRainWeather` 之类返回的 `handle.dispose()` 自动挂到 app 的生命周期里。
     */
    public addDisposer(disposer: () => void): this {
        this.disposers.push(disposer);
        return this;
    }

    /**
     * 预设：一行挂载雨天效果，并自动随 app 一起销毁。
     *
     * @remarks
     * - 内部会确保 app 已初始化（会调用 {@link Tthree.init}）
     * - 会调用 {@link setupRainWeather} 并自动把 `handle.dispose()` 注册到 app
     *
     * @returns 雨天句柄（仍可供调用端进一步配置，例如调整强度）
     */
    public useRainWeather(
        options: SetupRainWeatherOptions = {},
    ): RainWeatherHandle {
        if (!this.initialized) {
            this.init();
        }

        const handle = setupRainWeather(this, options);

        // 自动挂载到 app 生命周期，调用端无需手动 dispose()
        this.addDisposer(() => handle.dispose());

        return handle;
    }

    /**
     * 移除帧更新回调
     *
     * @param updater - 要移除的回调函数
     * @returns this - 支持链式调用
     */
    public removeFrameUpdater(updater: (dt: number, t: number) => void): this {
        const index = this.frameUpdaters.indexOf(updater);
        if (index !== -1) {
            this.frameUpdaters.splice(index, 1);
        }
        return this;
    }

    /**
     * 清空所有帧更新回调
     *
     * @returns this - 支持链式调用
     */
    public clearFrameUpdaters(): this {
        this.frameUpdaters = [];
        return this;
    }

    /**
     * 停止应用和动画循环
     *
     * @returns this - 支持链式调用
     */
    public stop(): this {
        this.renderEngine.stop();
        return this;
    }

    /**
     * 释放应用占用的所有资源
     *
     * @returns void
     */
    public dispose(): void {
        this.initialized = false;

        this.stop();

        // 先执行外部扩展的清理（例如天气系统、后处理等）
        if (this.disposers.length) {
            for (const disposer of this.disposers) {
                try {
                    disposer();
                } catch (err) {
                    console.warn("[Tthree] disposer 执行失败", err);
                }
            }
            this.disposers = [];
        }

        // 清空帧更新回调
        this.clearFrameUpdaters();

        // 清理尺寸观察器
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = undefined;
        }

        // 释放进度条
        if (this.progressBar) {
            this.progressBar.dispose();
            this.progressBar = undefined;
        }

        // 释放模型加载器
        if (this.modelLoader) {
            this.modelLoader.dispose();
            this.modelLoader = undefined;
        }

        // 销毁 Stats
        if (this.stats) {
            this.stats.dom.remove();
            this.stats = undefined;
        }

        // 释放各个模块
        this.renderEngine.dispose();
        this.sceneManager.dispose();
        this.cameraController.dispose();
    }
}
