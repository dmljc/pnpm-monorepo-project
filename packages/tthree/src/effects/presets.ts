import { Box3, Vector3 } from "three";
import type { ThreeApp } from "../core/ThreeApp";
import { Rain } from "./Rain";
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
 * 为指定的 {@link ThreeApp} 快速挂载一个基础雨天效果。
 *
 * @remarks
 * 该辅助函数会：
 *
 * - 自动创建 {@link WeatherSystem}；
 * - 自动注册 {@link Rain} 粒子雨；
 * - 自动通过 {@link ThreeApp.addFrameUpdater} 绑定每帧更新；
 * - 返回销毁函数，便于在组件卸载时清理。
 *
 * @example 在 React 组件中使用
 * ```ts
 * const app = new ThreeApp({ container: div });
 * app.init();
 *
 * const disposeRain = setupRainWeather(app, {
 *   areaHalfSize: 220,
 *   rain: { count: 30000, size: 0.35 },
 * });
 *
 * app.animate();
 *
 * return () => {
 *   disposeRain();
 *   app.destroy();
 * };
 * ```
 *
 * @param app - 已初始化的 {@link ThreeApp} 实例。
 * @param options - 可选的雨天配置。
 * @returns 调用后会清理天气系统并移除帧更新器的销毁函数。
 *
 * @public
 */
export function setupRainWeather(
    app: ThreeApp,
    options: SetupRainWeatherOptions = {},
): () => void {
    if (!app.scene || !app.camera || !app.renderer) {
        console.warn("[setupRainWeather] app 未初始化完成，跳过天气系统初始化");
        return () => {};
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

    // 3. 注册雨效果（调大尺寸和密度，适合当前城市场景）
    const rain = new Rain({
        count: rainOptions.count ?? 25000,
        speed: rainOptions.speed ?? 30,
        size: rainOptions.size ?? 0.3,
        opacity: rainOptions.opacity ?? 0.9,
    });
    weatherSystem.register(rain);

    // 4. 帧更新：接入 ThreeApp 的 frameUpdaters
    const frameUpdater = (dt: number, t: number) => {
        weatherSystem.tick(dt, t);
    };
    app.addFrameUpdater(frameUpdater);

    // 5. 启动雨效果 & 设置风向
    weatherSystem.setActive("rain");
    weatherSystem.setWind({ vector: windVector });

    // 6. 返回销毁函数
    return () => {
        weatherSystem.destroy();
        app.removeFrameUpdater(frameUpdater);
    };
}
