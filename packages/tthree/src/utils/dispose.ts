import {
    Mesh,
    Material,
    Texture,
    BufferGeometry,
    Object3D,
    Points,
    Line,
} from "three";

/**
 * 材质中可能包含纹理的属性键名
 */
const MATERIAL_TEXTURE_KEYS = [
    "map",
    "lightMap",
    "bumpMap",
    "normalMap",
    "specularMap",
    "roughnessMap",
    "metalnessMap",
    "alphaMap",
    "envMap",
    "emissiveMap",
    "aoMap",
    "displacementMap",
] as const;

/**
 * 定义具有 dispose 方法的对象接口
 */
interface Disposable {
    dispose(): void;
}

/**
 * 释放材质上的纹理资源
 * @param material 材质实例
 */
export function disposeMaterialTextures(material: Material): void {
    if (!material) return;

    // 使用类型收束处理材质属性
    const m = material as unknown as Record<string, unknown>;

    for (const key of MATERIAL_TEXTURE_KEYS) {
        const texture = m[key];
        if (texture instanceof Texture) {
            texture.dispose();
        }
    }
}

/**
 * 释放材质资源
 * @param material 材质或材质数组
 */
export function disposeMaterial(
    material: Material | Material[] | undefined,
): void {
    if (!material) return;

    if (Array.isArray(material)) {
        material.forEach((m) => disposeMaterial(m));
        return;
    }

    disposeMaterialTextures(material);
    material.dispose();
}

/**
 * 释放几何体资源
 * @param geometry 几何体
 */
export function disposeGeometry(geometry: BufferGeometry | undefined): void {
    if (geometry) {
        geometry.dispose();
    }
}

/**
 * 递归释放 Object3D 及其子对象的所有资源（几何体、材质、纹理）
 * @param object 要释放的对象
 */
export function disposeObject(object: Object3D): void {
    if (!object) return;

    // 递归处理子对象
    // 注意：需要先克隆数组或从后往前遍历，因为 remove 会改变 children 长度
    for (let i = object.children.length - 1; i >= 0; i--) {
        const child = object.children[i];
        disposeObject(child);
    }

    // 处理 Mesh, Points, Line 等具有几何体和材质的对象
    if (
        object instanceof Mesh ||
        object instanceof Points ||
        object instanceof Line
    ) {
        disposeGeometry(object.geometry);
        disposeMaterial(object.material);
    }

    // 处理具有 dispose 方法的对象（如 Controls, Helpers）
    if (thisIsDisposable(object)) {
        object.dispose();
    }
}

/**
 * 类型守卫：判断对象是否具有 dispose 方法
 */
function thisIsDisposable(obj: unknown): obj is Disposable {
    return (
        obj !== null &&
        typeof obj === "object" &&
        "dispose" in obj &&
        typeof (obj as Disposable).dispose === "function"
    );
}
