import { Box3, Vector3 } from "three";
import type { Tthree } from "../core/Tthree";
import { Rain } from "./Rain";
import { Snow } from "./Snow";
import { WeatherSystem } from "./WeatherSystem";

/**
 * `setupRainWeather` 的配置选项。
 *
 * @public
 */
export interface SetupRainWeatherOptions {
    /**
     * 雨覆盖区域半尺寸，单位与场景一致（默认 `200`，对应 `400 × 400` 的正方形区域）。
     */
    areaHalfSize?: number;
    /**
     * 雨高度（默认 `100`）。
     */
    height?: number;
    /**
     * 雨配置（粒子数量、速度、尺寸、透明度）。
     */
    rain?: {
        count?: number;
        speed?: number;
        size?: number;
        opacity?: number;
    };
    /**
     * 风向向量（默认 `{ x: 3, y: 0, z: 1 }`，形成略微倾斜的雨线）。
     */
    windVector?: { x: number; y: number; z: number };
}

/**
 * `setupRainWeather` 的返回句柄。
 *
 * @remarks
 * 返回“句柄对象”而不是直接返回函数，便于调用端使用 `handle.dispose()` 的方式清理资源，
 * 并在需要时获取内部实例做进一步配置。
 *
 * @public
 */
export interface RainWeatherHandle {
    /** 天气系统实例（当 app 未初始化时为 `null`） */
    weatherSystem: WeatherSystem | null;
    /** 雨效果实例（当 app 未初始化时为 `null`） */
    rain: Rain | null;
    /** 释放资源：销毁天气系统并解绑帧更新器 */
    dispose: () => void;
}

/**
 * 为指定的 {@link Tthree} 快速挂载一个基础雨天效果。
 *
 * @remarks
 * 该辅助函数会：
 *
 * - 自动创建 {@link WeatherSystem}；
 * - 自动添加 {@link Rain} 粒子雨；
 * - 自动通过 {@link Tthree.addFrameUpdater} 绑定每帧更新；
 * - 返回可调用 `dispose()` 的句柄对象，便于在组件卸载时清理。
 *
 * @example 在 React 组件中使用
 * ```ts
 * const app = new Tthree({ container: div });
 * app.init();
 *
 * const rainHandle = setupRainWeather(app, {
 *   areaHalfSize: 220,
 *   rain: { count: 30000, size: 0.35 },
 * });
 *
 * // app.init() 内部会自动启动渲染循环，无需再手动调用 animate()
 *
 * return () => {
 *   rainHandle.dispose();
 *   app.dispose();
 * };
 * ```
 *
 * @param app - 已初始化的 {@link Tthree} 实例。
 * @param options - 可选的雨天配置。
 * @returns 可调用 `dispose()` 清理天气系统并移除帧更新器的句柄对象。
 *
 * @public
 */
export function setupRainWeather(
    app: Tthree,
    options: SetupRainWeatherOptions = {},
): RainWeatherHandle {
    if (!app.scene || !app.camera || !app.renderer) {
        console.warn("[setupRainWeather] app 未初始化完成，跳过天气系统初始化");
        return {
            weatherSystem: null,
            rain: null,
            dispose: () => {},
        };
    }

    const {
        areaHalfSize = 200,
        height = 100,
        rain: rainOptions = {},
        windVector = { x: 3, y: 0, z: 1 },
    } = options;

    // 1. 构造天气边界
    const bounds = {
        box: new Box3(
            new Vector3(-areaHalfSize, 0, -areaHalfSize),
            new Vector3(areaHalfSize, height, areaHalfSize),
        ),
        center: { x: 0, y: height / 2, z: 0 },
        size: { x: areaHalfSize * 2, y: height, z: areaHalfSize * 2 },
    };

    // 2. 创建天气系统
    const weatherSystem = new WeatherSystem({
        scene: app.scene,
        camera: app.camera,
        renderer: app.renderer,
        bounds,
    });

    // 3. 添加雨效果（调大尺寸和密度，适合当前城市场景）
    const rain = new Rain({
        count: rainOptions.count ?? 25000,
        speed: rainOptions.speed ?? 30,
        size: rainOptions.size ?? 0.3,
        opacity: rainOptions.opacity ?? 0.9,
    });
    weatherSystem.add(rain);

    // 4. 帧更新：接入 Tthree 的 frameUpdaters
    const frameUpdater = (delta: number) => {
        weatherSystem.update(delta);
    };
    app.addFrameUpdater(frameUpdater);

    // 5. 播放雨效果 & 设置风向
    weatherSystem.play("rain");
    weatherSystem.setWind({ vector: windVector });

    // 6. 返回句柄对象（包含 dispose 方法）
    return {
        weatherSystem,
        rain,
        dispose: () => {
            weatherSystem.dispose();
            app.removeFrameUpdater(frameUpdater);
        },
    };
}

