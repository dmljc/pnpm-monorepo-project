[**tthree**](README.md)

---

# Tthree

## Classes

<a id="tthree"></a>

### Tthree

Three.js 应用类：负责 Three.js 应用的创建、初始化、渲染和销毁

## 使用示例

#### Example

```typescript
// 1. 创建实例
const app = new Tthree({
    container: document.getElementById("canvas-container"),
    showGrid: true,
    showAxes: true,
});

// 2. 初始化
app.init();

// 3. 加载模型（新增）
const result = await app.loadModel("/models/character.glb");

// 4. 清理资源
app.dispose();
```

#### Properties

<a id="scenemanager"></a>

##### sceneManager

```ts
sceneManager: SceneManager;
```

场景管理器实例

<a id="cameracontroller"></a>

##### cameraController

```ts
cameraController: CameraController;
```

相机控制器实例

<a id="renderengine"></a>

##### renderEngine

```ts
renderEngine: RenderEngine;
```

渲染引擎实例

<a id="stats"></a>

##### stats

```ts
stats: Stats | undefined;
```

Stats 性能监测实例

#### Methods

<a id="init"></a>

##### init()

```ts
init(): this;
```

初始化应用

1. 创建场景
2. 创建相机
3. 创建渲染器
4. 创建控制器
5. 启用尺寸自适应
6. 设置初始化标记

###### Returns

`this`

this - 支持链式调用

<a id="start"></a>

##### ~~start()~~

```ts
start(): this;
```

一键启动：初始化 + 开始渲染循环。

###### Returns

`this`

###### Remarks

