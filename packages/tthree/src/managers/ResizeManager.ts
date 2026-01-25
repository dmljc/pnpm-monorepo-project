/**
 * 尺寸自适应管理器
 *
 * 负责监听容器尺寸变化并通知相关模块更新
 */
export class ResizeManager {
    /** 容器元素 */
    private container: HTMLElement;

    /** 尺寸观察器 */
    private resizeObserver: ResizeObserver | undefined;

    /** 尺寸变化回调 */
    private onResize: (width: number, height: number) => void;

    /**
     * 创建尺寸管理器实例
     *
     * @param container - 要监听的容器元素
     * @param onResize - 尺寸变化时的回调函数
     */
    constructor(
        container: HTMLElement,
        onResize: (width: number, height: number) => void,
    ) {
        this.container = container;
        this.onResize = onResize;
    }

    /**
     * 获取容器尺寸
     *
     * @returns 容器宽度和高度
     */
    public getContainerSize(): { width: number; height: number } {
        const rect = this.container.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
        };
    }

    /**
     * 启动尺寸监听
     *
     * @remarks
     * 使用 ResizeObserver 而不是 window resize 的原因：
     * 1. 监听范围不同
     *    - window resize：仅在浏览器窗口大小改变时触发
     *    - ResizeObserver：可监听任意 DOM 元素的尺寸变化
     * 2. 性能优势
     *    - ResizeObserver 由浏览器优化，性能更好
     *    - 回调在布局完成后触发，避免重复计算
     */
    public start(): void {
        if (this.resizeObserver) {
            return; // 已启动，避免重复
        }

        this.resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });

        this.resizeObserver.observe(this.container);
    }

    /**
     * 处理容器尺寸变化
     */
    private handleResize(): void {
        const { width, height } = this.getContainerSize();
        this.onResize(width, height);
    }

    /**
     * 停止尺寸监听
     */
    public stop(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = undefined;
        }
    }

    /**
     * 释放资源
     */
    public dispose(): void {
        this.stop();
    }
}
