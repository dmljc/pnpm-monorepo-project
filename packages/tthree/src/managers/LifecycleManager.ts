/**
 * 生命周期管理器
 *
 * 负责管理应用的生命周期状态和资源清理
 */
export class LifecycleManager {
    /** 是否已初始化 */
    private initialized: boolean = false;

    /** 资源释放回调列表 */
    private disposers: Array<() => void> = [];

    /**
     * 获取初始化状态
     *
     * @returns 是否已初始化
     */
    public isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * 设置初始化状态
     *
     * @param value - 是否已初始化
     */
    public setInitialized(value: boolean): void {
        this.initialized = value;
    }

    /**
     * 注册一个在销毁时执行的清理函数
     *
     * @param disposer - 清理函数
     */
    public addDisposer(disposer: () => void): void {
        this.disposers.push(disposer);
    }

    /**
     * 执行所有注册的清理函数
     */
    public dispose(): void {
        if (this.disposers.length > 0) {
            for (const disposer of this.disposers) {
                try {
                    disposer();
                } catch (err) {
                    console.warn("[LifecycleManager] disposer 执行失败", err);
                }
            }
            this.disposers = [];
        }
    }

    /**
     * 获取已注册的清理函数数量
     *
     * @returns 清理函数数量
     */
    public getDisposersCount(): number {
        return this.disposers.length;
    }
}
