import type { Scene, PerspectiveCamera } from "three";
import type { RenderEngine } from "../core/RenderEngine";
import type { CameraController } from "../core/CameraController";
import type Stats from "three/examples/jsm/libs/stats.module";

/**
 * 动画管理器
 *
 * 负责管理渲染循环、帧更新回调和时间数据
 */
export class AnimationManager {
    /** 渲染引擎引用 */
    private renderEngine: RenderEngine;

    /** 相机控制器引用 */
    private cameraController: CameraController;

    /** Stats 性能监测引用 */
    private stats: Stats | undefined;

    /** 帧时间数据 */
    private deltaTime: number = 0;
    private elapsedTime: number = 0;

    /** 帧更新回调列表（用于天气系统等扩展） */
    private frameUpdaters: Array<(dt: number, t: number) => void> = [];

    /** 获取场景的回调 */
    private getScene: () => Scene | undefined;

    /** 获取相机的回调 */
    private getCamera: () => PerspectiveCamera | undefined;

    /**
     * 创建动画管理器实例
     *
     * @param renderEngine - 渲染引擎实例
     * @param cameraController - 相机控制器实例
     * @param getScene - 获取场景的函数
     * @param getCamera - 获取相机的函数
     * @param stats - Stats 实例（可选）
     */
    constructor(
        renderEngine: RenderEngine,
        cameraController: CameraController,
        getScene: () => Scene | undefined,
        getCamera: () => PerspectiveCamera | undefined,
        stats?: Stats,
    ) {
        this.renderEngine = renderEngine;
        this.cameraController = cameraController;
        this.getScene = getScene;
        this.getCamera = getCamera;
        this.stats = stats;
    }

    /**
     * 设置 Stats 实例
     *
     * @param stats - Stats 实例
     */
    public setStats(stats: Stats | undefined): void {
        this.stats = stats;
    }

    /**
     * 获取当前帧的 deltaTime
     *
     * @returns 当前帧的时间间隔（秒）
     */
    public getDeltaTime(): number {
        return this.deltaTime;
    }

    /**
     * 获取累计运行时间
     *
     * @returns 累计运行时间（秒）
     */
    public getElapsedTime(): number {
        return this.elapsedTime;
    }

    /**
     * 启动渲染循环
     */
    public start(): void {
        // 避免重复启动
        if (this.renderEngine.getIsRunning()) {
            return;
        }

        const scene = this.getScene();
        const camera = this.getCamera();

        if (!scene || !camera) {
            throw new Error("场景或相机未初始化，无法启动渲染循环");
        }

        this.renderEngine.start(() => this.renderFrame());
    }

    /**
     * 渲染帧（内部方法）
     */
    private renderFrame(): void {
        const scene = this.getScene();
        const camera = this.getCamera();

        if (!scene || !camera) {
            return;
        }

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

        // 渲染场景（camera 已通过类型检查，确保是 PerspectiveCamera）
        this.renderEngine.render(scene, camera);

        // 更新 Stats（在渲染后）
        this.stats?.update();
    }

    /**
     * 注册帧更新回调
     *
     * 用于天气系统、动画系统等需要每帧更新的扩展模块
     *
     * @param updater - 每帧调用的回调函数，参数为 (deltaTime, elapsedTime)
     *
     * @example
     * ```typescript
     * // 注册天气系统的 update 方法
     * animationManager.addFrameUpdater((delta) => weatherSystem.update(delta));
     * ```
     */
    public addFrameUpdater(updater: (dt: number, t: number) => void): void {
        if (!this.frameUpdaters.includes(updater)) {
            this.frameUpdaters.push(updater);
        }
    }

    /**
     * 移除帧更新回调
     *
     * @param updater - 要移除的回调函数
     */
    public removeFrameUpdater(updater: (dt: number, t: number) => void): void {
        const index = this.frameUpdaters.indexOf(updater);
        if (index !== -1) {
            this.frameUpdaters.splice(index, 1);
        }
    }

    /**
     * 清空所有帧更新回调
     */
    public clearFrameUpdaters(): void {
        this.frameUpdaters = [];
    }

    /**
     * 停止渲染循环
     */
    public stop(): void {
        this.renderEngine.stop();
    }

    /**
     * 释放资源
     */
    public dispose(): void {
        this.clearFrameUpdaters();
        this.stop();
    }
}
