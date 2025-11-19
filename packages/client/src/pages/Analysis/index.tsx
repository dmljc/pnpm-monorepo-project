import { FC, useEffect, useRef, useState } from "react";
import { ThreeApp } from "tthree";
import {
    Mesh,
    SphereGeometry,
    BoxGeometry,
    CylinderGeometry,
    MeshStandardMaterial,
} from "three";

/**
 * 网格配置类型
 */
interface MeshConfig {
    geometry: SphereGeometry | BoxGeometry | CylinderGeometry;
    material: MeshStandardMaterial;
}

/**
 * 场景配置类型
 */
interface SceneConfig {
    container: HTMLDivElement;
    meshFactory: () => MeshConfig;
}

/**
 * 创建红色球体
 */
const createRedSphere = (): MeshConfig => ({
    geometry: new SphereGeometry(1, 32, 16),
    material: new MeshStandardMaterial({ color: 0xff0000 }),
});

/**
 * 创建绿色立方体
 */
const createGreenCube = (): MeshConfig => ({
    geometry: new BoxGeometry(1, 1, 1),
    material: new MeshStandardMaterial({ color: 0x00ff00 }),
});

/**
 * 创建蓝色圆柱体
 */
const createBlueCylinder = (): MeshConfig => ({
    geometry: new CylinderGeometry(0.8, 0.8, 1.6, 32),
    material: new MeshStandardMaterial({ color: 0x0000ff }),
});

/**
 * 创建随机彩色几何体
 */
const createRandomMesh = (): MeshConfig => {
    const choice = Math.floor(Math.random() * 3);
    const color = Math.floor(Math.random() * 0xffffff);
    const material = new MeshStandardMaterial({ color });

    if (choice === 0) {
        return {
            geometry: new SphereGeometry(1, 32, 16),
            material,
        };
    } else if (choice === 1) {
        return {
            geometry: new BoxGeometry(1, 1, 1),
            material,
        };
    } else {
        return {
            geometry: new CylinderGeometry(0.8, 0.8, 1.6, 32),
            material,
        };
    }
};

/**
 * 初始化单个场景
 * @param config 场景配置
 * @returns ThreeApp 实例
 */
const initializeScene = (
    config: SceneConfig,
    showGrid: boolean = false,
    showAxes: boolean = false,
): ThreeApp => {
    const { container, meshFactory } = config;
    const threeApp = new ThreeApp({
        container,
        showGrid,
        showAxes,
    });

    // 先初始化以创建场景、相机和渲染器
    threeApp.init();

    if (threeApp.scene) {
        const meshConfig = meshFactory();
        const mesh = new Mesh(meshConfig.geometry, meshConfig.material);
        // 将所有示例网格放大 10 倍，便于展示
        mesh.scale.set(10, 10, 10);
        threeApp.addMesh(mesh);
    }

    threeApp.animate();
    return threeApp;
};

/**
 * 样式配置
 */
const STYLE_CONFIGS = {
    box1: {
        width: 480,
        height: 320,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        overflow: "hidden" as const,
        background: "#000",
    },
    box2: {
        width: 360,
        height: 240,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        overflow: "hidden" as const,
        background: "#000",
    },
    box3: {
        width: 320,
        height: 400,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        overflow: "hidden" as const,
        background: "#000",
    },
    grid: {
        display: "grid" as const,
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        alignItems: "start" as const,
    },
};

/**
 * 获取随机尺寸
 */
const getRandomBox4Dims = () => ({
    width: 280 + Math.floor(Math.random() * 240), // 280 ~ 520
    height: 200 + Math.floor(Math.random() * 220), // 200 ~ 420
});

const Analysis: FC = () => {
    const container1Ref = useRef<HTMLDivElement | null>(null);
    const container2Ref = useRef<HTMLDivElement | null>(null);
    const container3Ref = useRef<HTMLDivElement | null>(null);
    const container4Ref = useRef<HTMLDivElement | null>(null);

    const instancesRef = useRef<ThreeApp[]>([]);
    const [box4Dims] = useState(getRandomBox4Dims());

    useEffect(() => {
        const configs = [
            {
                ref: container1Ref,
                meshFactory: createRedSphere,
                showGrid: true,
                showAxes: true,
            },
            {
                ref: container2Ref,
                meshFactory: createGreenCube,
                showGrid: true,
                showAxes: false,
            },
            { ref: container3Ref, meshFactory: createBlueCylinder },
            { ref: container4Ref, meshFactory: createRandomMesh },
        ];

        // 初始化所有场景
        configs.forEach(
            ({ ref, meshFactory, showGrid = false, showAxes = false }) => {
                const container = ref.current;
                if (container) {
                    const instance = initializeScene(
                        {
                            container,
                            meshFactory,
                        },
                        showGrid,
                        showAxes,
                    );
                    instancesRef.current.push(instance);
                }
            },
        );

        // 清理函数
        return () => {
            instancesRef.current.forEach((instance) => {
                instance.destroy();
            });
            instancesRef.current = [];
        };
    }, []);

    const box4Style: React.CSSProperties = {
        ...STYLE_CONFIGS.box1,
        width: box4Dims.width,
        height: box4Dims.height,
    };

    return (
        <div>
            <h1>分析 页面</h1>
            <div style={STYLE_CONFIGS.grid}>
                <div ref={container1Ref} style={STYLE_CONFIGS.box1} />
                <div ref={container2Ref} style={STYLE_CONFIGS.box2} />
                <div ref={container3Ref} style={STYLE_CONFIGS.box3} />
                <div ref={container4Ref} style={box4Style} />
            </div>
        </div>
    );
};

export default Analysis;
