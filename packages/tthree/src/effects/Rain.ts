import {
    Points,
    BufferGeometry,
    Float32BufferAttribute,
    PointsMaterial,
    Color,
    AdditiveBlending,
} from "three";
import { Weather, type WeatherContext } from "./Weather";

/**
 * 雨滴配置选项。
 *
 * @public
 */
export interface RainConfig {
    /** 粒子数量（默认 10000） */
    count?: number;
    /** 雨滴颜色（默认 0xaaaaaa） */
    color?: number;
    /** 雨滴大小（默认 0.1） */
    size?: number;
    /** 下落速度（默认 25） */
    speed?: number;
    /** 雨滴透明度（默认 0.6） */
    opacity?: number;
}

/**
 * 默认雨滴配置。
 *
 * @internal
 */
const DEFAULT_RAIN_CONFIG: Required<RainConfig> = {
    count: 10000,
    color: 0xaaaaaa,
    size: 0.1,
    speed: 25,
    opacity: 0.6,
};

/**
 * 基础雨天气效果。
 *
 * @remarks
 * 使用 `Points + BufferGeometry` 实现的高性能粒子雨效果，
 * 支持根据 {@link WeatherState.wind} 与风场联动，形成斜雨效果。
 *
 * @example 基础用法
 * ```ts
 * const rain = new Rain({ count: 10000, speed: 30 });
 *
 * // 由 WeatherSystem 负责调用 init/start/update/dispose
 * weatherSystem.add(rain);
 * weatherSystem.play("rain");
 * ```
 *
 * @public
 */
export class Rain extends Weather {
    /** 雨滴配置 */
    private config: Required<RainConfig>;

    /** 粒子系统 */
    private points: Points | null = null;

    /** 粒子几何体 */
    private geometry: BufferGeometry | null = null;

    /** 粒子材质 */
    private material: PointsMaterial | null = null;

    /** 粒子位置数组 */
    private positions: Float32Array | null = null;

    /** 粒子速度数组（用于个体速度差异） */
    private velocities: Float32Array | null = null;

    /**
     * 创建雨效果实例。
     *
     * @param config - 雨滴配置选项。
     */
    constructor(config: RainConfig = {}) {
        super("rain");
        this.config = { ...DEFAULT_RAIN_CONFIG, ...config };
    }

    /**
     * 初始化雨效果。
     *
     * @param ctx - 天气上下文。
     */
    public init(ctx: WeatherContext): void {
        this.ctx = ctx;

        const { count, color, size, opacity } = this.config;
        const { bounds } = ctx;

        // 创建粒子位置和速度数组
        this.positions = new Float32Array(count * 3);
        this.velocities = new Float32Array(count);

        // 初始化粒子位置（在边界范围内随机分布）
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // X: 在边界范围内随机
            this.positions[i3] =
                bounds.center.x + (Math.random() - 0.5) * bounds.size.x;

            // Y: 在边界高度范围内随机
            this.positions[i3 + 1] = Math.random() * bounds.size.y;

            // Z: 在边界范围内随机
            this.positions[i3 + 2] =
                bounds.center.z + (Math.random() - 0.5) * bounds.size.z;

            // 个体速度差异（0.8 ~ 1.2 倍速）
            this.velocities[i] = 0.8 + Math.random() * 0.4;
        }

        // 创建几何体
        this.geometry = new BufferGeometry();
        this.geometry.setAttribute(
            "position",
            new Float32BufferAttribute(this.positions, 3),
        );

        // 创建材质
        this.material = new PointsMaterial({
            color: new Color(color),
            size: size,
            transparent: true,
            opacity: opacity,
            blending: AdditiveBlending,
            depthWrite: false,
            sizeAttenuation: true,
        });

        // 创建粒子系统
        this.points = new Points(this.geometry, this.material);
        this.points.frustumCulled = false; // 禁用视锥剔除，确保雨滴始终渲染
        this.points.visible = false; // 初始不可见，等待 start() 调用

        // 添加到场景
        ctx.scene.add(this.points);
    }

    /**
     * 启动雨效果。
     */
    public start(): void {
        if (!this.points) return;

        this._active = true;
        this.points.visible = true;
    }

    /**
     * 停止雨效果。
     */
    public stop(): void {
        if (!this.points) return;

        this._active = false;
        this.points.visible = false;
    }

    /**
     * 每帧更新雨滴位置。
     *
     * @param dt - 距离上一帧的时间间隔（秒）。
     * @param _t - 总运行时间（秒，暂未使用）。
     */
    public update(dt: number, _t: number): void {
        if (!this._active || !this.ctx || !this.geometry) {
            return;
        }

        // 直接操作 BufferAttribute 的 array，确保更新生效
        const positionAttribute = this.geometry.attributes.position;
        const positions = positionAttribute.array as Float32Array;

        if (!positions || !this.velocities) {
            return;
        }

        const { bounds, state } = this.ctx;
        const { speed } = this.config;
        const { wind } = state;

        // 计算有效速度（考虑强度）
        const effectiveSpeed = speed * this._intensity;

        // 获取风向影响
        const windX = wind.vector.x * this._intensity;
        const windZ = wind.vector.z * this._intensity;

        const count = this.config.count;
        const halfSizeX = bounds.size.x / 2;
        const halfSizeZ = bounds.size.z / 2;

        // 更新每个粒子位置
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const velocity = this.velocities[i];

            // Y 轴：向下移动
            positions[i3 + 1] -= effectiveSpeed * velocity * dt;

            // X/Z 轴：受风向影响
            positions[i3] += windX * dt;
            positions[i3 + 2] += windZ * dt;

            // 越界重生：当雨滴落到地面以下时，重新放置到顶部
            if (positions[i3 + 1] < 0) {
                // 重置到顶部
                positions[i3 + 1] = bounds.size.y;

                // 重新随机 X/Z 位置
                positions[i3] =
                    bounds.center.x + (Math.random() - 0.5) * bounds.size.x;
                positions[i3 + 2] =
                    bounds.center.z + (Math.random() - 0.5) * bounds.size.z;
            }

            // X 轴越界处理（循环）
            if (positions[i3] < bounds.center.x - halfSizeX) {
                positions[i3] = bounds.center.x + halfSizeX;
            } else if (positions[i3] > bounds.center.x + halfSizeX) {
                positions[i3] = bounds.center.x - halfSizeX;
            }

            // Z 轴越界处理（循环）
            if (positions[i3 + 2] < bounds.center.z - halfSizeZ) {
                positions[i3 + 2] = bounds.center.z + halfSizeZ;
            } else if (positions[i3 + 2] > bounds.center.z + halfSizeZ) {
                positions[i3 + 2] = bounds.center.z - halfSizeZ;
            }
        }

        // 标记位置属性需要更新
        positionAttribute.needsUpdate = true;
    }

    /**
     * 强度变化时更新材质透明度。
     *
     * @param intensity - 新的强度值。
     */
    protected onIntensityChange(intensity: number): void {
        if (this.material) {
            this.material.opacity = this.config.opacity * intensity;
        }
    }

    /**
     * 销毁雨效果并释放所有相关资源。
     */
    public dispose(): void {
        // 从场景移除
        if (this.points && this.ctx) {
            this.ctx.scene.remove(this.points);
        }

        // 释放几何体
        if (this.geometry) {
            this.geometry.dispose();
            this.geometry = null;
        }

        // 释放材质
        if (this.material) {
            this.material.dispose();
            this.material = null;
        }

        // 清空引用
        this.points = null;
        this.positions = null;
        this.velocities = null;
        this.ctx = null;
        this._active = false;
    }
}
