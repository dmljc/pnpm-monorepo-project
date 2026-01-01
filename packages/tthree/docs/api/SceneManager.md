[**tthree**](README.md)

---

# SceneManager

## Classes

<a id="scenemanager"></a>

### SceneManager

场景管理器类：负责场景的创建、配置、对象管理和资源清理

## 使用示例

```typescript
import { SceneManager } from "tthree";

const manager = new SceneManager({
    showGrid: true,
    showAxes: true,
});

// 创建场景
const scene = manager.createScene();

// 添加网格对象
const mesh = new Mesh(geometry, material);
manager.addMesh(mesh);

// 移除网格对象
manager.removeMesh(mesh);
```

#### Properties

<a id="scene"></a>

##### scene

```ts
scene: Scene<Object3DEventMap> | undefined;
```

场景实例

#### Methods

<a id="createscene"></a>

##### createScene()

```ts
createScene(): Scene;
```

创建场景

###### Returns

`Scene`

配置好的场景实例

<a id="addmesh"></a>

##### addMesh()

```ts
addMesh(mesh): void;
```

向场景添加网格对象

###### Parameters

###### mesh

`Mesh`

要添加的网格对象

###### Returns

`void`

<a id="removemesh"></a>

##### removeMesh()

```ts
removeMesh(mesh): void;
```

从场景移除网格对象

###### Parameters

###### mesh

`Mesh`

要移除的网格对象

###### Returns

`void`

<a id="destroy"></a>

##### destroy()

```ts
destroy(): void;
```

销毁场景管理器

###### Returns

`void`

#### Constructors

<a id="constructor"></a>

##### Constructor

```ts
new SceneManager(config): SceneManager;
```

创建 SceneManager 实例

###### Parameters

###### config

[`SceneManagerConfig`](#scenemanagerconfig) = `{}`

场景管理器配置选项

###### Returns

[`SceneManager`](#scenemanager)

## Interfaces

<a id="scenemanagerconfig"></a>

### SceneManagerConfig

场景管理器配置选项

#### Properties

<a id="showgrid"></a>

##### showGrid?

```ts
optional showGrid: boolean;
```

是否显示网格

<a id="showaxes"></a>

##### showAxes?

```ts
optional showAxes: boolean;
```

是否显示坐标轴
