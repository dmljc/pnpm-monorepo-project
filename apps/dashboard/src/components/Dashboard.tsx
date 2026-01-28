import { FC, useEffect, useRef } from "react";
import { Tthree, setupSnowWeather } from "tthree";
import { wrapperStyle, containerStyle } from "./style";

const Dashboard: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 使用 containerRef 外部传入的 dom 元素创建 Three.js 应用
        const app = new Tthree({
            container: containerRef.current,
            showStats: true,
        });

        // 初始化（内部会自动启动渲染循环）
        app.init();

        // 使用辅助函数快速挂载雪天效果（独立扩展）
        const snowHandle = setupSnowWeather(app);

        // 然后加载模型（模型会在加载完成后自动添加到场景）
        app.loadModel("/park.glb");

        // 在组件卸载时清理资源
        return () => {
            snowHandle.dispose();
            app.dispose();
        };
    }, []);

    return (
        <div style={wrapperStyle}>
            <div ref={containerRef} style={containerStyle} />
        </div>
    );
};

export default Dashboard;
