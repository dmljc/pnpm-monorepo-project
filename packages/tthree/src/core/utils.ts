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

/**
 * 相机拟合配置接口
 *
 * 表示计算后的相机位置和目标点配置，
 * 用于在 Three.js 场景中自动调整相机以显示特定对象。
 */
export interface CameraFitConfig {
    /** 相机位置 */
    position: { x: number; y: number; z: number };
    /** 相机看向的目标点 */
    target: { x: number; y: number; z: number };
}

/**
 * 根据网格的包围球计算相机拟合配置
 *
 * 该函数计算最优的相机位置，使得指定的网格对象完全可见。
 * 它基于网格的包围球（bounding sphere）和缩放比例进行计算。
 *
 * @param mesh - 要适应的网格对象（Three.js Mesh）
 * @param padding - 相机距离的额外缩放系数，默认 3
 *        - padding = 1 时，相机紧贴对象
 *        - padding = 3 时（默认），相机距离为对象大小的 3 倍
 *        - padding = 5 时，相机距离更远，视角更宽
 *
 * @returns 相机配置对象包含：
 *        - position: 计算后的相机位置 (x, y, z)
 *        - target: 相机看向的目标点
 *        - 若计算失败返回 null
 *
 * @example
 * ```typescript
 * const mesh = new THREE.Mesh(geometry, material);
 * const config = calculateCameraFitConfig(mesh, 3);
 *
 * if (config) {
 *   camera.position.set(
 *     config.position.x,
 *     config.position.y,
 *     config.position.z
 *   );
 *   camera.lookAt(config.target.x, config.target.y, config.target.z);
 * }
 * ```
 */
export function calculateCameraFitConfig(
    mesh: Mesh,
    padding: number = 3,
): CameraFitConfig | null {
    try {
        // 计算几何体包围球
        const geom: any = mesh.geometry as any;
        if (typeof geom.computeBoundingSphere === "function") {
            geom.computeBoundingSphere();
        }

        const bs = geom.boundingSphere;
        if (!bs) return null;

        const radius = bs.radius;

        // 计算缩放后的实际半径
        const scale = Math.max(mesh.scale.x, mesh.scale.y, mesh.scale.z) || 1;
        const scaledRadius = radius * scale;

        // 根据缩放后的半径和 padding 系数计算相机距离
        const distance = scaledRadius * padding;

        // 返回相机配置
        return {
            position: {
                x: 0,
                y: scaledRadius * 0.5,
                z: distance,
            },
            target: {
                x: 0,
                y: 0,
                z: 0,
            },
        };
    } catch {
        // 若计算失败返回 null
        return null;
    }
}
