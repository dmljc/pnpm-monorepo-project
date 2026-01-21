import type { LoadingProgress } from "../loaders/LoadingManager";

/**
 * 进度条配置选项
 */
export interface ProgressBarConfig {
    /** 容器元素 */
    container?: HTMLElement;
    /** 进度条颜色 */
    color?: string;
    /** 背景颜色 */
    backgroundColor?: string;
    /** 高度（像素） */
    height?: number;
    /** 是否显示百分比文本 */
    showPercentage?: boolean;
    /** 是否显示加载信息 */
    showInfo?: boolean;
    /** 是否显示居中文本提示 */
    showCenterText?: boolean;
    /** 居中文本提示内容（默认：'正在加载...'） */
    centerText?: string;
    /** 自定义样式类名 */
    className?: string;
}

/**
 * 进度条工具类：用于显示加载进度的可视化组件
 *
 * ## 使用示例
 *
 * ```typescript
 * import { ProgressBar, LoadingManager, ModelLoader } from 'tthree';
 *
 * // 创建进度条
 * const progressBar = new ProgressBar({
 *   container: document.body,
 *   color: '#4CAF50',
 *   showPercentage: true,
 *   showInfo: true
 * });
 *
 * // 创建加载管理器
 * const loadingManager = new LoadingManager({
 *   onProgress: (progress) => {
 *     progressBar.update(progress);
 *   },
 *   onLoad: () => {
 *     progressBar.complete();
 *   }
 * });
 *
 * // 创建模型加载器
 * const modelLoader = new ModelLoader({ loadingManager });
 *
 * // 加载模型
 * const model = await modelLoader.loadModel('/models/character.glb');
 * ```
 */
export class ProgressBar {
    /** 进度条容器元素 */
    private container: HTMLElement;

    /** 进度条元素 */
    private progressBarElement: HTMLDivElement;

    /** 进度填充元素 */
    private progressFill: HTMLDivElement;

    /** 百分比文本元素 */
    private percentageText: HTMLDivElement | undefined;

    /** 信息文本元素 */
    private infoText: HTMLDivElement | undefined;

    /** 居中文本元素 */
    private centerTextElement: HTMLDivElement | undefined;

    /** 配置选项 */
    private config: Required<ProgressBarConfig>;

    /** 当前进度 */
    private currentProgress: number = 0;

    /**
     * 创建 ProgressBar 实例
     *
     * @param config - 进度条配置选项
     */
    constructor(config: ProgressBarConfig = {}) {
        this.config = {
            container: config.container || document.body,
            color: config.color || "#4ade80", // 默认绿色
            backgroundColor: config.backgroundColor || "#f0f0f0",
            height: config.height || 4,
            showPercentage: config.showPercentage ?? true, // 默认显示百分比
            showInfo: config.showInfo ?? false, // 默认不显示信息
            showCenterText: config.showCenterText ?? false, // 默认不显示居中文本
            centerText: config.centerText || "正在加载...",
            className: config.className || "tthree-progress-bar",
        };

        this.container = this.config.container;

        // 创建进度条元素
        this.progressBarElement = this.createProgressBar();
        this.progressFill = this.createProgressFill();

        // 创建文本元素
        if (this.config.showPercentage) {
            this.percentageText = this.createPercentageText();
        }

        if (this.config.showInfo) {
            this.infoText = this.createInfoText();
        }

        if (this.config.showCenterText) {
            this.centerTextElement = this.createCenterText();
        }

        // 组装元素（顺序：百分比 -> 进度条 -> 信息）
        if (this.percentageText) {
            this.progressBarElement.appendChild(this.percentageText);
        }

        // 进度条已在 createProgressFill 中添加

        if (this.infoText) {
            this.progressBarElement.appendChild(this.infoText);
        }

        // 添加到容器
        this.container.appendChild(this.progressBarElement);
    }

    /**
     * 创建进度条容器
     */
    private createProgressBar(): HTMLDivElement {
        const element = document.createElement("div");
        element.className = this.config.className;

        Object.assign(element.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "250px",
            textAlign: "center",
            zIndex: "9999",
        });

