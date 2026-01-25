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
 * 负责管理所有天气效果的添加、切换、每帧更新和统一销毁。
 *
 * - {@link WeatherSystem.add | add(weather)} 添加天气效果
 * - {@link WeatherSystem.play | play(typeOrWeather)} 播放/激活天气
 * - {@link WeatherSystem.update | update(delta, elapsed)} 每帧驱动已激活天气更新
 * - {@link WeatherSystem.dispose | dispose()} 释放所有天气资源
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
 * system.add(rain);
 * system.play("rain");
 *
 * app.addFrameUpdater((delta) => system.update(delta));
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
     *
     * @returns 当前天气上下文。
     */
    public getContext(): WeatherContext {
        return this.ctx;
    }

    /**
     * 获取共享状态。
     *
     * @returns 当前共享状态。
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
     * 添加天气效果。
     *
     * @remarks
     * 参考 Three.js 的 `scene.add()` API。
     *
     * @param weather - 天气效果实例。
     * @returns this - 支持链式调用。
     */
    public add(weather: Weather): this {
        if (this.weathers.has(weather.type)) {
            console.warn(
                `[WeatherSystem] 天气类型 "${weather.type}" 已存在，将被覆盖`,
            );
            // 先销毁旧的
            this.remove(weather.type);
        }

        // 初始化天气效果
        weather.init(this.ctx);

        // 添加到映射
        this.weathers.set(weather.type, weather);

        return this;
    }

    /**
     * 移除天气效果。
     *
     * @remarks
     * 参考 Three.js 的 `scene.remove()` API。
     *
     * @param typeOrWeather - 天气类型标识或天气效果实例。
     * @returns this - 支持链式调用。
     */
    public remove(typeOrWeather: string | Weather): this {
        const type =
            typeof typeOrWeather === "string"
                ? typeOrWeather
                : typeOrWeather.type;
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
     * 播放/激活天气效果。
     *
     * @remarks
     * 参考 Three.js 的 `audio.play()` API。
     *
     * @param typeOrWeather - 天气类型标识或天气效果实例。
     * @param strategy - 可选的切换策略（覆盖默认策略）。
     * @returns this - 支持链式调用。
     */
    public play(
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
                `[WeatherSystem] 天气 "${typeOrWeather}" 未添加，无法播放`,
            );
            return this;
        }

        // 如果是替换策略，先停止所有当前激活的天气
        if (effectiveStrategy === "replace") {
            this.stop();
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
     * @remarks
     * 参考 Three.js 的 `audio.stop()` API。
     *
     * @param typeOrWeather - 天气类型标识或天气效果实例。如果不传，则停止所有。
     * @returns this - 支持链式调用。
     */
    public stop(typeOrWeather?: string | Weather): this {
        if (typeOrWeather === undefined) {
            // 停止所有激活的天气效果
            for (const weather of this.activeWeathers) {
                weather.stop();
            }
            this.activeWeathers.clear();
            return this;
        }

        // 停止指定天气
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
     * 清空所有激活的天气效果。
     *
     * @remarks
     * 参考 Three.js 的 `scene.clear()` API。
     *
     * @returns this - 支持链式调用。
     */
    public clear(): this {
        for (const weather of this.activeWeathers) {
            weather.stop();
        }
        this.activeWeathers.clear();
        return this;
    }

    /**
     * 每帧更新（由 {@link Tthree.addFrameUpdater} 注册的钩子调用）。
     *
     * @remarks
     * 参考 Three.js 的 `mixer.update(deltaTime)` API。
     *
     * @param delta - 距离上一帧的时间间隔（秒）。
     * @param elapsed - 总运行时间（秒，可选）。
     */
    public update(delta: number, elapsed?: number): void {
        for (const weather of this.activeWeathers) {
            if (weather.active) {
                weather.update(delta, elapsed || 0);
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
     * 释放天气系统占用的所有资源。
     *
     * @remarks
     * 参考 Three.js 的 `material.dispose()` API。
     * 会停止所有激活的天气并销毁所有已添加的天气效果。
     */
    public dispose(): void {
        // 停止所有激活的天气
        this.stop();

        // 销毁所有已添加的天气
        for (const weather of this.weathers.values()) {
            weather.dispose();
        }

        this.weathers.clear();
    }
}
