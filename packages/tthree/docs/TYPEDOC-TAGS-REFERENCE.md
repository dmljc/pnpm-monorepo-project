# TypeDoc 标签参考指南111

本文档展示了 TypeDoc 中所有常用标签的使用方法和示例效果。

## 目录

- [基础标签](#基础标签)
- [代码示例标签](#代码示例标签)
- [版本和状态标签](#版本和状态标签)
- [访问修饰符标签](#访问修饰符标签)
- [其他标签](#其他标签)

---

## 基础标签

### @param - 参数说明

**用途：** 描述函数或方法的参数

**语法：**

```typescript
/**
 * @param 参数名 - 参数描述
 * @param 参数名 类型 - 参数描述（可选类型说明）
 */
```

**示例代码：**

```typescript
/**
 * 计算两个数字的和
 *
 * @param a - 第一个数字
 * @param b - 第二个数字
 * @param precision number - 小数精度（可选）
 */
function add(a: number, b: number, precision?: number): number {
    return Number((a + b).toFixed(precision || 2));
}
```

**生成效果：**

```
###### Parameters

###### a
`number`
第一个数字

###### b
`number`
第二个数字

###### precision
`number` (可选)
小数精度（可选）
```

---

### @returns / @return - 返回值说明

**用途：** 描述函数或方法的返回值

**语法：**

```typescript
/**
 * @returns 返回值描述
 * @return 返回值描述（@return 是 @returns 的别名）
 */
```

**示例代码：**

```typescript
/**
 * 获取用户信息
 *
 * @param userId - 用户ID
 * @returns 用户信息对象，如果用户不存在则返回 null
 */
function getUserInfo(userId: string): UserInfo | null {
    // ...
}
```

**生成效果：**

```
###### Returns

`UserInfo | null`

用户信息对象，如果用户不存在则返回 null
```

---

### @throws - 异常说明

**用途：** 说明函数可能抛出的异常

**语法：**

```typescript
/**
 * @throws {ErrorType} 异常描述
 */
```

**示例代码：**

```typescript
/**
 * 解析 JSON 字符串
 *
 * @param jsonString - 要解析的 JSON 字符串
 * @returns 解析后的对象
 * @throws {SyntaxError} 当 JSON 字符串格式不正确时抛出
 * @throws {TypeError} 当输入不是字符串时抛出
 */
function parseJSON(jsonString: string): any {
    if (typeof jsonString !== "string") {
        throw new TypeError("输入必须是字符串");
    }
    return JSON.parse(jsonString);
}
```

**生成效果：**

```
###### Throws

**SyntaxError** - 当 JSON 字符串格式不正确时抛出

**TypeError** - 当输入不是字符串时抛出
```

---

### @default - 默认值

**用途：** 说明属性或参数的默认值

**语法：**

```typescript
/**
 * @default 默认值
 */
```

**示例代码：**

```typescript
/**
 * 相机配置选项
 */
export interface CameraConfig {
    /**
     * 视野角度
     *
     * @default 50
     */
    fov?: number;

    /**
     * 是否启用控制器
     *
     * @default false
     */
    enableControls?: boolean;
}
```

**生成效果：**

````
###### fov?

`number` (可选)

视野角度

###### Default

```ts
50
````

````

---

## 代码示例标签

### @example - 代码示例

**用途：** 提供使用示例代码

**语法：**
```typescript
/**
 * @example
 * ```typescript
 * // 示例代码
 * ```
 */
````

**示例代码：**

````typescript
/**
 * 创建相机实例
 *
 * @param config - 相机配置
 * @returns 相机实例
 *
 * @example
 * ```typescript
 * // 基本使用
 * const camera = createCamera({
 *   fov: 45,
 *   aspect: 16 / 9
 * });
 *
 * // 完整配置
 * const camera2 = createCamera({
 *   fov: 60,
 *   aspect: 1920 / 1080,
 *   near: 0.1,
 *   far: 1000
 * });
 * ```
 */
function createCamera(config: CameraConfig): Camera {
    // ...
}
````

**生成效果：**

````
###### Example

```typescript
// 基本使用
const camera = createCamera({
  fov: 45,
  aspect: 16 / 9
});

// 完整配置
const camera2 = createCamera({
  fov: 60,
  aspect: 1920 / 1080,
  near: 0.1,
  far: 1000
});
````

````

---

### @remarks - 备注说明

**用途：** 提供重要的注意事项和实现细节

**语法：**
```typescript
/**
 * @remarks
 * 备注内容
 */
````

**示例代码：**

```typescript
/**
 * 更新相机尺寸
 *
 * @param width - 宽度
 * @param height - 高度
 *
 * @remarks
 * - 如果高度为 0，宽高比会被设置为 1 以避免除零错误
 * - 此方法会自动更新相机的投影矩阵
 * - 如果相机尚未创建，此方法不会执行任何操作
 */
function updateSize(width: number, height: number): void {
    // ...
}
```

**生成效果：**

```
###### Remarks

- 如果高度为 0，宽高比会被设置为 1 以避免除零错误
- 此方法会自动更新相机的投影矩阵
- 如果相机尚未创建，此方法不会执行任何操作
```

---

## 版本和状态标签

### @since - 版本信息

**用途：** 说明功能引入的版本号

**语法：**

```typescript
/**
 * @since 版本号
 */
```

**示例代码：**

```typescript
/**
 * 新的渲染方法
 *
 * @since 1.2.0
 */
function newRenderMethod(): void {
    // ...
}
```

**生成效果：**

```
###### Since

1.2.0
```

---

### @deprecated - 标记为已废弃

**用途：** 标记已废弃的功能，建议使用替代方案

**语法：**

```typescript
/**
 * @deprecated 废弃说明和替代方案
 */
```

**示例代码：**

```typescript
/**
 * 旧的渲染方法
 *
 * @deprecated 请使用 {@link newRenderMethod} 替代
 * @see {@link newRenderMethod}
 */
function oldRenderMethod(): void {
    // ...
}
```

**生成效果：**

```
###### Deprecated

请使用 [newRenderMethod](#newrendermethod) 替代
```

---

### @experimental - 实验性功能

**用途：** 标记为实验性功能，可能在未来版本中改变

**语法：**

```typescript
/**
 * @experimental
 */
```

**示例代码：**

```typescript
/**
 * 实验性的新特性
 *
 * @experimental 此功能仍在测试中，API 可能会发生变化
 */
function experimentalFeature(): void {
    // ...
}
```

**生成效果：**

```
###### Experimental

此功能仍在测试中，API 可能会发生变化
```

---

### @beta - 测试版功能

**用途：** 标记为测试版功能

**语法：**

```typescript
/**
 * @beta
 */
```

**示例代码：**

```typescript
/**
 * 测试版功能
 *
 * @beta 此功能处于测试阶段，可能会有问题
 */
function betaFeature(): void {
    // ...
}
```

---

### @alpha - 内测版功能

**用途：** 标记为内测版功能

**语法：**

```typescript
/**
 * @alpha
 */
```

**示例代码：**

```typescript
/**
 * 内测版功能
 *
 * @alpha 此功能处于内测阶段，仅供内部使用
 */
function alphaFeature(): void {
    // ...
}
```

---

## 访问修饰符标签

### @public - 公共访问

**用途：** 明确标记为公共 API（默认情况下，public 成员已经是公共的）

**语法：**

```typescript
/**
 * @public
 */
```

**示例代码：**

```typescript
/**
 * 公共方法
 *
 * @public
 */
public publicMethod(): void {
    // ...
}
```

---

### @private - 私有访问

**用途：** 标记为私有，通常不会出现在文档中（除非配置了显示私有成员）

**语法：**

```typescript
/**
 * @private
 */
```

**示例代码：**

```typescript
/**
 * 私有方法
 *
 * @private 此方法仅供内部使用
 */
private privateMethod(): void {
    // ...
}
```

---

### @protected - 受保护访问

**用途：** 标记为受保护，仅供子类访问

**语法：**

```typescript
/**
 * @protected
 */
```

**示例代码：**

```typescript
/**
 * 受保护的方法
 *
 * @protected 子类可以访问此方法
 */
protected protectedMethod(): void {
    // ...
}
```

---

### @internal - 内部使用

**用途：** 标记为内部使用，通常不会出现在公共文档中

**语法：**

```typescript
/**
 * @internal
 */
```

**示例代码：**

```typescript
/**
 * 内部方法
 *
 * @internal 此方法仅供库内部使用，不应在外部调用
 */
function internalMethod(): void {
    // ...
}
```

---

### @readonly - 只读属性

**用途：** 标记属性为只读

**语法：**

```typescript
/**
 * @readonly
 */
```

**示例代码：**

```typescript
/**
 * 只读属性
 *
 * @readonly 此属性只能在初始化时设置
 */
readonly config: Config;
```

**生成效果：**

```
###### config

`Config` (只读)

此属性只能在初始化时设置
```

---

### @override - 重写方法

**用途：** 标记为重写父类的方法

**语法：**

```typescript
/**
 * @override
 */
```

**示例代码：**

```typescript
/**
 * 重写父类的渲染方法
 *
 * @override
 */
override render(): void {
    // ...
}
```

---

## 其他标签

### @see - 参考链接

**用途：** 提供相关方法、类或文档的链接

**语法：**

```typescript
/**
 * @see {@link 链接目标} 描述
 * @see 外部链接URL
 */
```

**示例代码：**

```typescript
/**
 * 更新相机尺寸
 *
 * @param width - 宽度
 * @param height - 高度
 *
 * @see {@link createCamera} - 创建相机实例
 * @see {@link PerspectiveCamera.updateProjectionMatrix} - Three.js 相机更新投影矩阵方法
 * @see https://threejs.org/docs/#api/en/cameras/PerspectiveCamera - Three.js 官方文档
 */
function updateSize(width: number, height: number): void {
    // ...
}
```

**生成效果：**

```
###### See

- [createCamera](#createcamera) - 创建相机实例
- PerspectiveCamera.updateProjectionMatrix - Three.js 相机更新投影矩阵方法
- https://threejs.org/docs/#api/en/cameras/PerspectiveCamera - Three.js 官方文档
```

---

### @category - 分类标签

**用途：** 对 API 进行分类组织

**语法：**

```typescript
/**
 * @category 分类名称
 */
```

**示例代码：**

```typescript
/**
 * 更新相机尺寸
 *
 * @category 相机管理
 */
function updateSize(): void {
    // ...
}

/**
 * 创建场景
 *
 * @category 场景管理
 */
function createScene(): void {
    // ...
}
```

**注意：** 需要在 `typedoc.json` 中启用分类功能：

```json
{
    "categorizeByGroup": true
}
```

---

### @module - 模块说明

**用途：** 标记模块并添加模块级文档

**语法：**

```typescript
/**
 * @module 模块名
 * @packageDocumentation
 *
 * # 模块标题
 *
 * 模块描述...
 */
```

**示例代码：**

```typescript
/**
 * @module CameraController
 * @packageDocumentation
 *
 * # CameraController 模块
 *
 * 相机控制器模块负责相机的创建、配置、控制器管理和尺寸自适应。
 *
 * ## 功能特性
 *
 * - 透视相机的创建和配置
 * - OrbitControls 轨道控制器的集成
 * - 自动尺寸自适应
 */
```

---

## 完整示例

以下是一个包含多个标签的完整示例：

````typescript
/**
 * 相机控制器类
 *
 * 负责相机的创建、配置、控制器管理和尺寸自适应。
 *
 * @category 相机管理
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * // 创建相机控制器
 * const controller = new CameraController({
 *   containerSize: { width: 1920, height: 1080 },
 *   controls: true
 * });
 *
 * // 创建相机
 * const camera = controller.createCamera();
 *
 * // 更新尺寸
 * controller.updateSize(2560, 1440);
 * ```
 */
export class CameraController {
    /**
     * 相机实例
     *
     * @readonly
     * @since 1.0.0
     */
    public readonly camera: PerspectiveCamera | undefined;

    /**
     * 更新相机尺寸
     *
     * 根据新的容器尺寸更新相机的宽高比和投影矩阵。
     * 当容器尺寸改变时（如窗口大小调整），应调用此方法以确保相机正确渲染。
     *
     * @param width - 新的容器宽度（像素）
     * @param height - 新的容器高度（像素）
     * @returns void
     *
     * @example
     * ```typescript
     * // 基本使用
     * controller.updateSize(1920, 1080);
     *
     * // 响应窗口大小变化
     * window.addEventListener('resize', () => {
     *   controller.updateSize(window.innerWidth, window.innerHeight);
     * });
     * ```
     *
     * @remarks
     * - 如果高度为 0，宽高比会被设置为 1 以避免除零错误
     * - 此方法会自动更新相机的投影矩阵
     * - 如果相机尚未创建，此方法不会执行任何操作
     *
     * @throws {Error} 不会抛出异常，但如果相机未初始化，方法会静默返回
     *
     * @since 1.0.0
     *
     * @see {@link createCamera} - 创建相机实例
     * @see {@link PerspectiveCamera.updateProjectionMatrix} - Three.js 相机更新投影矩阵方法
     *
     * @category 相机管理
     */
    public updateSize(width: number, height: number): void {
        if (!this.camera) return;

        this.containerSize = { width, height };
        const aspect = height === 0 ? 1 : width / height;

        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
    }

    /**
     * 旧的更新方法
     *
     * @deprecated 请使用 {@link updateSize} 替代
     * @see {@link updateSize}
     */
    public updateSizeOld(width: number, height: number): void {
        // ...
    }
}
````

---

## 最佳实践

1. **保持一致性**：在整个项目中统一使用相同的标签格式
2. **提供示例**：对于复杂的 API，始终提供 `@example`
3. **说明注意事项**：使用 `@remarks` 说明重要的实现细节
4. **版本管理**：使用 `@since` 和 `@deprecated` 管理 API 版本
5. **链接相关**：使用 `@see` 帮助用户发现相关 API
6. **标记状态**：使用 `@experimental`、`@beta`、`@alpha` 标记功能状态

---

## 参考资源

- [TypeDoc 官方文档](https://typedoc.org/)
- [JSDoc 标签参考](https://jsdoc.app/)
- [TypeScript 文档注释](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
