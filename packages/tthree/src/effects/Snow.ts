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
 * 雪花配置选项。
 *
 * @public
 */
export interface SnowConfig {
    /** 粒子数量（默认 8000） */
    count?: number;
    /** 雪花颜色（默认 0xffffff） */
    color?: number;
    /** 雪花大小（默认 0.3） */
    size?: number;
    /** 下落速度（默认 5） */
    speed?: number;
    /** 雪花透明度（默认 0.8） */
    opacity?: number;
    /** 水平飘动幅度（默认 0.5） */
    drift?: number;
}

/**
 * 默认雪花配置。
 *
 * @internal
 */
const DEFAULT_SNOW_CONFIG: Required<SnowConfig> = {
    count: 8000,
    color: 0xffffff,
    size: 0.3,
    speed: 5,
    opacity: 0.8,
    drift: 0.5,
};

/**
 * 基础雪天气效果。
 *
 * @remarks
 * 使用 `Points + BufferGeometry` 实现的高性能粒子雪效果，
 * 支持根据 {@link WeatherState.wind} 与风场联动，形成飘雪效果。
 * 雪花具有自然的飘动特性，比雨滴下落更慢、受风影响更大。
 *
 * @example 基础用法
 * ```ts
 * const snow = new Snow({ count: 8000, speed: 5 });
 *
 * // 由 WeatherSystem 负责调用 init/start/update/dispose
 * weatherSystem.add(snow);
 * weatherSystem.play("snow");
 * ```
 *
 * @public
 */
export class Snow extends Weather {
    /** 雪花配置 */
    private config: Required<SnowConfig>;

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

    /** 粒子相位数组（用于飘动效果） */
    private phases: Float32Array | null = null;

    /**
     * 创建雪效果实例。
     *
     * @param config - 雪花配置选项。
     */
    constructor(config: SnowConfig = {}) {
        super("snow");
        this.config = { ...DEFAULT_SNOW_CONFIG, ...config };
    }

    /**
     * 初始化雪效果。
     *
     * @param ctx - 天气上下文。
     */
    public init(ctx: WeatherContext): void {
        this.ctx = ctx;

        const { count, color, size, opacity } = this.config;
        const { bounds } = ctx;

        // 创建粒子位置、速度和相位数组
        this.positions = new Float32Array(count * 3);
        this.velocities = new Float32Array(count);
        this.phases = new Float32Array(count);

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

            // 个体速度差异（0.6 ~ 1.4 倍速，雪花速度差异比雨滴大）
            this.velocities[i] = 0.6 + Math.random() * 0.8;

            // 随机相位（用于飘动效果，使每个雪花飘动不同步）
            this.phases[i] = Math.random() * Math.PI * 2;
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
        this.points.frustumCulled = false; // 禁用视锥剔除，确保雪花始终渲染
        this.points.visible = false; // 初始不可见，等待 start() 调用

        // 添加到场景
        ctx.scene.add(this.points);
    }

    /**
     * 启动雪效果。
     */
    public start(): void {
        if (!this.points) return;

        this._active = true;
        this.points.visible = true;
    }

    /**
     * 停止雪效果。
     */
    public stop(): void {
        if (!this.points) return;

        this._active = false;
        this.points.visible = false;
    }

    /**
     * 每帧更新雪花位置。
     *
     * @param dt - 距离上一帧的时间间隔（秒）。
     * @param t - 总运行时间（秒）。
     */
    public update(dt: number, t: number): void {
        if (!this._active || !this.ctx || !this.geometry) {
            return;
        }

        // 直接操作 BufferAttribute 的 array，确保更新生效
        const positionAttribute = this.geometry.attributes.position;
        const positions = positionAttribute.array as Float32Array;

        if (!positions || !this.velocities || !this.phases) {
            return;
        }

        const { bounds, state } = this.ctx;
        const { speed, drift } = this.config;
        const { wind } = state;

        // 计算有效速度（考虑强度）
        const effectiveSpeed = speed * this._intensity;

        // 获取风向影响（雪花比雨滴更容易受风影响，乘以 1.5 倍）
        const windX = wind.vector.x * this._intensity * 1.5;
        const windZ = wind.vector.z * this._intensity * 1.5;

        const count = this.config.count;
        const halfSizeX = bounds.size.x / 2;
        const halfSizeZ = bounds.size.z / 2;

        // 更新每个粒子位置
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const velocity = this.velocities[i];
            const phase = this.phases[i];

            // Y 轴：缓慢向下移动
            positions[i3 + 1] -= effectiveSpeed * velocity * dt;

            // X/Z 轴：正弦飘动 + 风向影响
            const driftX = Math.sin(t * 1.5 + phase) * drift;
            const driftZ = Math.cos(t * 1.2 + phase) * drift * 0.7;

            positions[i3] += (windX + driftX) * dt;
            positions[i3 + 2] += (windZ + driftZ) * dt;

            // 越界重生：当雪花落到地面以下时，重新放置到顶部
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
     * 销毁雪效果并释放所有相关资源。
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
        this.phases = null;
        this.ctx = null;
        this._active = false;
    }
}
