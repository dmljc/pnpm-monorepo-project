[**tthree**](README.md)

---

# RenderEngine

## Classes

<a id="renderengine"></a>

### RenderEngine

渲染引擎类：负责 WebGL 渲染器的创建、配置、渲染循环和资源管理

## 使用示例

```typescript
import { RenderEngine } from "tthree";

const engine = new RenderEngine({
    container: document.getElementById("canvas"),
    antialias: true,
});

// 创建渲染器
engine.createRenderer({ container, antialias: true });

// 设置尺寸
engine.setSize(800, 600);

// 启动渲染循环
engine.start(() => {
    engine.render(scene, camera);
});

// 获取时间数据
const { deltaTime, elapsedTime } = engine.getTimeData();
```

#### Properties

<a id="renderer"></a>

##### renderer

```ts
renderer: WebGLRenderer | undefined;
```

渲染器实例

#### Methods

<a id="createrenderer"></a>

##### createRenderer()

```ts
createRenderer(config): WebGLRenderer;
```

创建 WebGL 渲染器

###### Parameters

###### config

[`RenderEngineConfig`](#renderengineconfig)

渲染引擎配置

###### Returns

`WebGLRenderer`

配置好的渲染器实例

<a id="setsize"></a>

##### setSize()

```ts
setSize(width, height): void;
```

设置渲染器尺寸

###### Parameters

###### width

`number`

宽度

###### height

`number`

高度

###### Returns

`void`

<a id="render"></a>

##### render()

```ts
render(scene, camera): void;
```

渲染一帧

###### Parameters

###### scene

`Scene`

场景实例

###### camera

`PerspectiveCamera`

相机实例

###### Returns

`void`

<a id="start"></a>

##### start()

```ts
start(callback): void;
```

启动渲染循环

###### Parameters

###### callback

() => `void`

每帧渲染回调函数

###### Returns

`void`

<a id="stop"></a>

##### stop()

```ts
stop(): void;
```

停止渲染循环

###### Returns

`void`

<a id="gettimedata"></a>

##### getTimeData()

```ts
getTimeData(): object;
```

获取帧时间数据

###### Returns

`object`

帧时间数据对象

###### deltaTime

```ts
deltaTime: number;
```

###### elapsedTime

```ts
elapsedTime: number;
```

<a id="getisrunning"></a>

##### getIsRunning()

```ts
getIsRunning(): boolean;
```

获取是否正在运行

###### Returns

`boolean`

是否正在运行

<a id="destroy"></a>

##### destroy()

```ts
destroy(): void;
```

销毁渲染引擎

###### Returns

`void`

#### Constructors

<a id="constructor"></a>

##### Constructor

```ts
new RenderEngine(config): RenderEngine;
```

创建 RenderEngine 实例

###### Parameters

###### config

[`RenderEngineConfig`](#renderengineconfig)

渲染引擎配置选项

###### Returns

[`RenderEngine`](#renderengine)

## Interfaces

<a id="renderengineconfig"></a>

### RenderEngineConfig

渲染引擎配置选项

#### Properties

<a id="container"></a>

##### container

```ts
container: HTMLElement;
```

挂载的DOM元素

<a id="antialias"></a>

##### antialias?

```ts
optional antialias: boolean;
```

是否启用抗锯齿
