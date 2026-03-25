import {
    Points,
    BufferGeometry,
    Float32BufferAttribute,
    Color,
    AdditiveBlending,
    CanvasTexture,
    ShaderMaterial,
    Texture,
} from "three";
import { Weather, type WeatherContext } from "./Weather";

/**
 * 雪花配置选项。
 *
 * @public
 */
export interface SnowConfig {
    /** 粒子数量（默认 10000） */
    count?: number;
    /** 雪花颜色（默认 0xffffff） */
    color?: number;
    /** 雪花基础大小（默认 8.0） */
    size?: number;
    /** 雪花大小随机变化范围（默认 0.6，即 0.4~1.0 倍） */
    sizeVariation?: number;
    /** 下落速度（默认 3） */
    speed?: number;
    /** 雪花透明度（默认 0.9） */
    opacity?: number;
    /** 水平飘动幅度（默认 0.8） */
    drift?: number;
    /** 旋转速度（默认 1.5） */
    rotationSpeed?: number;
    /** 是否启用景深效果（默认 true） */
    enableDepthFade?: boolean;
    /** 景深淡出起始距离（默认 30） */
    depthFadeStart?: number;
    /** 景深淡出结束距离（默认 80） */
    depthFadeEnd?: number;
    /** 自定义纹理（可选，默认使用内置生成的雪花纹理） */
    texture?: Texture;
}

/**
 * 默认雪花配置。
 *
 * @internal
 */
const DEFAULT_SNOW_CONFIG: Required<Omit<SnowConfig, "texture">> = {
    count: 10000,
    color: 0xffffff,
    size: 8.0,
    sizeVariation: 0.6,
    speed: 3,
    opacity: 0.9,
    drift: 0.8,
    rotationSpeed: 1.5,
    enableDepthFade: true,
    depthFadeStart: 30,
    depthFadeEnd: 80,
};

/**
 * 在指定位置绘制树枝状雪花。
 *
 * @param ctx - Canvas 2D 上下文。
 * @param centerX - 雪花中心 X 坐标。
 * @param centerY - 雪花中心 Y 坐标。
 * @param radius - 雪花半径。
 *
 * @internal
 */
function drawSnowflake(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
): void {
    // 创建径向渐变背景（柔和的光晕效果）
    const bgGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius,
    );
    bgGradient.addColorStop(0, "rgba(255, 255, 255, 0.6)");
    bgGradient.addColorStop(0.3, "rgba(255, 255, 255, 0.3)");
    bgGradient.addColorStop(0.6, "rgba(255, 255, 255, 0.1)");
    bgGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // 使用纯白色绘制雪花
    ctx.strokeStyle = "#ffffff";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const branches = 6;
    const angleStep = (Math.PI * 2) / branches;

    // 树枝状雪花 - 复杂的分支结构
    for (let i = 0; i < branches; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const mainLength = radius * 0.85;
        const endX = centerX + Math.cos(angle) * mainLength;
        const endY = centerY + Math.sin(angle) * mainLength;

        ctx.lineWidth = radius / 10;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // 侧分支
        for (let j = 1; j <= 3; j++) {
            const ratio = j / 4;
            const branchX = centerX + Math.cos(angle) * mainLength * ratio;
            const branchY = centerY + Math.sin(angle) * mainLength * ratio;
            const branchLength = mainLength * 0.4 * (1 - ratio * 0.5);

            ctx.lineWidth = radius / 16;
            for (const side of [-1, 1]) {
                const sideAngle = angle + (side * Math.PI) / 4;
                ctx.beginPath();
                ctx.moveTo(branchX, branchY);
                ctx.lineTo(
                    branchX + Math.cos(sideAngle) * branchLength,
                    branchY + Math.sin(sideAngle) * branchLength,
                );
                ctx.stroke();
            }
        }
    }

    // 中心高亮点
    const centerGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius / 5,
    );
    centerGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    centerGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
    centerGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = centerGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius / 5, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * 生成雪花纹理。
 *
 * @remarks
 * 使用 Canvas 2D API 动态生成树枝状雪花纹理。
 *
 * @param size - 纹理尺寸（默认 128）。
 * @returns 生成的 CanvasTexture。
 *
 * @internal
 */
