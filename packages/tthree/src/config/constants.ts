/**
 * Three.js 基础封装常量定义
 * @packageDocumentation
 */

/**
 * 渲染器默认配置
 */
export const RENDERER_DEFAULTS = {
    /** WebGL2 上下文配置 */
    CONTEXT_ATTRIBUTES: {
        alpha: true,
        antialias: true,
        depth: true,
        stencil: true,
        powerPreference: "high-performance",
    } as WebGLContextAttributes,

    /** 渲染器输出配置 */
    OUTPUT: {
        colorSpace: "srgb-linear" as const,
        toneMapping: "acesfilmic" as const,
        toneMappingExposure: 1.0,
    },
} as const;

/**
 * 相机默认配置
 */
export const CAMERA_DEFAULTS = {
    /** 透视相机参数 */
    PERSPECTIVE: {
        fov: 75,
        near: 0.1,
        far: 1000,
    },

    /** 默认相机位置（俯视角度） */
    POSITION: {
        x: 0,
        y: 80,
        z: 80,
    },
} as const;

/**
 * 控制器默认配置
 */
export const CONTROLS_DEFAULTS = {
    /** OrbitControls 配置 */
    ORBIT: {
        enableDamping: true,
        dampingFactor: 0.05,
        rotateSpeed: 1.0,
        zoomSpeed: 1.0,
        panSpeed: 1.0,
        minDistance: 1,
        maxDistance: 1000,
        maxPolarAngle: Math.PI,
    },
} as const;

/**
 * 场景默认配置
 */
export const SCENE_DEFAULTS = {
    /** 背景颜色 */
    BACKGROUND: 0xf0f0f0,

    /** 雾效配置 */
    FOG: {
        color: 0xf0f0f0,
        near: 1,
        far: 1000,
    },
} as const;

/**
 * 网格默认配置
 */
export const GRID_DEFAULTS = {
    /** 网格大小 */
    SIZE: 100,

    /** 网格分割数 */
    DIVISIONS: 10,

    /** 网格颜色 */
    COLOR: 0xcccccc,

    /** 中心线颜色 */
    CENTER_COLOR: 0x999999,
} as const;

/**
 * 坐标轴默认配置
 */
export const AXES_DEFAULTS = {
    /** 坐标轴长度 */
    SIZE: 50,
} as const;
