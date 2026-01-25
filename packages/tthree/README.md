# tthree

基于 TypeScript 的 Three.js 封装库，提供模块化的 3D 应用开发能力。

## 特性

- 🎨 模块化架构，职责清晰
- 🚀 开箱即用的 Three.js 应用管理
- 📦 完整的 TypeScript 支持
- 🔧 灵活的扩展系统（独立设计，符合 Three.js 风格）
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

app.init();

// 加载模型
await app.loadModel("/models/scene.glb");

// 清理
app.dispose();
```

### 使用天气系统（独立扩展）

天气系统完全独立于核心应用，遵循 Three.js 生态标准（就像 `OrbitControls`、`EffectComposer` 一样）。

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