function createSnowflakeTexture(size: number = 128): CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // 清空画布
    ctx.clearRect(0, 0, size, size);

    // 绘制雪花
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 4;

    drawSnowflake(ctx, centerX, centerY, radius);

    const texture = new CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
}

/**
 * 雪花顶点着色器。
 *
 * @remarks
 * 实现粒子大小衰减、旋转效果和景深淡出。
 *
 * @internal
 */
const snowVertexShader = /* glsl */ `
    uniform float uTime;
    uniform float uSize;
    uniform float uPixelRatio;
    uniform float uRotationSpeed;
    uniform float uDepthFadeStart;
    uniform float uDepthFadeEnd;
    uniform bool uEnableDepthFade;

    attribute float aScale;
    attribute float aRotation;
    attribute float aRotationSpeed;

    varying float vRotation;
    varying float vAlpha;

    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        gl_Position = projectedPosition;

        // 计算粒子大小（考虑距离衰减）
        float sizeAttenuation = 1.0 / -viewPosition.z;
        gl_PointSize = uSize * aScale * uPixelRatio * sizeAttenuation * 100.0;

        // 限制最大和最小粒子大小
        gl_PointSize = clamp(gl_PointSize, 1.0, 64.0);

        // 传递旋转角度到片段着色器
        vRotation = aRotation + uTime * uRotationSpeed * aRotationSpeed;

        // 计算景深淡出
        if (uEnableDepthFade) {
            float depth = -viewPosition.z;
            vAlpha = 1.0 - smoothstep(uDepthFadeStart, uDepthFadeEnd, depth);
        } else {
            vAlpha = 1.0;
        }
    }
`;

/**
 * 雪花片段着色器。
 *
 * @remarks
 * 实现纹理采样、旋转和透明度混合。
 *
 * @internal
 */
const snowFragmentShader = /* glsl */ `
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uOpacity;

    varying float vRotation;
    varying float vAlpha;

    void main() {
        vec2 center = vec2(0.5);
        vec2 uv = gl_PointCoord - center;

        // 计算旋转后的 UV 坐标
        float cosR = cos(vRotation);
        float sinR = sin(vRotation);
        vec2 rotatedUV = vec2(
            uv.x * cosR - uv.y * sinR,
            uv.x * sinR + uv.y * cosR
        ) + center;

        // 采样纹理
        vec4 texColor = texture2D(uTexture, rotatedUV);

        // 计算最终透明度
        float finalAlpha = texColor.a * uOpacity * vAlpha;

        // 丢弃几乎完全透明的片段
        if (finalAlpha < 0.01) discard;

        // 应用颜色和透明度
        vec3 finalColor = uColor * texColor.rgb;
        gl_FragColor = vec4(finalColor, finalAlpha);
    }
`;