        return element;
    }

    /**
     * 创建进度填充元素
     */
    private createProgressFill(): HTMLDivElement {
        // 创建进度条轨道容器
        const track = document.createElement("div");
        Object.assign(track.style, {
            position: "relative",
            width: "100%",
            height: "3px",
            backgroundColor: "rgba(128, 128, 128, 0.3)",
            borderRadius: "2px",
            overflow: "hidden",
            margin: "12px 0",
        });

        // 创建进度填充
        const element = document.createElement("div");
        Object.assign(element.style, {
            position: "absolute",
            top: "0",
            left: "0",
            height: "100%",
            width: "0%",
            backgroundColor: this.config.color,
            borderRadius: "2px",
            transition: "width 0.3s ease",
        });

        track.appendChild(element);
        this.progressBarElement.appendChild(track);

        return element;
    }

    /**
     * 创建百分比文本元素
     */
    private createPercentageText(): HTMLDivElement {
        const element = document.createElement("div");

        Object.assign(element.style, {
            fontSize: "16px",
            fontWeight: "500",
            color: this.config.color,
            fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            textAlign: "center",
            marginTop: "8px",
        });

        element.textContent = "0%";

        return element;
    }

    /**
     * 创建信息文本元素
     */
    private createInfoText(): HTMLDivElement {
        const element = document.createElement("div");

        Object.assign(element.style, {
            fontSize: "12px",
            color: "rgba(255, 255, 255, 0.4)",
            fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            textAlign: "center",
            marginTop: "6px",
        });

        element.textContent = "正在加载...";

        return element;
    }

    /**
     * 创建居中文本元素（已集成到进度条容器中，不再需要单独的居中元素）
     */
    private createCenterText(): HTMLDivElement {
        // 不再创建单独的居中文本，因为已经集成到进度条容器中
        const element = document.createElement("div");
        element.style.display = "none";
        return element;
    }

    /**
     * 更新进度条
     *
     * @param progress - 加载进度信息
     */
    public update(progress: LoadingProgress): void {
        this.currentProgress = progress.progress;

        // 更新进度条宽度
        this.progressFill.style.width = `${progress.progress}%`;

        // 更新百分比文本
        if (this.percentageText) {
            this.percentageText.textContent = `${progress.progress}%`;
        }

        // 更新信息文本
        if (this.infoText) {
            const fileName = this.getFileName(progress.url);
            this.infoText.textContent = `正在加载: ${fileName} (${progress.loaded}/${progress.total})`;
        }

        // 更新居中文本
        if (this.centerTextElement) {
            this.centerTextElement.textContent = `${this.config.centerText} ${progress.progress}%`;
        }
    }

    /**
     * 手动设置进度
     *
     * @param progress - 进度百分比 (0-100)
     */
    public setProgress(progress: number): void {
        this.currentProgress = Math.max(0, Math.min(100, progress));
        this.progressFill.style.width = `${this.currentProgress}%`;

        if (this.percentageText) {
            this.percentageText.textContent = `${this.currentProgress}%`;
        }

        if (this.centerTextElement) {
            this.centerTextElement.textContent = `${this.config.centerText} ${this.currentProgress}%`;
        }
    }

    /**
     * 标记加载完成
     *
     * @param autoHide - 是否自动隐藏（默认为 true）
     * @param delay - 延迟隐藏时间（毫秒，默认 500ms）
     */
    public complete(autoHide: boolean = true, delay: number = 500): void {
        this.setProgress(100);

        if (this.infoText) {
            this.infoText.textContent = "加载完成";
        }

        if (this.centerTextElement) {
            this.centerTextElement.textContent = "加载完成";
        }

        if (autoHide) {
            setTimeout(() => {
                this.hide();
            }, delay);
        }
    }

    /**
     * 显示进度条
     */
    public show(): void {
        this.progressBarElement.style.display = "block";
    }

    /**
     * 隐藏进度条
     */
    public hide(): void {
        this.progressBarElement.style.opacity = "0";
        this.progressBarElement.style.transition = "opacity 0.3s ease";

        if (this.centerTextElement) {
            this.centerTextElement.style.opacity = "0";
            this.centerTextElement.style.transition = "opacity 0.3s ease";
        }

        setTimeout(() => {
            this.progressBarElement.style.display = "none";
            if (this.centerTextElement) {
                this.centerTextElement.style.display = "none";
            }
        }, 300);
    }

    /**
     * 重置进度条
     */
    public reset(): void {
        this.currentProgress = 0;
        this.progressFill.style.width = "0%";
        this.progressBarElement.style.opacity = "1";
        this.progressBarElement.style.display = "block";

        if (this.percentageText) {
            this.percentageText.textContent = "0%";
        }

        if (this.infoText) {
            this.infoText.textContent = "正在加载...";
        }

        if (this.centerTextElement) {
            this.centerTextElement.style.opacity = "1";
            this.centerTextElement.style.display = "block";
            this.centerTextElement.textContent = `${this.config.centerText} 0%`;
        }
    }

    /**
     * 从 URL 提取文件名
     *
     * @param url - 完整的 URL
     * @returns 文件名
     */
    private getFileName(url: string): string {
        return url.split("/").pop() || url;
    }

    /**
     * 获取当前进度
     *
     * @returns 当前进度百分比
     */
    public getProgress(): number {
        return this.currentProgress;
    }

    /**
     * 释放进度条占用的资源
     */
    public dispose(): void {
        // 从 DOM 中移除
        if (this.progressBarElement.parentNode) {
            this.progressBarElement.parentNode.removeChild(
                this.progressBarElement,
            );
        }

        if (this.centerTextElement && this.centerTextElement.parentNode) {
            this.centerTextElement.parentNode.removeChild(
                this.centerTextElement,
            );
        }
    }
}
