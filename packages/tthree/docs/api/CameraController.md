[**tthree**](README.md)

---

# CameraController

<a id="cameracontroller"></a>

### CameraController

相机控制器类

负责相机的创建、配置、控制器管理和尺寸自适应

#### Properties

<a id="camera-1"></a>

##### camera

```ts
camera: PerspectiveCamera | undefined;
```

相机实例

透视相机对象，用于控制场景的视角和投影。
如果未创建相机，此值为 `undefined`。

<a id="aspect"></a>

##### aspect

```ts
aspect: number = 1;
```

宽高比（aspect ratio）

通常是画布宽度 / 画布高度。如果设置为 1，则显示为正方形。

###### Default

```ts
1;
```

<a id="controls-1"></a>

##### controls

```ts
controls: OrbitControls | undefined;
```

控制器实例

#### Methods

<a id="createcamera"></a>

##### createCamera()

```ts
createCamera(): PerspectiveCamera;
```

创建透视相机

###### Returns

`PerspectiveCamera`

配置好的相机实例

<a id="createcontrols"></a>

##### createControls()

```ts
createControls(rendererDomElement): OrbitControls;
```

创建轨道控制器

###### Parameters

###### rendererDomElement

`HTMLElement`

渲染器的 DOM 元素

###### Returns

`OrbitControls`

配置好的控制器实例

<a id="updatesize"></a>

##### updateSize()

```ts
updateSize(width, height): void;
```

更新相机尺寸

###### Parameters

###### width

`number`

宽度

###### height

`number`

高度

###### Returns

`void`

<a id="update"></a>

##### update()

```ts
update(): void;
```

更新控制器（在渲染循环中调用）

###### Returns

`void`

<a id="getenablecontrols"></a>

##### getEnableControls()

```ts
getEnableControls(): boolean;
```

获取是否启用控制器

###### Returns

`boolean`

是否启用控制器

<a id="destroy"></a>

##### destroy()

```ts
destroy(): void;
```

销毁相机控制器

###### Returns

`void`

#### Constructors

<a id="constructor"></a>

##### Constructor

```ts
new CameraController(config): CameraController;
```

创建 CameraController 实例

###### Parameters

###### config

[`CameraControllerConfig`](#cameracontrollerconfig)

相机控制器配置选项

###### Returns

[`CameraController`](#cameracontroller)

<a id="cameracontrollerconfig"></a>

### CameraControllerConfig

相机控制器配置选项

#### Properties

<a id="containersize"></a>

##### containerSize

```ts
containerSize: object;
```

容器尺寸

###### width

```ts
width: number;
```

###### height

```ts
height: number;
```

<a id="camera"></a>

##### camera?

```ts
optional camera: PerspectiveCamera;
```

自定义相机

<a id="controls"></a>

##### controls?

```ts
optional controls: boolean;
```

是否启用控制器
