import { Box3, Vector3 } from "three";
import type { Scene, Camera, WebGLRenderer } from "three";

/**
 * 风场状态。
 *
 * @public
 */
export interface WindState {
    /** 风向向量 (x, y, z) */
    vector: { x: number; y: number; z: number };
    /** 阵风强度 (0~1) */
    gust: number;
    /** 湍流强度 (0~1) */
    turbulence: number;
}

/**
 * 闪电状态（可选）。
 *
 * @public
 */
export interface LightningState {
    /** 最后一次闪电时间 */
    lastFlashTime: number;
    /** 最后一次闪电位置 */
    lastFlashPos: { x: number; y: number; z: number } | null;
    /** 闪电能量 (0~1) */
    flashEnergy: number;
}

/**
 * 天气共享状态。
 *
 * @remarks
 * 这是组合联动的核心模型，子天气通过读写各自负责的字段实现协作，
 * 避免在不同天气效果之间直接互相引用。
 *
 * @public
 */
export interface WeatherState {
    /** 风场状态 */
    wind: WindState;
    /** 暴风强度 (0~1) */
    stormLevel: number;
    /** 闪电状态（可选） */
    lightning?: LightningState;
}

/**
 * 天气效果作用边界。
 *
 * @remarks
 * 用于限制粒子或体积效果的空间范围，例如雨区、雪区等。
 *
 * @public
 */
export interface WeatherBounds {
    /** 边界盒 */
    box: Box3;
    /** 中心点 */
    center: { x: number; y: number; z: number };
    /** 尺寸 */
    size: { x: number; y: number; z: number };
}

/**
 * 天气上下文接口。
 *
 * @remarks
 * 提供天气效果所需的所有共享资源和状态，包括 Three.js 场景对象、
 * 统一的作用边界以及可共享的状态数据。
 *
 * @public
 */
export interface WeatherContext {
    /** Three.js 场景 */
    scene: Scene;
    /** Three.js 相机 */
    camera: Camera;
    /** Three.js 渲染器 */
    renderer: WebGLRenderer;
    /** 天气作用边界 */
    bounds: WeatherBounds;
    /** 共享状态（组合联动核心） */
    state: WeatherState;
    /** 音频管理器（可选） */
    audio?: unknown;
    /** 后处理管理器（可选） */
    postprocess?: unknown;
}

/**
 * 创建默认天气状态。
 *
 * @returns 一个新的 {@link WeatherState} 实例。
 *
 * @public
 */
export function createDefaultWeatherState(): WeatherState {
    return {
        wind: {
            vector: { x: 0, y: 0, z: 0 },
            gust: 0,
            turbulence: 0,
        },
        stormLevel: 0,
    };
}

/**
 * 创建默认天气边界。
 *
 * @returns 一个新的 {@link WeatherBounds} 实例。
 *
 * @public
 */
export function createDefaultWeatherBounds(): WeatherBounds {
    const box = new Box3(new Vector3(-50, 0, -50), new Vector3(50, 50, 50));
    return {
        box,
        center: { x: 0, y: 25, z: 0 },
        size: { x: 100, y: 50, z: 100 },
    };
}

/**
 * 天气抽象基类。
 *
 * @remarks
 * 统一生命周期与强度控制，保证任意天气都能被 {@link WeatherSystem} 或
 * 组合天气容器调度。
 *
 * ### 生命周期
 * 1. {@link Weather.init | init(ctx)} 初始化资源
 * 2. {@link Weather.start | start()} 启动效果
 * 3. {@link Weather.update | update(dt, t)} 每帧更新（仅在激活状态下调用）
 * 4. {@link Weather.stop | stop()} 停止效果
 * 5. {@link Weather.dispose | dispose()} 彻底释放资源
 *
 * @example 基础自定义天气
 * ```ts
 * class CustomWeather extends Weather {
 *   public init(ctx: WeatherContext): void {
 *     this.ctx = ctx;
 *     // 初始化资源（几何体、材质、音频等）
 *   }
 *
 *   public start(): void {
 *     this._active = true;
 *   }
 *
 *   public update(dt: number, t: number): void {
 *     // 根据 dt / t 更新效果
 *   }
 *
 *   public stop(): void {
 *     this._active = false;
 *   }
 *
 *   public dispose(): void {
 *     // 释放资源
 *   }
 * }
 * ```
 *
 * @public
 */
export abstract class Weather {
    /** 天气类型标识 */
    public readonly type: string;

    /** 天气上下文 */
    protected ctx: WeatherContext | null = null;

    /** 当前启用状态 */
    protected _active: boolean = false;

    /** 强度值 (0~1) */
    protected _intensity: number = 1;

    /**
     * 创建 Weather 实例。
     *
     * @param type - 天气类型标识（如 `"rain"`、`"snow"`、`"wind"` 等）。
     */
    constructor(type: string) {
        this.type = type;
    }

    /**
     * 获取当前启用状态。
     */
    public get active(): boolean {
        return this._active;
    }

    /**
     * 获取当前强度值。
     *
     * @remarks
     * 取值范围为 `0 ~ 1`，具体含义由子类自行解释
     *（例如雨量、风速、闪电频率等）。
     */
    public get intensity(): number {
        return this._intensity;
    }

    /**
     * 设置强度值。
     *
     * @remarks
     * 子类可以重写 {@link Weather.onIntensityChange} 以实现强度变化时的
     * 自定义映射逻辑（例如更新粒子数量、速度或音量）。
     *
     * @param value - 强度值（`0 ~ 1`）。
     */
    public set intensity(value: number) {
        this._intensity = Math.max(0, Math.min(1, value));
        this.onIntensityChange(this._intensity);
    }

    /**
     * 强度变化时的回调。
     *
     * @remarks
     * 默认实现为空，子类可以重写此方法以响应强度变化，
     * 例如更新材质不透明度、粒子发射速率等。
     *
     * @param intensity - 归一化后的强度值（`0 ~ 1`）。
     */
    protected onIntensityChange(_intensity: number): void {
        // 默认空实现，子类可重写
    }

    /**
     * 初始化资源。
     *
     * @remarks
     * 典型操作包括向场景中添加对象、创建材质和纹理、注册音频或后处理效果等。
     *
     * @param ctx - 天气上下文。
     */
    public abstract init(ctx: WeatherContext): void;

    /**
     * 启动天气效果。
     *
     * @remarks
     * 建议支持渐入效果，但不是强制要求。
     */
    public abstract start(): void;

    /**
     * 停止天气效果。
     *
     * @remarks
     * 建议支持渐出效果，但不是强制要求。
     */
    public abstract stop(): void;

    /**
     * 每帧更新。
     *
     * @remarks
     * 仅在 `active === true` 时由 {@link WeatherSystem.tick} 调用。
     *
     * @param dt - 距离上一帧的时间间隔（秒）。
     * @param t - 自系统启动以来的总运行时间（秒）。
     */
    public abstract update(dt: number, t: number): void;

    /**
     * 彻底释放资源。
     *
     * @remarks
     * 典型操作包括：
     * - 从场景中移除对象；
     * - 调用 `dispose()` 释放几何体和材质；
     * - 解绑事件或定时器等。
     */
    public abstract dispose(): void;
}
