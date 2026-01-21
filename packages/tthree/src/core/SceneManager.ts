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
import {
    SCENE_DEFAULTS,
    GRID_DEFAULTS,
    AXES_DEFAULTS,
} from "../config/constants";
import { disposeObject } from "../utils";

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
 * 场景管理器类：负责场景的创建、配置、对象管理和资源清理
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
 * const mesh = new Mesh(geometry, material);
 * manager.addMesh(mesh);
 *
 * // 移除网格对象
 * manager.removeMesh(mesh);
 * ```
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
        const ambientLight = new AmbientLight(0xffffff);
        scene.add(ambientLight);

        // 添加方向光
        const directionalLight = new DirectionalLight(0xffffff);
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
     * 释放场景管理器占用的资源
     */
    public dispose(): void {
        if (this.scene) {
            // 使用递归释放场景中所有对象的资源
            disposeObject(this.scene);
            this.scene = undefined;
        }
    }
}
