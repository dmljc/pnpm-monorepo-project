/**
 * @module SceneManager
 * @packageDocumentation
 *
 * # SceneManager 模块
 *
 * 场景管理器模块负责场景的创建、配置、对象管理和资源清理。
 *
 * ## 功能特性
 *
 * - 场景的创建和配置（背景、雾效、光照）
 * - 网格和坐标轴辅助工具的添加
 * - 场景对象的添加和移除
 * - 自动资源清理和内存管理
 *
 * ## 使用示例
 *
 * ```typescript
 * import { SceneManager } from 'tthree';
 *
 * const manager = new SceneManager({
 *   showGrid: true,
 *   showAxes: true
 * });
 *
 * // 创建场景
 * const scene = manager.createScene();
 *
 * // 添加网格对象
 * const mesh = new THREE.Mesh(geometry, material);
 * manager.addMesh(mesh);
 *
 * // 移除网格对象
 * manager.removeMesh(mesh);
 * ```
 */

import {
    Scene,
    Color,
    Fog,
    AmbientLight,
    DirectionalLight,
    GridHelper,
    AxesHelper,
    Mesh,
} from "three";
import { SCENE_DEFAULTS, GRID_DEFAULTS, AXES_DEFAULTS } from "./constants";
import { disposeMesh } from "../utils";

/**
 * 场景管理器配置选项
 */
export interface SceneManagerConfig {
    /** 是否显示网格 */
    showGrid?: boolean;
    /** 是否显示坐标轴 */
    showAxes?: boolean;
}

/**
 * 场景管理器类
 *
 * 负责场景的创建、配置、对象管理和资源清理
 */
export class SceneManager {
    /** 场景实例 */
    public scene: Scene | undefined;

    /** 场景配置 */
    private config: SceneManagerConfig;

    /**
     * 创建 SceneManager 实例
     *
     * @param config - 场景管理器配置选项
     */
    constructor(config: SceneManagerConfig = {}) {
        this.config = config;
    }

    /**
     * 创建网格
     *
     * @returns 网格实例
     */
    private createGrid(): GridHelper {
        return new GridHelper(
            GRID_DEFAULTS.SIZE,
            GRID_DEFAULTS.DIVISIONS,
            GRID_DEFAULTS.CENTER_COLOR,
            GRID_DEFAULTS.COLOR,
        );
    }

    /**
     * 创建坐标轴
     *
     * @returns 坐标轴实例
     */
    private createAxes(): AxesHelper {
        return new AxesHelper(AXES_DEFAULTS.SIZE);
    }

    /**
     * 创建场景
     *
     * @returns 配置好的场景实例
     */
    public createScene(): Scene {
        const scene = new Scene();
        scene.background = new Color(SCENE_DEFAULTS.BACKGROUND);
        scene.fog = new Fog(
            SCENE_DEFAULTS.FOG.color,
            SCENE_DEFAULTS.FOG.near,
            SCENE_DEFAULTS.FOG.far,
        );

        // 添加环境光（浅色背景下可以减弱）
        const ambientLight = new AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // 添加方向光
        const directionalLight = new DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        // 添加网格和坐标轴（根据配置）
        if (this.config.showGrid) {
            scene.add(this.createGrid());
        }

        if (this.config.showAxes) {
            scene.add(this.createAxes());
        }

        this.scene = scene;
        return scene;
    }

    /**
     * 向场景添加网格对象
     *
     * @param mesh - 要添加的网格对象
     */
    public addMesh(mesh: Mesh): void {
        if (!this.scene) {
            throw new Error("场景未初始化，无法添加网格");
        }

        this.scene.add(mesh);
    }

    /**
     * 从场景移除网格对象
     *
     * @param mesh - 要移除的网格对象
     */
    public removeMesh(mesh: Mesh): void {
        if (!this.scene) {
            throw new Error("场景未初始化，无法移除网格");
        }

        this.scene.remove(mesh);
    }

    /**
     * 销毁场景管理器
     */
    public destroy(): void {
        // 遍历场景中的所有对象，释放网格资源
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object instanceof Mesh) {
                    disposeMesh(object as Mesh);
                }
            });
            this.scene = undefined;
        }
    }
}
