# tthree

基于 TypeScript 的 Three.js 封装库，提供模块化的 3D 应用开发能力与可扩展的运行时生命周期管理。

## 特性

- 🎨 模块化架构，职责清晰
- 🚀 开箱即用的 Three.js 应用管理
- 📦 完整的 TypeScript 支持
- 🔧 灵活的扩展系统（独立设计，符合 Three.js 风格）
- 🧩 帧更新与销毁钩子，便于接入扩展模块
- ⚡ 零依赖耦合，按需加载

## 安装

```bash
pnpm add tthree
```

## 快速开始

### 基础使用

```typescript
import { Tthree } from "tthree";

const app = new Tthree({
    container: document.getElementById("app"),
});

// init 内部会自动启动渲染循环
app.init();

// 加载模型
await app.loadModel("/models/scene.glb");

// 清理
app.dispose();
```

### 使用天气系统（独立扩展）

天气系统完全独立于核心应用，遵循 Three.js 生态标准（就像 `OrbitControls`、`EffectComposer` 一样），并支持替换/叠加策略进行天气切换。

```typescript
import { Tthree } from "tthree";
import { WeatherSystem, Rain } from "tthree/effects";

// 1. 创建应用
const app = new Tthree({ container });
app.init();

// 2. 创建天气系统（独立，按需使用）
const weather = new WeatherSystem({
    scene: app.scene!,
    camera: app.camera!,
    renderer: app.renderer!,
});

// 3. 添加天气效果
const rain = new Rain({ count: 10000 });
weather.add(rain);
weather.play("rain");
weather.setWind({ vector: { x: 3, y: 0, z: 1 } });

// 4. 集成到渲染循环
app.addFrameUpdater((delta) => {
    weather.update(delta);
});

// 5. 可选：自动清理
app.addDisposer(() => {
    weather.dispose();
});
```

### 使用辅助函数（快速上手）

```typescript
import { Tthree } from "tthree";
import { setupRainWeather } from "tthree/effects";

const app = new Tthree({ container });
app.init();

// 快速设置雨天效果
const rainHandle = setupRainWeather(app, {
    rain: { count: 20000 },
});

// 清理
rainHandle.dispose();
app.dispose();
```

#### setupRainWeather 配置说明

- `areaHalfSize`：雨区半尺寸，默认 `200`（对应 `400 × 400` 的正方形区域）
- `height`：雨区高度，默认 `100`
- `rain`：雨滴参数（`count/speed/size/opacity`）
- `windVector`：风向向量，默认 `{ x: 3, y: 0, z: 1 }`

> 若 `app` 未初始化完成，`setupRainWeather` 会返回空句柄并输出警告。

### 常用能力速览（天气系统）

- `add/remove/get/has`：管理天气效果实例
- `play/stop/clear`：切换与控制天气（支持 `replace` / `overlay` 策略）
- `setWind/setIntensity/setBounds/updateState`：联动风场、强度与边界
- `update(delta, elapsed)`：每帧驱动已激活的天气更新

### 共享状态与联动

天气系统提供可共享的 `WeatherState`，内置风场与暴风强度等字段。多个天气效果可通过读写共享状态协同工作，避免彼此强耦合。

## 项目结构

```
src/
├── core/           # 核心应用类
│   ├── Tthree.ts
│   ├── CameraController.ts
│   ├── RenderEngine.ts
│   └── SceneManager.ts
├── managers/       # 功能管理器
│   ├── AnimationManager.ts
│   ├── AssetLoadManager.ts
│   ├── LifecycleManager.ts
│   └── ResizeManager.ts
├── effects/        # 天气效果系统（完全独立）
│   ├── WeatherSystem.ts
│   ├── Weather.ts
│   ├── Rain.ts
│   └── presets.ts
├── loaders/        # 资源加载器
├── components/     # UI 组件
├── config/         # 配置常量
└── utils/          # 工具函数
```

## API 文档

所有公共 API 都包含详细的 TypeDoc 注释。查看源码或生成 API 文档：

```bash
pnpm run docs:build
```

## 架构设计

### 完全解耦

```
Tthree (核心)              WeatherSystem (独立扩展)
    ↓                           ↓
提供钩子 ←────── 用户集成 ──────→ 使用钩子
    ↓                           ↓
addFrameUpdater()           update()
addDisposer()               dispose()
```

### 符合 Three.js 风格

| 功能   | Three.js                         | tthree                                         |
| ------ | -------------------------------- | ---------------------------------------------- |
| 控制器 | `new OrbitControls(camera, dom)` | `new WeatherSystem({scene, camera, renderer})` |
| 添加   | `scene.add(mesh)`                | `weather.add(rain)`                            |
| 更新   | `mixer.update(delta)`            | `weather.update(delta)`                        |
| 播放   | `audio.play()`                   | `weather.play('rain')`                         |
| 清理   | `material.dispose()`             | `weather.dispose()`                            |

## 示例

查看 `examples/` 目录：

- `weather-independent.ts` - 手动集成示例
- `weather-preset.ts` - 辅助函数示例
- `weather-react.tsx` - React 集成示例

## License

MIT
