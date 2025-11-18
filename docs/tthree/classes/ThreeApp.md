[**tthree**](../README.md)

---

[tthree](../README.md) / ThreeApp

# Class: ThreeApp

Three.js 应用类

提供完整的 Three.js 应用生命周期管理，包括场景创建（背景、雾效、光照、辅助工具）、
相机配置（透视相机、轨道控制器）、渲染器设置（WebGL、抗锯齿、颜色空间）和动画循环（基于 WebGLRenderer setAnimationLoop）。
ResizeObserver 驱动的自动尺寸自适应、完整的资源清理和销毁机制。

## Example

```typescript
// 1. 创建实例
const app = new ThreeApp({
    container: document.getElementById("canvas-container"),
    showGrid: true,
    showAxes: true,
});

// 2. 初始化
app.init();

// 3. 添加网格
const mesh = new THREE.Mesh(geometry, material);
app.addMesh(mesh);

// 4. 启动动画
app.animate();

// 5. 清理资源
app.destroy();
```

## Properties

<a id="scene"></a>

### scene

```ts
scene: Scene<Object3DEventMap> | undefined;
```

场景实例

---

<a id="camera"></a>

### camera

```ts
camera: PerspectiveCamera | undefined;
```

相机实例

---

<a id="renderer"></a>

### renderer

```ts
renderer: WebGLRenderer | undefined;
```

渲染器实例

---

<a id="controls"></a>

### controls

```ts
controls: OrbitControls | undefined;
```

控制器实例

## Methods

<a id="init"></a>

### init()

```ts
init(): void;
```

初始化应用

1. 创建场景
2. 创建相机
3. 创建渲染器
4. 创建控制器
5. 启用尺寸自适应
6. 设置初始化标记

#### Returns

`void`

void

---

<a id="getisrunning"></a>

### getIsRunning()

```ts
getIsRunning(): boolean;
```

获取应用运行状态

#### Returns

`boolean`

是否正在运行(boolean)

---

<a id="getcontainer"></a>

### getContainer()

```ts
getContainer(): HTMLElement;
```

获取容器元素

#### Returns

`HTMLElement`

容器DOM元素(HTMLElement)

---

<a id="addmesh"></a>

### addMesh()

```ts
addMesh(mesh): void;
```

向场景添加网格对象

**功能说明：**

- 自动将网格添加到场景中
- 如果未初始化，会自动调用 init()

#### Parameters

##### mesh

`Mesh`

要添加的网格对象

#### Returns

`void`

#### Example

```typescript
const app = new ThreeApp({
    container: el,
});

// 添加网格
app.addMesh(mesh);
```

---

<a id="getcontainersize"></a>

### getContainerSize()

```ts
getContainerSize(): object;
```

获取容器尺寸

#### Returns

`object`

容器宽度和高度(number, number)

##### width

```ts
width: number;
```

##### height

```ts
height: number;
```

---

<a id="animate"></a>

### animate()

```ts
animate(): void;
```

启动动画循环（使用 WebGLRenderer.setAnimationLoop 实现）

#### Returns

`void`

void

---

<a id="stop"></a>

### stop()

```ts
stop(): void;
```

停止应用和动画循环

#### Returns

`void`

void

---

<a id="destroy"></a>

### destroy()

```ts
destroy(): void;
```

销毁应用

#### Returns

`void`

void

## Constructors

<a id="constructor"></a>

### Constructor

```ts
new ThreeApp(config): ThreeApp;
```

创建 ThreeApp 实例

#### Parameters

##### config

[`ThreeAppConfig`](../interfaces/ThreeAppConfig.md)

应用配置选项

#### Returns

`ThreeApp`
