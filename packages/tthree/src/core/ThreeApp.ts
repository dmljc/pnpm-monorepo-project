/**
 * @module ThreeApp
 * @packageDocumentation
 *
 * # ThreeApp 模块
 *
 * ThreeApp 是 tthree 库的核心应用类，提供完整的 Three.js 应用生命周期管理。
 *
 * ## 功能特性
 *
 * - 完整的应用生命周期管理（初始化、运行、销毁）
 * - 场景创建（背景、雾效、光照、辅助工具）
 * - 相机配置（透视相机、轨道控制器）
 * - 渲染器设置（WebGL、抗锯齿、颜色空间）
 * - 动画循环（基于 WebGLRenderer setAnimationLoop）
 * - ResizeObserver 驱动的自动尺寸自适应
 * - 完整的资源清理和销毁机制
 *
 * ## 架构设计
 *
 * ThreeApp 整合了三个核心模块：
 * - {@link RenderEngine} - 渲染引擎
 * - {@link SceneManager} - 场景管理器
 * - {@link CameraController} - 相机控制器
 *
 * ## 使用示例
 *
 * ```typescript
 * import { ThreeApp } from 'tthree';
 *
 * // 1. 创建实例
 * const app = new ThreeApp({
 *   container: document.getElementById('canvas-container'),
 *   showGrid: true,
 *   showAxes: true
 * });
 *
 * // 2. 初始化
 * app.init();
 *
 * // 3. 添加网格
 * const mesh = new THREE.Mesh(geometry, material);
 * app.addMesh(mesh);
 *
 * // 4. 启动动画
 * app.animate();
 *
 * // 5. 清理资源
 * app.destroy();
 * ```
 */

import { Mesh, PerspectiveCamera, WebGLRenderer } from "three";
import { RenderEngine } from "./RenderEngine";
import { SceneManager } from "./SceneManager";
import { CameraController } from "./CameraController";

/**
 * Three.js 应用实例配置选项
 */
export interface ThreeAppConfig {
    /** 挂载的DOM元素 */
    container: HTMLElement;
    /** 是否启用抗锯齿 */
    antialias?: boolean;
    /** 是否启用控制器 */
    controls?: boolean;
    /** 自定义相机 */
    camera?: PerspectiveCamera;
    /** 自定义渲染器 */
    renderer?: WebGLRenderer;
    /** 是否显示网格 */
    showGrid?: boolean;
    /** 是否显示坐标轴 */
    showAxes?: boolean;
}

/**
 * Three.js 应用类
 *
 * 提供完整的 Three.js 应用生命周期管理，包括场景创建（背景、雾效、光照、辅助工具）、
 * 相机配置（透视相机、轨道控制器）、渲染器设置（WebGL、抗锯齿、颜色空间）和动画循环（基于 WebGLRenderer setAnimationLoop）。
 * ResizeObserver 驱动的自动尺寸自适应、完整的资源清理和销毁机制。
 *
 * @example
 * ```typescript
 * // 1. 创建实例
 * const app = new ThreeApp({
 *   container: document.getElementById('canvas-container'),
 *   showGrid: true,
 *   showAxes: true
 * });
 *
 * // 2. 初始化
 * app.init();
 *
 * // 3. 添加网格
 * const mesh = new THREE.Mesh(geometry, material);
 * app.addMesh(mesh);
 *
 * // 4. 启动动画
 * app.animate();
 *
 * // 5. 清理资源
 * app.destroy();
 * ```
 */
export class ThreeApp {
    /** 渲染引擎实例 */
    public renderEngine: RenderEngine;

    /** 场景管理器实例 */
    public sceneManager: SceneManager;

    /** 相机控制器实例 */
    public cameraController: CameraController;

    /** 是否已初始化（延迟初始化标记） */
    private initialized: boolean = false;

    /** 挂载容器 */
    private container: HTMLElement;

    /** 初始化配置缓存（用于延迟初始化） */
    private initOptions: ThreeAppConfig | undefined;

    /** 尺寸观察器 */
    private resizeObserver: ResizeObserver | undefined;

    /** 帧时间数据 */
    protected deltaTime: number = 0;
    protected elapsedTime: number = 0;

    /**
     * 创建 ThreeApp 实例
     *
     * @param config - 应用配置选项
     */
    constructor(config: ThreeAppConfig) {
        this.container = config.container;
        this.initOptions = config;

        // 初始化渲染引擎
        this.renderEngine = new RenderEngine({ container: config.container });

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
     * @returns void
     */
    public init(): void {
        if (this.initialized) return;

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

        this.initialized = true;
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
     * const app = new ThreeApp({
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
     * 启动动画循环（使用 WebGLRenderer.setAnimationLoop 实现）
     *
     * @returns void
     */
    public animate(): void {
        // 保证已初始化
        if (!this.initialized) {
            this.init();
        }

        if (!this.scene || !this.camera) {
            throw new Error("场景或相机未初始化，请先调用 init() 方法");
        }

        // 启动渲染循环
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

        // 渲染场景
        this.renderEngine.render(this.scene, this.camera);
    }

    /**
     * 停止应用和动画循环
     *
     * @returns void
     */
    public stop(): void {
        this.renderEngine.stop();
    }

    /**
     * 销毁应用
     *
     * @returns void
     */
    public destroy(): void {
        this.initialized = false;

        this.stop();

        // 清理尺寸观察器
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = undefined;
        }

        // 销毁各个模块
        this.renderEngine.destroy();
        this.sceneManager.destroy();
        this.cameraController.destroy();
    }
}
