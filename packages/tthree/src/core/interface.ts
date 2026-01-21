/**
 * Three.js 应用实例配置选项
 */
export interface ThreeAppConfig {
    /** 挂载的DOM元素 */
    container: HTMLElement;
    /** 是否启用抗锯齿 */
    antialias?: boolean;
    /** 是否启用控制器 */
    controls?: boolean;
    /** 自定义相机 */
    camera?: import("three").PerspectiveCamera;
    /** 自定义渲染器 */
    renderer?: import("three").WebGLRenderer;
    /** 是否显示网格 */
    showGrid?: boolean;
    /** 是否显示坐标轴 */
    showAxes?: boolean;
    /** 是否显示模型加载进度条（默认 false） */
    showProgressBar?: boolean;
    /** 是否启用 Draco 压缩（默认 false） */
    enableDraco?: boolean;
    /** Draco 解码器路径 */
    dracoDecoderPath?: string;
    /** 模型加载进度回调 */
    onLoadProgress?: (
        progress: import("../loaders/ModelLoader").ModelLoadProgress,
    ) => void;
    /** 模型加载完成回调 */
    onLoadComplete?: () => void;
    /** 模型加载错误回调 */
    onLoadError?: (url: string, error: Error) => void;
    /** 是否启用 Stats 性能监测（默认 false） */
    showStats?: boolean;
}
