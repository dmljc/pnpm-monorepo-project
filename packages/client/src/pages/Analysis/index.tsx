import { FC, useEffect, useRef, useState } from "react";
import { ThreeBase } from "tthree";
import {
    Mesh,
    SphereGeometry,
    BoxGeometry,
    CylinderGeometry,
    MeshStandardMaterial,
} from "three";

const Analysis: FC = () => {
    const container1Ref = useRef<HTMLDivElement | null>(null);
    const container2Ref = useRef<HTMLDivElement | null>(null);
    const container3Ref = useRef<HTMLDivElement | null>(null);
    const container4Ref = useRef<HTMLDivElement | null>(null);
    const instance1Ref = useRef<ThreeBase | null>(null);
    const instance2Ref = useRef<ThreeBase | null>(null);
    const instance3Ref = useRef<ThreeBase | null>(null);
    const instance4Ref = useRef<ThreeBase | null>(null);

    useEffect(() => {
        const c1 = container1Ref.current;
        const c2 = container2Ref.current;
        const c3 = container3Ref.current;
        const c4 = container4Ref.current;

        if (c1) {
            const three1 = new ThreeBase({ container: c1 });
            instance1Ref.current = three1;
            if (three1.scene) {
                const sphere = new Mesh(
                    new SphereGeometry(1, 32, 16),
                    new MeshStandardMaterial({ color: 0xff0000 }),
                );
                three1.scene.add(sphere);
            }
            three1.start();
        }

        if (c2) {
            const three2 = new ThreeBase({ container: c2 });
            instance2Ref.current = three2;
            if (three2.scene) {
                const cube = new Mesh(
                    new BoxGeometry(1, 1, 1),
                    new MeshStandardMaterial({ color: 0x00ff00 }),
                );
                three2.scene.add(cube);
            }
            three2.start();
        }

        if (c3) {
            const three3 = new ThreeBase({ container: c3 });
            instance3Ref.current = three3;
            if (three3.scene) {
                const cylinder = new Mesh(
                    new CylinderGeometry(0.8, 0.8, 1.6, 32),
                    new MeshStandardMaterial({ color: 0x0000ff }),
                );
                three3.scene.add(cylinder);
            }
            three3.start();
        }

        if (c4) {
            const three4 = new ThreeBase({ container: c4 });
            instance4Ref.current = three4;
            if (three4.scene) {
                const choice = Math.floor(Math.random() * 3);
                const color = Math.floor(Math.random() * 0xffffff);
                let mesh: Mesh;
                if (choice === 0) {
                    mesh = new Mesh(
                        new SphereGeometry(1, 32, 16),
                        new MeshStandardMaterial({ color }),
                    );
                } else if (choice === 1) {
                    mesh = new Mesh(
                        new BoxGeometry(1, 1, 1),
                        new MeshStandardMaterial({ color }),
                    );
                } else {
                    mesh = new Mesh(
                        new CylinderGeometry(0.8, 0.8, 1.6, 32),
                        new MeshStandardMaterial({ color }),
                    );
                }
                three4.scene.add(mesh);
            }
            three4.start();
        }

        return () => {
            instance1Ref.current?.dispose();
            instance1Ref.current = null;
            instance2Ref.current?.dispose();
            instance2Ref.current = null;
            instance3Ref.current?.dispose();
            instance3Ref.current = null;
            instance4Ref.current?.dispose();
            instance4Ref.current = null;
        };
    }, []);

    const box1Style: React.CSSProperties = {
        width: 480,
        height: 320,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        overflow: "hidden",
        background: "#000",
    };
    const box2Style: React.CSSProperties = {
        width: 360,
        height: 240,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        overflow: "hidden",
        background: "#000",
    };
    const box3Style: React.CSSProperties = {
        width: 320,
        height: 400,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        overflow: "hidden",
        background: "#000",
    };

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        alignItems: "start",
    };
    // 第四个容器的尺寸使用状态管理，随机值在副作用中生成
    const [box4Dims, setBox4Dims] = useState<{ width: number; height: number }>(
        { width: 400, height: 300 },
    );
    useEffect(() => {
        setBox4Dims({
            width: 280 + Math.floor(Math.random() * 240), // 280 ~ 520
            height: 200 + Math.floor(Math.random() * 220), // 200 ~ 420
        });
    }, []);
    const box4Style: React.CSSProperties = {
        width: box4Dims.width,
        height: box4Dims.height,
        border: "1px solid #e5e5e5",
        borderRadius: 8,
        overflow: "hidden",
        background: "#000",
    };

    return (
        <div>
            <h1>分析 页面</h1>
            <div style={gridStyle}>
                <div ref={container1Ref} style={box1Style} />
                <div ref={container2Ref} style={box2Style} />
                <div ref={container3Ref} style={box3Style} />
                <div ref={container4Ref} style={box4Style} />
            </div>
        </div>
    );
};

export default Analysis;
