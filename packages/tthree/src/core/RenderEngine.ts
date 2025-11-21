/**
 * @module RenderEngine
 * @packageDocumentation
 *
 * # RenderEngine 模块
 *
 * 渲染引擎模块负责 WebGL 渲染器的创建、配置、渲染循环和资源管理。
 *
 * ## 功能特性
 *
 * - WebGL 渲染器的创建和配置
 * - 渲染循环管理（基于 setAnimationLoop）
 * - 帧时间数据获取
 * - 自动像素比适配
 * - 渲染器资源清理
 *
 * ## 使用示例
 *
 * ```typescript
 * import { RenderEngine } from 'tthree';
 *
 * const engine = new RenderEngine({
 *   container: document.getElementById('canvas'),
 *   antialias: true
 * });
 *
 * // 创建渲染器
 * engine.createRenderer({ container, antialias: true });
 *
 * // 设置尺寸
 * engine.setSize(800, 600);
 *
 * // 启动渲染循环
 * engine.start(() => {
 *   engine.render(scene, camera);
 * });
 *
 * // 获取时间数据
 * const { deltaTime, elapsedTime } = engine.getTimeData();
 * ```
 */

import {
    WebGLRenderer,
    Scene,
    PerspectiveCamera,
    NoToneMapping,
    Clock,
} from "three";
import { RENDERER_DEFAULTS } from "./constants";

/**
 * 渲染引擎配置选项
 */
export interface RenderEngineConfig {
    /** 挂载的DOM元素 */
    container: HTMLElement;
    /** 是否启用抗锯齿 */
    antialias?: boolean;
}

/**
 * 渲染引擎类
 *
 * 负责 WebGL 渲染器的创建、配置、渲染循环和资源管理
 */
export class RenderEngine {
    /** 渲染器实例 */
    public renderer: WebGLRenderer | undefined;

    /** 是否正在运行 */
    private isRunning: boolean = false;

    /** 帧时钟 */
    private clock: Clock = new Clock();

    /** 挂载容器 */
    private container: HTMLElement;

    /** 渲染回调函数 */
    private renderCallback: (() => void) | null = null;

    /**
     * 创建 RenderEngine 实例
     *
     * @param config - 渲染引擎配置选项
     */
    constructor(config: RenderEngineConfig) {
        this.container = config.container;
    }

    /**
     * 创建 WebGL 渲染器
     *
     * @param config - 渲染引擎配置
     * @returns 配置好的渲染器实例
     */
    public createRenderer(config: RenderEngineConfig): WebGLRenderer {
        const renderer = new WebGLRenderer({
            ...RENDERER_DEFAULTS.CONTEXT_ATTRIBUTES,
            antialias:
                config.antialias ??
                RENDERER_DEFAULTS.CONTEXT_ATTRIBUTES.antialias,
        });

        // 输出配置（保持最简）
        renderer.outputColorSpace = RENDERER_DEFAULTS.OUTPUT.colorSpace;
        renderer.toneMapping = NoToneMapping;

        this.container.appendChild(renderer.domElement);

        this.renderer = renderer;
        return renderer;
    }

    /**
     * 设置渲染器尺寸
     *
     * @param width - 宽度
     * @param height - 高度
     */
    public setSize(width: number, height: number): void {
        if (!this.renderer) return;

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    /**
     * 渲染一帧
     *
     * @param scene - 场景实例
     * @param camera - 相机实例
     */
    public render(scene: Scene, camera: PerspectiveCamera): void {
        if (!this.renderer) return;

        this.renderer.render(scene, camera);
    }

    /**
     * 启动渲染循环
     *
     * @param callback - 每帧渲染回调函数
     */
    public start(callback: () => void): void {
        if (this.isRunning || !this.renderer) return;

        this.isRunning = true;
        this.clock.start();
        this.renderCallback = callback;
        this.renderer.setAnimationLoop(callback);
    }

    /**
     * 停止渲染循环
     */
    public stop(): void {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.clock.stop();
        this.renderer?.setAnimationLoop(null);
        this.renderCallback = null;
    }

    /**
     * 获取帧时间数据
     *
     * @returns 帧时间数据对象
     */
    public getTimeData(): { deltaTime: number; elapsedTime: number } {
        const delta = this.clock.getDelta();
        return {
            deltaTime: delta,
            elapsedTime: this.clock.getElapsedTime(),
        };
    }

    /**
     * 获取是否正在运行
     *
     * @returns 是否正在运行
     */
    public getIsRunning(): boolean {
        return this.isRunning;
    }

    /**
     * 销毁渲染引擎
     */
    public destroy(): void {
        this.stop();

        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.domElement.remove();
            this.renderer = undefined;
        }
    }
}
