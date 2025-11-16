[**tthree**](../README.md)

---

[tthree](../README.md) / ThreeBase

# Class: ThreeBase

Three.js 基础应用类

提供完整的 Three.js 场景管理、相机控制、渲染器配置和动画循环。
支持多实例隔离、自动尺寸自适应、资源管理等功能。

## 示例

```typescript
// 1. 创建实例
const app = new ThreeBase({
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

## 属性

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

## 方法

<a id="init"></a>

### init()

```ts
init(): void;
```

初始化应用（仅创建资源，不自动启动）

#### 返回值

`void`

---

<a id="getisrunning"></a>

### getIsRunning()

```ts
getIsRunning(): boolean;
```

获取应用运行状态

#### 返回值

`boolean`

是否正在运行

---

<a id="getcontainer"></a>

### getContainer()

```ts
getContainer(): HTMLElement;
```

获取容器元素

#### 返回值

`HTMLElement`

容器DOM元素

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

#### 参数

##### mesh

`Mesh`

要添加的网格对象

#### 返回值

`void`

#### 示例

```typescript
const app = new ThreeBase({
    container: el,
});

// 添加网格
app.addMesh(mesh);
```

---

<a id="animate"></a>

### animate()

```ts
animate(): void;
```

启动动画循环（公开入口，使用 WebGLRenderer.setAnimationLoop）

#### 返回值

`void`

---

<a id="stopanimate"></a>

### stopAnimate()

```ts
stopAnimate(): void;
```

停止应用和动画循环

#### 返回值

`void`

---

<a id="destroy"></a>

### destroy()

```ts
destroy(): void;
```

销毁应用

#### 返回值

`void`

## 构造函数

<a id="constructor"></a>

### Constructor

```ts
new ThreeBase(config): ThreeBase;
```

创建 Three.js 应用实例

#### 参数

##### config

[`Params`](../interfaces/Params.md)

应用配置

#### 返回值

`ThreeBase`
