// 核心模块：应用入口与基础控制器
export { ThreeApp } from "./core/ThreeApp";
export type { ThreeAppConfig } from "./core/ThreeApp";

export { CameraController } from "./core/CameraController";
export type { CameraControllerConfig } from "./core/CameraController";

export { RenderEngine } from "./core/RenderEngine";
export type { RenderEngineConfig } from "./core/RenderEngine";

export { SceneManager } from "./core/SceneManager";
export type { SceneManagerConfig } from "./core/SceneManager";

// 加载相关：统一管理资源加载与进度
export { LoadingManager } from "./loaders/LoadingManager";
export type {
    LoadingManagerConfig,
    LoadingProgress,
} from "./loaders/LoadingManager";

export { ModelLoader } from "./loaders/ModelLoader";
export type {
    ModelLoaderConfig,
    ModelLoadResult,
    ModelLoadProgress,
} from "./loaders/ModelLoader";

// 组件：例如加载进度条等 UI 组件
export { ProgressBar } from "./components/ProgressBar";
export type { ProgressBarConfig } from "./components/ProgressBar";

// 效果系统：天气与雨效果相关导出
export {
    Weather,
    Rain,
    WeatherSystem,
    setupRainWeather,
    createDefaultWeatherState,
    createDefaultWeatherBounds,
} from "./effects";
export type {
    WeatherContext,
    WeatherState,
    WeatherBounds,
    WindState,
    LightningState,
    RainConfig,
    WeatherSystemConfig,
    WeatherSwitchStrategy,
    SetupRainWeatherOptions,
} from "./effects";
