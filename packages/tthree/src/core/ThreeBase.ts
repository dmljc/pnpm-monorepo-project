import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SRGBColorSpace,
    ACESFilmicToneMapping,
    AmbientLight,
    DirectionalLight,
    AxesHelper,
    GridHelper,
    Mesh,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { disposeMesh } from "./utils";

/**
 * ThreeBase 构造参数。
 * @remarks 仅需提供渲染容器，其余行为使用内置默认常量。
 */
export interface Params {
    /**
     * 渲染容器元素，用于挂载 WebGL 画布。
     */
    container: HTMLElement;
    /** 是否显示坐标轴/网格辅助，默认 true */
    showHelpers?: boolean;
}

/**
 * Three.js 基础封装，提供场景、相机、渲染器、交互控制与尺寸自适应。
 *
 * - 支持多实例隔离，资源与事件均按实例进行管理。
 * - 所有默认行为通过顶层常量定义，便于文档与统一维护。
 *
 * @example
 * const three = new ThreeBase({ container: document.getElementById('root')! });
 * // 初始化场景、相机、渲染器
 * three.init();
 * // 清理资源
 * three.dispose();
 */
export class ThreeBase {
    /** 场景对象 */
    public scene: Scene | null = null;
    /** 透视相机 */
    public camera: PerspectiveCamera | null = null;
    /** WebGL 渲染器 */
    public renderer: WebGLRenderer | null = null;
    /** 渲染容器 */
    public container: HTMLElement;
    /** 轨道控制器（可选） */
    public controls?: OrbitControls | null = null;

    /** requestAnimationFrame ID */
    private animationId: number | null = null;

    /** 构造参数的最终形态（当前仅保存 container） */
    protected config: { container: HTMLElement; showHelpers: boolean };

    /** 监听容器尺寸变化以实现自适应 */
    private resizeObserver?: ResizeObserver;
    /** rAF 合并后的实例级尺寸调度标记 */
    private resizeScheduled = false;

    /**
     * 创建一个 ThreeBase 实例。
     * @param params 构造参数，至少包含渲染容器 `container`。
     */
    constructor(params: Params) {
        const defaults = { showHelpers: true };
        this.config = { ...defaults, ...params };

        this.container = this.config.container;

        // 初始化 Three.js 核心组件
        this.scene = new Scene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer();

        this.setupEventListeners();

        this.init();
    }

    /**
     * 创建相机并应用默认参数。
     * @returns 透视相机实例
     */
    protected createCamera(): PerspectiveCamera {
        const { clientWidth: width, clientHeight: height } = this.container;
        const camera = new PerspectiveCamera(
            75,
            Math.max(width, 1) / Math.max(height, 1),
            0.1,
            1000,
        );
        camera.position.set(0, 0, 5);
        return camera;
    }

    /**
     * 创建渲染器并应用默认参数。
     * @returns WebGL 渲染器实例
     */
    protected createRenderer(): WebGLRenderer {
        const { clientWidth: width, clientHeight: height } = this.container;

        const renderer = new WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(Math.max(width, 1), Math.max(height, 1));
        const devicePR = window.devicePixelRatio;
        renderer.setPixelRatio(Math.min(devicePR, 2));
        renderer.outputColorSpace = SRGBColorSpace;
        renderer.toneMapping = ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.setClearColor(0x000000, 1);

        this.container.appendChild(renderer.domElement);
        return renderer;
    }

    /** 初始化场景内容与交互（不创建核心资源） */
    protected init(): void {
        this.setupLights();
        if (this.config.showHelpers) {
            this.setupHelpers();
        }
        this.setupOrbitControls();
    }

    /** 添加基础灯光（环境光 + 平行光） */
    protected setupLights(): void {
        const ambientLight = new AmbientLight(0x404040, 0.6);
        const directionalLight = new DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        if (this.scene) {
            this.scene.add(ambientLight);
        }
        if (this.scene) {
            this.scene.add(directionalLight);
        }
    }

    /** 添加辅助坐标轴与网格 */
    protected setupHelpers(): void {
        if (!this.scene) return;
        const axesHelper = new AxesHelper(5);
        const gridHelper = new GridHelper(10, 10);
        this.scene.add(axesHelper);
        this.scene.add(gridHelper);
    }

    /** 初始化轨道控制器（OrbitControls） */
    protected setupOrbitControls(): void {
        if (!this.camera || !this.renderer) return;
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.enableRotate = true;
    }

    /** 绑定尺寸变化事件（窗口 + 容器） */
    protected setupEventListeners(): void {
        window.addEventListener("resize", this.handleResize);
        if (typeof ResizeObserver !== "undefined") {
            this.resizeObserver = new ResizeObserver(() => this.handleResize());
            this.resizeObserver.observe(this.container);
        }
    }

    /**
     * 处理尺寸变化：读取容器尺寸并更新渲染器/相机。
     */
    protected handleResize = (): void => {
        if (this.resizeScheduled) return;
        this.resizeScheduled = true;
        requestAnimationFrame(() => {
            this.resizeScheduled = false;
            const { clientWidth: width, clientHeight: height } = this.container;
            // 同步更新像素比
            if (this.renderer) {
                const pr = window.devicePixelRatio;
                this.renderer.setPixelRatio(Math.min(pr, 2));
            }
            this.setSize(Math.max(width, 1), Math.max(height, 1));
        });
    };

    /**
     * 手动设置渲染尺寸并同步相机。
     * @param width 目标宽度
     * @param height 目标高度
     */
    public setSize(width: number, height: number): void {
        const w = Math.max(width, 1);
        const h = Math.max(height, 1);
        if (this.camera) {
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
        }
        if (this.renderer) {
            this.renderer.setSize(w, h);
        }
    }

    /** 渲染一帧 */
    protected render(): void {
        if (!this.scene || !this.camera || !this.renderer) return;
        this.renderer.render(this.scene, this.camera);
    }

    /** 强制渲染一帧（不调度下一帧） */
    public renderOnce(): void {
        this.update();
        this.render();
    }

    /**
     * 动画循环（requestAnimationFrame）。
     * 使用箭头函数保持稳定引用，便于开始/停止。
     */
    protected animate = (): void => {
        this.update();
        this.render();
        this.animationId = requestAnimationFrame(this.animate);
    };

    /** 每帧更新处理（控制器更新 + 子类扩展点） */
    protected update(): void {
        this.controls?.update();
    }

    /** 开始动画循环 */
    public start(): void {
        if (this.animationId !== null) return;
        // 首帧统一使用 rAF 调度，避免同步渲染的时序差异
        this.animationId = requestAnimationFrame(this.animate);
    }

    /** 停止动画循环 */
    public stop(): void {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * 释放资源并解除事件绑定。
     * - 停止动画
     * - 移除窗口与容器尺寸监听
     * - 释放控制器与渲染器
     * - 遍历场景释放几何与材质
     */
    public dispose(): void {
        this.stop();
        window.removeEventListener("resize", this.handleResize);
        this.resizeObserver?.disconnect();

        this.controls?.dispose();

        if (this.renderer?.domElement?.parentNode) {
            this.renderer.domElement.parentNode.removeChild(
                this.renderer.domElement,
            );
        }
        this.renderer?.dispose();

        if (this.scene) {
            this.scene.traverse((object) => {
                if (object instanceof Mesh) {
                    disposeMesh(object);
                }
            });
        }
    }
}
