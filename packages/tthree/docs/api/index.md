# API 文档

本文档由 TypeDoc 自动生成，包含 tthree 库的所有 API 参考。

## 核心模块

tthree 库的核心功能由以下模块提供，每个模块都有独立的文档：

- [CameraController](./CameraController) - 相机控制器模块
- [RenderEngine](./RenderEngine) - 渲染引擎模块
- [SceneManager](./SceneManager) - 场景管理器模块
- [ThreeApp](./ThreeApp) - 主应用类模块

## 模块说明

### CameraController

负责相机的创建、配置、控制器管理和尺寸自适应。

**主要功能：**

- 透视相机的创建和配置
- OrbitControls 轨道控制器的集成
- 自动尺寸自适应
- 相机和控制器生命周期管理

### RenderEngine

负责 WebGL 渲染器的创建、配置、渲染循环和资源管理。

**主要功能：**

- WebGL 渲染器的创建和配置
- 渲染循环管理（基于 setAnimationLoop）
- 帧时间数据获取
- 自动像素比适配

### SceneManager

负责场景的创建、配置、对象管理和资源清理。

**主要功能：**

- 场景的创建和配置（背景、雾效、光照）
- 网格和坐标轴辅助工具的添加
- 场景对象的添加和移除
- 自动资源清理和内存管理

### ThreeApp

ThreeApp 是 tthree 库的核心应用类，整合了上述三个模块，提供完整的 Three.js 应用生命周期管理。

**主要功能：**

- 完整的应用生命周期管理
- ResizeObserver 驱动的自动尺寸自适应
- 完整的资源清理和销毁机制