/**
 * 雪天气效果。
 *
 * @remarks
 * 使用 `Points + 自定义 ShaderMaterial` 实现的高性能粒子雪效果，
 * 支持根据 {@link WeatherState.wind} 与风场联动，形成飘雪效果。
 *
 * ### 特性
 * - **逼真纹理**：使用 Canvas 动态生成六角形树枝状雪花纹理
 * - **旋转动画**：每个雪花具有独立的旋转速度
 * - **大小变化**：粒子大小随机变化，增加层次感
 * - **景深淡出**：远处雪花逐渐淡出，增强空间感
 * - **风场联动**：雪花比雨滴更容易受风影响
 *
 * @example 基础用法
 * ```ts
 * const snow = new Snow({ count: 10000, speed: 3 });
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
    private config: Required<Omit<SnowConfig, "texture">> & {
        texture?: Texture;
    };

    /** 粒子系统 */
    private points: Points | null = null;

    /** 粒子几何体 */
    private geometry: BufferGeometry | null = null;

    /** 粒子材质 */
    private material: ShaderMaterial | null = null;

    /** 雪花纹理 */
    private texture: Texture | null = null;

    /** 粒子位置数组 */
    private positions: Float32Array | null = null;

    /** 粒子速度数组（用于个体速度差异） */
    private velocities: Float32Array | null = null;

    /** 粒子相位数组（用于飘动效果） */
    private phases: Float32Array | null = null;

    /** 粒子缩放数组（用于大小变化） */
    private scales: Float32Array | null = null;

    /** 粒子旋转角度数组 */
    private rotations: Float32Array | null = null;

    /** 粒子旋转速度数组 */
    private rotationSpeeds: Float32Array | null = null;

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

        const {
            count,
            color,
            size,
            sizeVariation,
            opacity,
            rotationSpeed,
            enableDepthFade,
            depthFadeStart,
            depthFadeEnd,
            texture,
        } = this.config;
        const { bounds } = ctx;

        // 创建粒子属性数组
        this.positions = new Float32Array(count * 3);
        this.velocities = new Float32Array(count);
        this.phases = new Float32Array(count);
        this.scales = new Float32Array(count);
        this.rotations = new Float32Array(count);
        this.rotationSpeeds = new Float32Array(count);

        // 初始化粒子属性
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // 位置：在边界范围内随机分布
            this.positions[i3] =
                bounds.center.x + (Math.random() - 0.5) * bounds.size.x;
            this.positions[i3 + 1] = Math.random() * bounds.size.y;
            this.positions[i3 + 2] =
                bounds.center.z + (Math.random() - 0.5) * bounds.size.z;

            // 个体速度差异（0.5 ~ 1.5 倍速）
            this.velocities[i] = 0.5 + Math.random();

            // 随机相位（用于飘动效果）
            this.phases[i] = Math.random() * Math.PI * 2;

            // 随机缩放（基于 sizeVariation）
            this.scales[i] =
                1 - sizeVariation / 2 + Math.random() * sizeVariation;

            // 随机初始旋转角度
            this.rotations[i] = Math.random() * Math.PI * 2;

            // 随机旋转速度（-1 ~ 1，有些顺时针有些逆时针）
            this.rotationSpeeds[i] = (Math.random() - 0.5) * 2;
        }

        // 创建几何体
        this.geometry = new BufferGeometry();
        this.geometry.setAttribute(
            "position",
            new Float32BufferAttribute(this.positions, 3),
        );
        this.geometry.setAttribute(
            "aScale",
            new Float32BufferAttribute(this.scales, 1),
        );
        this.geometry.setAttribute(
            "aRotation",
            new Float32BufferAttribute(this.rotations, 1),
        );
        this.geometry.setAttribute(
            "aRotationSpeed",
            new Float32BufferAttribute(this.rotationSpeeds, 1),
        );

        // 创建纹理（使用自定义纹理或内置生成的雪花纹理）
        this.texture = texture || createSnowflakeTexture(128);

        // 获取设备像素比
        const pixelRatio = ctx.renderer.getPixelRatio();

        // 创建自定义着色器材质
        this.material = new ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: size },
                uPixelRatio: { value: pixelRatio },
                uRotationSpeed: { value: rotationSpeed },
                uTexture: { value: this.texture },
                uColor: { value: new Color(color) },
                uOpacity: { value: opacity },
                uEnableDepthFade: { value: enableDepthFade },
                uDepthFadeStart: { value: depthFadeStart },
                uDepthFadeEnd: { value: depthFadeEnd },
            },
            vertexShader: snowVertexShader,
            fragmentShader: snowFragmentShader,
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
        });

        // 创建粒子系统
        this.points = new Points(this.geometry, this.material);
        this.points.frustumCulled = false;
        this.points.visible = false;

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
        if (!this._active || !this.ctx || !this.geometry || !this.material) {
            return;
        }

        // 更新时间 uniform（用于旋转动画）
        this.material.uniforms.uTime.value = t;

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

        // 释放纹理（仅释放内部生成的纹理，外部传入的不释放）
        if (this.texture && !this.config.texture) {
            this.texture.dispose();
        }
        this.texture = null;

        // 清空引用
        this.points = null;
        this.positions = null;
        this.velocities = null;
        this.phases = null;
        this.scales = null;
        this.rotations = null;
        this.rotationSpeeds = null;
        this.ctx = null;
        this._active = false;
    }
}
