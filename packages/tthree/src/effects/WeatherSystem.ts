import type { Scene, Camera, WebGLRenderer } from "three";
import {
    Weather,
    type WeatherContext,
    type WeatherState,
    type WeatherBounds,
    createDefaultWeatherState,
    createDefaultWeatherBounds,
} from "./Weather";

/**
 * {@link WeatherSystem} 配置选项。
 *
 * @public
 */
export interface WeatherSystemConfig {
    /** Three.js 场景 */
    scene: Scene;
    /** Three.js 相机 */
    camera: Camera;
    /** Three.js 渲染器 */
    renderer: WebGLRenderer;
    /** 天气作用边界（可选） */
    bounds?: WeatherBounds;
    /** 初始状态（可选） */
    state?: Partial<WeatherState>;
}

/**
 * 天气切换策略。
 *
 * @public
 */
export type WeatherSwitchStrategy = "replace" | "overlay";

/**
 * 天气系统管理器。
 *
 * @remarks
 * 负责管理所有天气效果的注册、切换、每帧更新和统一销毁。
 *
 * - {@link WeatherSystem.register | register(weather)} 注册天气效果
 * - {@link WeatherSystem.setActive | setActive(typeOrWeather)} 切换当前天气
 * - {@link WeatherSystem.tick | tick(dt, t)} 每帧驱动已激活天气更新
 * - {@link WeatherSystem.disposeAll | disposeAll()} 统一释放所有天气资源
 *
 * @example 基础用法
 * ```ts
 * const system = new WeatherSystem({
 *   scene: app.scene!,
 *   camera: app.camera!,
 *   renderer: app.renderer!,
 * });
 *
 * const rain = new Rain({ count: 10000 });
 * system.register(rain);
 * system.setActive("rain");
 *
 * app.addFrameUpdater((dt, t) => system.tick(dt, t));
 * ```
 *
 * @public
 */
export class WeatherSystem {
    /** 天气上下文 */
    private ctx: WeatherContext;

    /** 已注册的天气效果映射 */
    private weathers: Map<string, Weather> = new Map();

    /** 当前激活的天气效果集合（支持多个叠加） */
    private activeWeathers: Set<Weather> = new Set();

    /** 切换策略 */
    private strategy: WeatherSwitchStrategy = "replace";

    /**
     * 创建 {@link WeatherSystem} 实例。
     *
     * @param config - 配置选项。
     */
    constructor(config: WeatherSystemConfig) {
        // 创建默认状态
        const defaultState = createDefaultWeatherState();
        const state: WeatherState = {
            ...defaultState,
            ...config.state,
        };

        // 创建上下文
        this.ctx = {
            scene: config.scene,
            camera: config.camera,
            renderer: config.renderer,
            bounds: config.bounds || createDefaultWeatherBounds(),
            state,
        };
    }

    /**
     * 获取天气上下文。
     */
    public getContext(): WeatherContext {
        return this.ctx;
    }

    /**
     * 获取共享状态。
     */
    public getState(): WeatherState {
        return this.ctx.state;
    }

    /**
     * 更新共享状态。
     *
     * @param updates - 要更新的状态字段。
     */
    public updateState(updates: Partial<WeatherState>): void {
        Object.assign(this.ctx.state, updates);
    }

    /**
     * 更新风场状态。
     *
     * @param wind - 风场参数。
     */
    public setWind(wind: Partial<WeatherState["wind"]>): void {
        Object.assign(this.ctx.state.wind, wind);
    }

    /**
     * 设置切换策略。
     *
     * @param strategy - `"replace"` 替换当前天气，`"overlay"` 叠加天气。
     */
    public setStrategy(strategy: WeatherSwitchStrategy): void {
        this.strategy = strategy;
    }

    /**
     * 注册天气效果。
     *
     * @param weather - 天气效果实例。
     * @returns this - 支持链式调用。
     */
    public register(weather: Weather): this {
        if (this.weathers.has(weather.type)) {
            console.warn(
                `[WeatherSystem] 天气类型 "${weather.type}" 已存在，将被覆盖`,
            );
            // 先销毁旧的
            this.unregister(weather.type);
        }

        // 初始化天气效果
        weather.init(this.ctx);

        // 添加到映射
        this.weathers.set(weather.type, weather);

        return this;
    }

