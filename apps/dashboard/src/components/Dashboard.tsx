import { FC, useEffect, useRef } from "react";
import { ThreeApp, setupRainWeather } from "tthree";
import { wrapperStyle, containerStyle } from "./style";

const Dashboard: FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 使用 containerRef 外部传入的dom元素创建 Three.js 应用
        const app = new ThreeApp({
            container: containerRef.current,
            showStats: true,
        });
        app.init();

        // 一行挂载雨天效果（内部自动创建 WeatherSystem + Rain + 帧更新）
        const disposeRain = setupRainWeather(app);

        // 先启动渲染循环（重要！这样天气效果才能立即开始更新）
        app.animate();

        // 然后加载模型（模型会在加载完成后自动添加到场景）
        app.loadModel("/park.glb");

        // 在组件卸载时清理资源
        return () => {
            disposeRain();
            app.destroy();
        };
    }, []);

    return (
        <div style={wrapperStyle}>
            <div ref={containerRef} style={containerStyle} />
        </div>
    );
};

export default Dashboard;
