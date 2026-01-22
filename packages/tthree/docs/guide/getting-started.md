# 快速开始

欢迎使用 tthree！这是一个基于 TypeScript 的 Three.js 封装库，提供简洁易用的 API 来快速创建和管理 Three.js 应用。

## 安装

```bash
npm install tthree
# 或
pnpm add tthree
# 或
yarn add tthree
```

## 基本使用

### 1. 创建应用实例

```typescript
import { Tthree } from "tthree";

const app = new Tthree({
    container: document.getElementById("canvas-container"),
    showGrid: true,
    showAxes: true,
});
```

### 2. 初始化应用

```typescript
app.init();
```

> `init()` 内部会自动启动渲染循环，一般不需要再手动调用额外的“开始渲染”方法。

### 3. 添加网格对象

```typescript
import { Mesh, BoxGeometry, MeshStandardMaterial } from "three";

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshStandardMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);

app.addMesh(cube);
```

### 4. 清理资源

```typescript
app.dispose();
```

## 完整示例

```typescript
import { Tthree } from "tthree";
import { Mesh, BoxGeometry, MeshStandardMaterial } from "three";

// 创建应用实例
const app = new Tthree({
    container: document.getElementById("canvas-container"),
    showGrid: true,
    showAxes: true,
    antialias: true,
    controls: true,
});

// 初始化
app.init();

// 添加一个立方体
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshStandardMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
app.addMesh(cube);

// 在组件卸载时清理资源
// app.dispose();
```

## 配置选项

Tthree 支持以下配置选项：

- `container`: 挂载的 DOM 元素（必需）
- `antialias`: 是否启用抗锯齿（可选，默认 true）
- `controls`: 是否启用控制器（可选，默认 true）
- `camera`: 自定义相机（可选）
- `renderer`: 自定义渲染器（可选）
- `showGrid`: 是否显示网格（可选，默认 false）
- `showAxes`: 是否显示坐标轴（可选，默认 false）

## 下一步

- 查看 [API 文档](/api/) 了解所有可用的 API
- 了解各个模块的详细用法：
    - [SceneManager](/api/SceneManager) - 场景管理
    - [CameraController](/api/CameraController) - 相机控制
    - [RenderEngine](/api/RenderEngine) - 渲染引擎
    - [Tthree](/api/Tthree) - 主应用类
