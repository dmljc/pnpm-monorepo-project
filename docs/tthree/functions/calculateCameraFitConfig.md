[**tthree v1.0.0**](../README.md)

---

[tthree](../README.md) / calculateCameraFitConfig

# Function: calculateCameraFitConfig()

```ts
function calculateCameraFitConfig(mesh, padding): CameraFitConfig | null;
```

定义于： [utils.ts:111](https://github.com/dmljc/pnpm-monorepo-project/blob/3cb5d4968028ef304d215f3f94047aed11aabfe1/packages/tthree/src/core/utils.ts#L111)

根据网格的包围球计算相机拟合配置

该函数计算最优的相机位置，使得指定的网格对象完全可见。
它基于网格的包围球（bounding sphere）和缩放比例进行计算。

## 参数

### mesh

`Mesh`

要适应的网格对象（Three.js Mesh）

### padding

`number` = `3`

相机距离的额外缩放系数，默认 3 - padding = 1 时，相机紧贴对象 - padding = 3 时（默认），相机距离为对象大小的 3 倍 - padding = 5 时，相机距离更远，视角更宽

## 返回值

[`CameraFitConfig`](../接口/CameraFitConfig.md) \| `null`

相机配置对象包含：- position: 计算后的相机位置 (x, y, z) - target: 相机看向的目标点 - 若计算失败返回 null

## 示例

```typescript
const mesh = new THREE.Mesh(geometry, material);
const config = calculateCameraFitConfig(mesh, 3);

if (config) {
    camera.position.set(
        config.position.x,
        config.position.y,
        config.position.z,
    );
    camera.lookAt(config.target.x, config.target.y, config.target.z);
}
```
