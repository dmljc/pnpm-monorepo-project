// 天气基础类与上下文类型
export { Weather } from "./Weather";
export type {
    WeatherContext,
    WeatherState,
    WeatherBounds,
    WindState,
    LightningState,
} from "./Weather";
export {
    createDefaultWeatherState,
    createDefaultWeatherBounds,
} from "./Weather";

// 具体天气效果实现
export { Rain } from "./Rain";
export type { RainConfig } from "./Rain";

export { Snow } from "./Snow";
export type { SnowConfig } from "./Snow";

// 天气系统：负责调度和切换不同天气效果
export { WeatherSystem } from "./WeatherSystem";
export type {
    WeatherSystemConfig,
    WeatherSwitchStrategy,
} from "./WeatherSystem";

// 预设工具方法：一键搭建常用天气场景
export { setupRainWeather, setupSnowWeather } from "./presets";
export type {
    SetupRainWeatherOptions,
    RainWeatherHandle,
    SetupSnowWeatherOptions,
    SnowWeatherHandle,
} from "./presets";