    /**
     * 注销天气效果。
     *
     * @param type - 天气类型标识。
     * @returns this - 支持链式调用。
     */
    public unregister(type: string): this {
        const weather = this.weathers.get(type);
        if (weather) {
            // 如果正在激活，先停止
            if (this.activeWeathers.has(weather)) {
                weather.stop();
                this.activeWeathers.delete(weather);
            }

            // 销毁并移除
            weather.dispose();
            this.weathers.delete(type);
        }

        return this;
    }

    /**
     * 获取已注册的天气效果。
     *
     * @param type - 天气类型标识。
     * @returns 天气效果实例或 `undefined`。
     */
    public get(type: string): Weather | undefined {
        return this.weathers.get(type);
    }

    /**
     * 检查天气效果是否已注册。
     *
     * @param type - 天气类型标识。
     * @returns 是否已注册。
     */
    public has(type: string): boolean {
        return this.weathers.has(type);
    }

    /**
     * 设置激活的天气效果。
     *
     * @param typeOrWeather - 天气类型标识或天气效果实例。
     * @param strategy - 可选的切换策略（覆盖默认策略）。
     * @returns this - 支持链式调用。
     */
    public setActive(
        typeOrWeather: string | Weather,
        strategy?: WeatherSwitchStrategy,
    ): this {
        const effectiveStrategy = strategy || this.strategy;
        const weather =
            typeof typeOrWeather === "string"
                ? this.weathers.get(typeOrWeather)
                : typeOrWeather;

        if (!weather) {
            console.warn(
                `[WeatherSystem] 天气 "${typeOrWeather}" 未注册，无法激活`,
            );
            return this;
        }

        // 如果是替换策略，先停止所有当前激活的天气
        if (effectiveStrategy === "replace") {
            this.stopAll();
        }

        // 启动新天气
        if (!this.activeWeathers.has(weather)) {
            weather.start();
            this.activeWeathers.add(weather);
        }

        return this;
    }

    /**
     * 停止指定天气效果。
     *
     * @param typeOrWeather - 天气类型标识或天气效果实例。
     * @returns this - 支持链式调用。
     */
    public deactivate(typeOrWeather: string | Weather): this {
        const weather =
            typeof typeOrWeather === "string"
                ? this.weathers.get(typeOrWeather)
                : typeOrWeather;

        if (weather && this.activeWeathers.has(weather)) {
            weather.stop();
            this.activeWeathers.delete(weather);
        }

        return this;
    }

    /**
     * 停止所有激活的天气效果。
     *
     * @returns this - 支持链式调用。
     */
    public stopAll(): this {
        for (const weather of this.activeWeathers) {
            weather.stop();
        }
        this.activeWeathers.clear();

        return this;
    }

    /**
     * 每帧更新（由 {@link ThreeApp.addFrameUpdater} 注册的钩子调用）。
     *
     * @param dt - 距离上一帧的时间间隔（秒）。
     * @param t - 总运行时间（秒）。
     */
    public tick(dt: number, t: number): void {
        for (const weather of this.activeWeathers) {
            if (weather.active) {
                weather.update(dt, t);
            }
        }
    }

    /**
     * 设置天气效果强度。
     *
     * @param type - 天气类型标识。
     * @param intensity - 强度值（`0 ~ 1`）。
     * @returns this - 支持链式调用。
     */
    public setIntensity(type: string, intensity: number): this {
        const weather = this.weathers.get(type);
        if (weather) {
            weather.intensity = intensity;
        }
        return this;
    }

    /**
     * 更新天气作用边界。
     *
     * @param bounds - 新的边界配置。
     */
    public setBounds(bounds: Partial<WeatherBounds>): void {
        Object.assign(this.ctx.bounds, bounds);
    }

    /**
     * 获取所有已注册的天气类型。
     *
     * @returns 天气类型标识数组。
     */
    public getRegisteredTypes(): string[] {
        return Array.from(this.weathers.keys());
    }

    /**
     * 获取所有当前激活的天气类型。
     *
     * @returns 激活的天气类型标识数组。
     */
    public getActiveTypes(): string[] {
        return Array.from(this.activeWeathers).map((w) => w.type);
    }

    /**
     * 销毁所有天气效果并释放资源。
     */
    public disposeAll(): void {
        // 停止所有激活的天气
        this.stopAll();

        // 销毁所有注册的天气
        for (const weather of this.weathers.values()) {
            weather.dispose();
        }

        this.weathers.clear();
    }

    /**
     * 销毁天气系统。
     */
    public destroy(): void {
        this.disposeAll();
    }
}
