import type { Mesh } from "three";

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
    const texKeys = [
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
    ];
    for (const key of texKeys) {
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
export function disposeMesh(mesh: Mesh): void {
    mesh.geometry?.dispose?.();
    const material = (mesh as any).material;
    if (Array.isArray(material)) {
        material.forEach((m: any) => {
            disposeMaterialTextures(m);
            if (typeof m?.dispose === "function") m.dispose();
        });
    } else {
        const m: any = material as any;
        disposeMaterialTextures(m);
        if (typeof m?.dispose === "function") m.dispose();
    }
}
