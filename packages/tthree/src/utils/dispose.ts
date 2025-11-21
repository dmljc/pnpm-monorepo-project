import type { Mesh } from "three";

const MATERIAL_TEXTURE_KEYS = [
    "map",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "aoMap",
    "emissiveMap",
    "displacementMap",
    "alphaMap",
    "specularMap",
    "envMap",
] as const;

/**
 * 释放材质上的常见纹理资源
 * @param mat 材质实例
 * @returns void
 * @description
 * 释放材质上的常见纹理资源，包括但不限于：
 * - map
 * - normalMap
 * - roughnessMap
 * - metalnessMap
 * - aoMap
 * - emissiveMap
 * - displacementMap
 * - alphaMap
 * - specularMap
 * - envMap
 * 该函数会尝试调用每个纹理的 `dispose` 方法，忽略共享纹理的释放异常。
 * */
export function disposeMaterialTextures(mat: any): void {
    if (!mat) return;
    for (const key of MATERIAL_TEXTURE_KEYS) {
        const tex = mat?.[key];
        if (tex && typeof tex.dispose === "function") {
            try {
                tex.dispose();
            } catch {
                // 忽略共享纹理的释放异常
            }
        }
    }
}

/**
 * 释放网格的几何与材质（含纹理）。
 * @param mesh - 需要释放的 `three.Mesh` 实例
 * @returns void
 */
const disposeMaterial = (material: any): void => {
    if (!material) return;
    disposeMaterialTextures(material);
    if (typeof material.dispose === "function") {
        material.dispose();
    }
};

export function disposeMesh(mesh: Mesh): void {
    mesh.geometry?.dispose?.();
    const material = (mesh as any).material;
    if (Array.isArray(material)) {
        material.forEach(disposeMaterial);
        return;
    }
    disposeMaterial(material);
}
