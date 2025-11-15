export { ThreeBase } from "./core/ThreeBase";
export type { Params } from "./core/ThreeBase";

// 工具函数与类型
export { calculateCameraFitConfig } from "./core/utils";
export type { CameraFitConfig } from "./core/utils";

// 请实现一个threejs 的基础封装类，包含场景、相机、渲染器、交互控制与尺寸自适应，动画、资源管理等常规功能；
// 要求：
// - 支持多实例隔离，资源与事件均按实例进行管理；
// - 所有默认行为通过顶层常量定义，便于文档与统一维护；
// - 运行环境假设：仅支持桌面端最新版本 Chrome；不考虑移动端或其它浏览器/平台；使用原生 ResizeObserver 与 WebGL2，无降级与 polyfill。
// - 使用typeDoc根据ts注释生成文档
// - 参数要求支持传入dom，根据dom的尺寸创建渲染器与相机，默认相机位置为(0, 0, 5)
