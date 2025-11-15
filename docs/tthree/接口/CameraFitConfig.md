[**tthree v1.0.0**](../README.md)

---

[tthree](../README.md) / CameraFitConfig

# Interface: CameraFitConfig

定义于： [utils.ts:72](https://github.com/dmljc/pnpm-monorepo-project/blob/3cb5d4968028ef304d215f3f94047aed11aabfe1/packages/tthree/src/core/utils.ts#L72)

相机拟合配置接口

表示计算后的相机位置和目标点配置，
用于在 Three.js 场景中自动调整相机以显示特定对象。

## 属性

<a id="position"></a>

### position

```ts
position: object;
```

定义于： [utils.ts:74](https://github.com/dmljc/pnpm-monorepo-project/blob/3cb5d4968028ef304d215f3f94047aed11aabfe1/packages/tthree/src/core/utils.ts#L74)

相机位置

#### x

```ts
x: number;
```

#### y

```ts
y: number;
```

#### z

```ts
z: number;
```

---

<a id="target"></a>

### target

```ts
target: object;
```

定义于： [utils.ts:76](https://github.com/dmljc/pnpm-monorepo-project/blob/3cb5d4968028ef304d215f3f94047aed11aabfe1/packages/tthree/src/core/utils.ts#L76)

相机看向的目标点

#### x

```ts
x: number;
```

#### y

```ts
y: number;
```

#### z

```ts
z: number;
```