常见页面只需要调用 [Tthree.init](#init) 即可（init 内部会自动启动渲染循环）。

###### Deprecated

请直接使用 [Tthree.init](#init)

<a id="getisrunning"></a>

##### getIsRunning()

```ts
getIsRunning(): boolean;
```

获取应用运行状态

###### Returns

`boolean`

是否正在运行(boolean)

<a id="getcontainer"></a>

##### getContainer()

```ts
getContainer(): HTMLElement;
```

获取容器元素

###### Returns

`HTMLElement`

容器DOM元素(HTMLElement)

<a id="addmesh"></a>

##### addMesh()

```ts
addMesh(mesh): void;
```

向场景添加网格对象

**功能说明：**

- 自动将网格添加到场景中
- 如果未初始化，会自动调用 init()

###### Parameters

###### mesh

`Mesh`

要添加的网格对象

###### Returns

`void`

###### Example

```typescript
const app = new Tthree({
    container: el,
});

// 添加网格
app.addMesh(mesh);
```

<a id="getcontainersize"></a>

##### getContainerSize()

```ts
getContainerSize(): object;
```

获取容器尺寸

###### Returns

`object`

容器宽度和高度(number, number)

###### width

```ts
width: number;
```

###### height

```ts
height: number;
```

<a id="loadmodel"></a>

##### loadModel()

```ts
loadModel(url, autoAddToScene): Promise<ModelLoadResult | null>;
```

加载 GLTF/GLB 3D 模型

**功能说明：**

- 自动创建模型加载器
- 自动将模型添加到场景
- 内置错误处理，无需外部 try-catch
- 支持进度条显示（通过配置 showProgressBar: true）
- 如果未初始化，会自动调用 init()

###### Parameters

###### url

`string`

模型文件的 URL

###### autoAddToScene

`boolean` = `true`

是否自动添加到场景（默认 true）

###### Returns

`Promise`\<`ModelLoadResult` \| `null`\>

Promise<ModelLoadResult | null> 加载结果，失败时返回 null

###### Example

```typescript
// 基础使用（无需 try-catch）
const app = new Tthree({ container: el });
app.init();
await app.loadModel("/models/character.glb");

// 带错误处理
const app = new Tthree({
    container: el,
    onLoadError: (url, error) => {
        console.error("加载失败:", url, error);
    },
});
await app.loadModel("/models/character.glb");
```

<a id="loadmodels"></a>

##### loadModels()

```ts
loadModels(urls, autoAddToScene): Promise<ModelLoadResult[]>;
```

批量加载多个模型

**功能说明：**

- 内置错误处理，部分失败不影响其他模型加载
- 自动将成功加载的模型添加到场景
- 无需外部 try-catch

###### Parameters

###### urls

`string`[]

模型文件 URL 数组

###### autoAddToScene

`boolean` = `true`

是否自动添加到场景（默认 true）

###### Returns

`Promise`\<`ModelLoadResult`[]\>

Promise<ModelLoadResult[]> 成功加载的模型结果数组

###### Example

```typescript
const app = new Tthree({ container: el });
app.init();

// 批量加载，即使部分失败也不会中断
await app.loadModels([
    "/models/model1.glb",
    "/models/model2.glb",
    "/models/model3.glb",
]);
```

<a id="addframeupdater"></a>

##### addFrameUpdater()

```ts
addFrameUpdater(updater): this;
```

注册帧更新回调

用于天气系统、动画系统等需要每帧更新的扩展模块

###### Parameters

###### updater

(`dt`, `t`) => `void`

每帧调用的回调函数，参数为 (deltaTime, elapsedTime)

###### Returns

`this`

this - 支持链式调用

###### Example

```typescript
// 注册天气系统的 tick 方法
app.addFrameUpdater((dt, t) => weatherSystem.tick(dt, t));

// 或者直接绑定
app.addFrameUpdater(weatherSystem.tick.bind(weatherSystem));
```

<a id="adddisposer"></a>

##### addDisposer()

```ts
addDisposer(disposer): this;
```

注册一个在 [Tthree.dispose](#dispose) 时执行的清理函数。

###### Parameters

###### disposer

() => `void`

###### Returns

`this`

###### Remarks

用于把 `setupRainWeather` 之类返回的 `handle.dispose()` 自动挂到 app 的生命周期里。

<a id="userainweather"></a>

##### useRainWeather()

```ts
useRainWeather(options): RainWeatherHandle;
```

预设：一行挂载雨天效果，并自动随 app 一起销毁。

###### Parameters

###### options

`SetupRainWeatherOptions` = `{}`

###### Returns

`RainWeatherHandle`

雨天句柄（仍可供调用端进一步配置，例如调整强度）

###### Remarks

- 内部会确保 app 已初始化（会调用 [Tthree.init](#init)）
- 会调用 setupRainWeather 并自动把 `handle.dispose()` 注册到 app

<a id="removeframeupdater"></a>

##### removeFrameUpdater()

```ts
removeFrameUpdater(updater): this;
```

移除帧更新回调

###### Parameters

###### updater

(`dt`, `t`) => `void`

要移除的回调函数

###### Returns

`this`

this - 支持链式调用

<a id="clearframeupdaters"></a>

##### clearFrameUpdaters()

```ts
clearFrameUpdaters(): this;
```

清空所有帧更新回调

###### Returns

`this`

this - 支持链式调用

<a id="stop"></a>

##### stop()

```ts
stop(): this;
```

停止应用和动画循环

###### Returns

`this`

this - 支持链式调用

<a id="dispose"></a>

##### dispose()

```ts
dispose(): void;
```

释放应用占用的所有资源

###### Returns

`void`

void

#### Accessors

<a id="scene"></a>

##### scene

###### Get Signature

```ts
get scene(): Scene<Object3DEventMap> | undefined;
```

获取场景实例

###### Returns

`Scene`\<`Object3DEventMap`\> \| `undefined`

场景实例(Scene)

<a id="camera"></a>

##### camera

###### Get Signature

```ts
get camera(): PerspectiveCamera | undefined;
```

获取相机实例

###### Returns

`PerspectiveCamera` \| `undefined`

相机实例(PerspectiveCamera)

<a id="renderer"></a>

##### renderer

###### Get Signature

```ts
get renderer(): WebGLRenderer | undefined;
```

获取渲染器实例

###### Returns

`WebGLRenderer` \| `undefined`

渲染器实例(WebGLRenderer)

<a id="controls"></a>

##### controls

###### Get Signature

```ts
get controls(): OrbitControls | undefined;
```

获取 OrbitControls 控制器实例

###### Returns

`OrbitControls` \| `undefined`

控制器实例(OrbitControls)

#### Constructors

<a id="constructor"></a>

##### Constructor

```ts
new Tthree(config): Tthree;
```

创建 Tthree 实例

###### Parameters

###### config

`TthreeConfig`

应用配置选项

###### Returns

[`Tthree`](#tthree)