/**
 * `setupSnowWeather` 的配置选项。
 *
 * @public
 */
export interface SetupSnowWeatherOptions {
    /**
     * 雪覆盖区域半尺寸，单位与场景一致（默认 `200`，对应 `400 × 400` 的正方形区域）。
     */
    areaHalfSize?: number;
    /**
     * 雪高度（默认 `100`）。
     */
    height?: number;
    /**
     * 雪配置（粒子数量、速度、尺寸、透明度、飘动幅度）。
     */
    snow?: {
        count?: number;
        speed?: number;
        size?: number;
        opacity?: number;
        drift?: number;
    };
    /**
     * 风向向量（默认 `{ x: 1, y: 0, z: 0.5 }`，轻微风向）。
     */
    windVector?: { x: number; y: number; z: number };
}

/**
 * `setupSnowWeather` 的返回句柄。
 *
 * @remarks
 * 返回"句柄对象"而不是直接返回函数，便于调用端使用 `handle.dispose()` 的方式清理资源，
 * 并在需要时获取内部实例做进一步配置。
 *
 * @public
 */
export interface SnowWeatherHandle {
    /** 天气系统实例（当 app 未初始化时为 `null`） */
    weatherSystem: WeatherSystem | null;
    /** 雪效果实例（当 app 未初始化时为 `null`） */
    snow: Snow | null;
    /** 释放资源：销毁天气系统并解绑帧更新器 */
    dispose: () => void;
}

/**
 * 为指定的 {@link Tthree} 快速挂载一个基础雪天效果。
 *
 * @remarks
 * 该辅助函数会：
 *
 * - 自动创建 {@link WeatherSystem}；
 * - 自动添加 {@link Snow} 粒子雪；
 * - 自动通过 {@link Tthree.addFrameUpdater} 绑定每帧更新；
 * - 返回可调用 `dispose()` 的句柄对象，便于在组件卸载时清理。
 *
 * @example 在 React 组件中使用
 * ```ts
 * const app = new Tthree({ container: div });
 * app.init();
 *
 * const snowHandle = setupSnowWeather(app, {
 *   areaHalfSize: 220,
 *   snow: { count: 10000, size: 0.4 },
 * });
 *
 * // app.init() 内部会自动启动渲染循环，无需再手动调用 animate()
 *
 * return () => {
 *   snowHandle.dispose();
 *   app.dispose();
 * };
 * ```
 *
 * @param app - 已初始化的 {@link Tthree} 实例。
 * @param options - 可选的雪天配置。
 * @returns 可调用 `dispose()` 清理天气系统并移除帧更新器的句柄对象。
 *
 * @public
 */
export function setupSnowWeather(
    app: Tthree,
    options: SetupSnowWeatherOptions = {},
): SnowWeatherHandle {
    if (!app.scene || !app.camera || !app.renderer) {
        console.warn("[setupSnowWeather] app 未初始化完成，跳过天气系统初始化");
        return {
            weatherSystem: null,
            snow: null,
            dispose: () => {},
        };
    }

    const {
        areaHalfSize = 200,
        height = 100,
        snow: snowOptions = {},
        windVector = { x: 1, y: 0, z: 0.5 },
    } = options;

    // 1. 构造天气边界
    const bounds = {
        box: new Box3(
            new Vector3(-areaHalfSize, 0, -areaHalfSize),
            new Vector3(areaHalfSize, height, areaHalfSize),
        ),
        center: { x: 0, y: height / 2, z: 0 },
        size: { x: areaHalfSize * 2, y: height, z: areaHalfSize * 2 },
    };

    // 2. 创建天气系统
    const weatherSystem = new WeatherSystem({
        scene: app.scene,
        camera: app.camera,
        renderer: app.renderer,
        bounds,
    });

    // 3. 添加雪效果
    const snow = new Snow({
        count: snowOptions.count ?? 8000,
        speed: snowOptions.speed ?? 5,
        size: snowOptions.size ?? 0.3,
        opacity: snowOptions.opacity ?? 0.8,
        drift: snowOptions.drift ?? 0.5,
    });
    weatherSystem.add(snow);

    // 4. 帧更新：接入 Tthree 的 frameUpdaters
    const frameUpdater = (delta: number, elapsed: number) => {
        weatherSystem.update(delta, elapsed);
    };
    app.addFrameUpdater(frameUpdater);

    // 5. 播放雪效果 & 设置风向
    weatherSystem.play("snow");
    weatherSystem.setWind({ vector: windVector });

    // 6. 返回句柄对象（包含 dispose 方法）
    return {
        weatherSystem,
        snow,
        dispose: () => {
            weatherSystem.dispose();
            app.removeFrameUpdater(frameUpdater);
        },
    };
}
