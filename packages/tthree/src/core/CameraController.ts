/**
 * @module CameraController
 * @packageDocumentation
 *
 * # CameraController 模块
 *
 * 相机控制器模块负责相机的创建、配置、控制器管理和尺寸自适应。
 *
 * ## 功能特性
 *
 * - 透视相机的创建和配置
 * - OrbitControls 轨道控制器的集成
 * - 自动尺寸自适应
 * - 相机和控制器生命周期管理
 *
 * ## 使用示例
 *
 * ```typescript
 * import { CameraController } from 'tthree';
 *
 * const controller = new CameraController({
 *   containerSize: { width: 800, height: 600 },
 *   controls: true
 * });
 *
 * // 创建相机
 * controller.createCamera();
 *
 * // 创建控制器
 * controller.createControls(renderer.domElement);
 *
 * // 更新尺寸
 * controller.updateSize(1920, 1080);
 *
 * // 在渲染循环中更新
 * controller.update();
 * ```
 */

import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CAMERA_DEFAULTS, CONTROLS_DEFAULTS } from "./constants";

/**
 * 相机控制器配置选项
 */
export interface CameraControllerConfig {
    /** 容器尺寸 */
    containerSize: { width: number; height: number };
    /** 自定义相机 */
    camera?: PerspectiveCamera;
    /** 是否启用控制器 */
    controls?: boolean;
}

/**
 * 相机控制器类
 *
 * 负责相机的创建、配置、控制器管理和尺寸自适应
 */
export class CameraController {
    /** 相机实例 */
    public camera: PerspectiveCamera | undefined;

    /** 控制器实例 */
    public controls: OrbitControls | undefined;

    /** 容器尺寸 */
    private containerSize: { width: number; height: number };

    /** 是否启用控制器 */
    private enableControls: boolean;

    /**
     * 创建 CameraController 实例
     *
     * @param config - 相机控制器配置选项
     */
    constructor(config: CameraControllerConfig) {
        this.containerSize = config.containerSize;
        this.enableControls = config.controls !== false;
    }

    /**
     * 创建透视相机
     *
     * @returns 配置好的相机实例
     */
    public createCamera(): PerspectiveCamera {
        const { width, height } = this.containerSize;
        const camera = new PerspectiveCamera(
            CAMERA_DEFAULTS.PERSPECTIVE.fov,
            width / height,
            CAMERA_DEFAULTS.PERSPECTIVE.near,
            CAMERA_DEFAULTS.PERSPECTIVE.far,
        );

        camera.position.set(
            CAMERA_DEFAULTS.POSITION.x,
            CAMERA_DEFAULTS.POSITION.y,
            CAMERA_DEFAULTS.POSITION.z,
        );

        this.camera = camera;
        return camera;
    }

    /**
     * 创建轨道控制器
     *
     * @param rendererDomElement - 渲染器的 DOM 元素
     * @returns 配置好的控制器实例
     */
    public createControls(rendererDomElement: HTMLElement): OrbitControls {
        if (!this.camera) {
            throw new Error("相机必须在创建控制器之前被初始化");
        }

        const controls = new OrbitControls(this.camera, rendererDomElement);

        Object.entries(CONTROLS_DEFAULTS.ORBIT).forEach(([key, value]) => {
            (controls as any)[key] = value;
        });

        this.controls = controls;
        return controls;
    }

    /**
     * 更新相机尺寸
     *
     * @param width - 宽度
     * @param height - 高度
     */
    public updateSize(width: number, height: number): void {
        if (!this.camera) return;

        this.containerSize = { width, height };
        const aspect = height === 0 ? 1 : width / height;

        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
    }

    /**
     * 更新控制器（在渲染循环中调用）
     */
    public update(): void {
        if (this.controls) {
            this.controls.update();
        }
    }

    /**
     * 获取是否启用控制器
     *
     * @returns 是否启用控制器
     */
    public getEnableControls(): boolean {
        return this.enableControls;
    }

    /**
     * 销毁相机控制器
     */
    public destroy(): void {
        if (this.controls) {
            this.controls.dispose();
            this.controls = undefined;
        }

        this.camera = undefined;
    }
}
