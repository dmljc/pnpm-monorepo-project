import { FC, useEffect, useRef } from "react";
import { Mesh, SphereGeometry, MeshStandardMaterial } from "three";
import { ThreeApp } from "tthree";
import { wrapperStyle, containerStyle } from "./style";

/**
 * 创建红色球体网格
 */
const createRedSphere = () => {
    const geometry = new SphereGeometry(1, 32, 16);
    const material = new MeshStandardMaterial({ color: 0xff0000 });
    const mesh = new Mesh(geometry, material);
    mesh.scale.set(10, 10, 10);
    return mesh;
};

/**
 * 初始化 Three.js 场景
 */
const initScene = (container: HTMLDivElement): ThreeApp => {
    const app = new ThreeApp({
        container,
        showGrid: true,
        showAxes: true,
    });

    app.init();

    app.addMesh(createRedSphere());

    app.animate();
    return app;
};

const Analysis: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<ThreeApp | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        appRef.current = initScene(containerRef.current);

        return () => {
            appRef.current?.destroy();
            appRef.current = null;
        };
    }, []);

    return (
        <div style={wrapperStyle}>
            <div ref={containerRef} style={containerStyle} />
        </div>
    );
};

export default Analysis;
