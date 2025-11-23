# 快速开始

## 安装

```bash
npm install tthree
# 或
pnpm add tthree
# 或
yarn add tthree
```

## 基本使用

### 1. 创建实例

```typescript
import { ThreeApp } from "tthree";

const app = new ThreeApp({
    container: document.getElementById("canvas-container"),
    showGrid: true,
    showAxes: true,
});
```

### 2. 初始化

```typescript
app.init();
```

### 3. 添加网格

```typescript
import * as THREE from "three";

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);

app.addMesh(mesh);
```

### 4. 启动动画

```typescript
app.animate();
```

### 5. 清理资源

```typescript
app.destroy();
```

## 完整示例

```typescript
import { ThreeApp } from "tthree";
import * as THREE from "three";

// 创建应用实例
const app = new ThreeApp({
    container: document.getElementById("canvas-container"),
    showGrid: true,
    showAxes: true,
    antialias: true,
    controls: true,
});

// 初始化
app.init();

// 创建一个立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
app.addMesh(cube);

// 启动动画循环
app.animate();

// 在需要时清理资源
// app.destroy();
```

## 配置选项

查看 [ThreeAppConfig](/api/ThreeApp#threeappconfig) 了解所有可用的配置选项。
