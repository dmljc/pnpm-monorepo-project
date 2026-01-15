import { FC, useEffect, useRef } from "react";
import { ThreeApp } from "tthree";
import { wrapperStyle, containerStyle } from "./style";

const Analysis: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 使用 containerRef 外部传入的dom元素创建 Three.js 应用，并链式调用初始化和加载模型
        const app = new ThreeApp({ container: containerRef.current });
        app.init().loadModel("/park.glb");

        // 在组件卸载时清理资源
        return () => app.destroy();
    }, []);

    return (
        <div style={wrapperStyle}>
            <div ref={containerRef} style={containerStyle} />
        </div>
    );
};

export default Analysis;
