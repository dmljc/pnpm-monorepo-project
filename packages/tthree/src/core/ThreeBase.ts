import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    Fog,
    Clock,
    Mesh,
    NoToneMapping,
    AmbientLight,
    DirectionalLight,
    GridHelper,
    AxesHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
    RENDERER_DEFAULTS,
    CAMERA_DEFAULTS,
    CONTROLS_DEFAULTS,
    SCENE_DEFAULTS,
    GRID_DEFAULTS,
    AXES_DEFAULTS,
} from "./constants";
import { disposeMesh } from "./utils";

/**
 * Three.js 应用实例配置选项
 */
export interface Params {
    /** 挂载的DOM元素 */
    container: HTMLElement;
    /** 是否启用抗锯齿 */
    antialias?: boolean;
    /** 是否启用控制器 */
    controls?: boolean;
    /** 自定义相机 */
    camera?: PerspectiveCamera;
    /** 自定义渲染器 */
    renderer?: WebGLRenderer;
    /** 是否显示网格 */
    showGrid?: boolean;
    /** 是否显示坐标轴 */
    showAxes?: boolean;
}

/**
 * Three.js 基础应用类
 *
 * 提供完整的 Three.js 场景管理、相机控制、渲染器配置和动画循环。
 * 支持多实例隔离、自动尺寸自适应、资源管理等功能。
 *
 * @example
 * ```typescript
 * // 1. 创建实例
 * const app = new ThreeBase({
 *   container: document.getElementById('canvas-container'),
 *   showGrid: true,
 *   showAxes: true
 * });
 *
 * // 2. 初始化
 * app.init();
 *
 * // 3. 添加网格
 * const mesh = new THREE.Mesh(geometry, material);
 * app.addMesh(mesh);
 *
 * // 4. 启动动画
 * app.animate();
 *
 * // 5. 清理资源
 * app.destroy();
 * ```
 */
export class ThreeBase {
    /** 场景实例 */
    public scene: Scene | undefined;

    /** 相机实例 */
    public camera: PerspectiveCamera | undefined;

    /** 渲染器实例 */
    public renderer: WebGLRenderer | undefined;

    /** 控制器实例 */
    public controls: OrbitControls | undefined;

    /** 是否正在运行 */
    private isRunning: boolean = false;

    /** 是否已初始化（延迟初始化标记） */
    private initialized: boolean = false;

    /** 挂载容器 */
    private container: HTMLElement;

    /** 初始化配置缓存（用于延迟初始化） */
    private initOptions: Params | undefined;

    /** 尺寸观察器 */
    private resizeObserver: ResizeObserver | undefined;

    /** 帧时钟与时间数据 */
    private clock: Clock = new Clock();
    protected deltaTime: number = 0;
    protected elapsedTime: number = 0;

    /**
     * 创建 Three.js 应用实例
     *
     * @param config - 应用配置
     */
    constructor(config: Params) {
        this.container = config.container;
        this.initOptions = config;
    }

    /**
     * 创建网格
     *
     * @returns 网格实例
     */
    private createGrid(): GridHelper {
        return new GridHelper(
            GRID_DEFAULTS.SIZE,
            GRID_DEFAULTS.DIVISIONS,
            GRID_DEFAULTS.CENTER_COLOR,
            GRID_DEFAULTS.COLOR,
        );
    }

    /**
     * 创建坐标轴
     *
     * @returns 坐标轴实例
     */
    private createAxes(): AxesHelper {
        return new AxesHelper(AXES_DEFAULTS.SIZE);
    }

    /**
     * 创建场景
     *
     * @returns 配置好的场景实例
     */
    private createScene(): Scene {
        const scene = new Scene();
        scene.background = new Color(SCENE_DEFAULTS.BACKGROUND);
        scene.fog = new Fog(
            SCENE_DEFAULTS.FOG.color,
            SCENE_DEFAULTS.FOG.near,
            SCENE_DEFAULTS.FOG.far,
        );

        // 添加环境光（浅色背景下可以减弱）
        const ambientLight = new AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // 添加方向光
        const directionalLight = new DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(10, 10, 10);
        scene.add(directionalLight);

        // 添加网格和坐标轴（根据配置）
        if (this.initOptions?.showGrid) {
            scene.add(this.createGrid());
        }

        if (this.initOptions?.showAxes) {
            scene.add(this.createAxes());
        }

        return scene;
    }

    /**
     * 创建透视相机
     *
     * @returns 配置好的相机实例
     */
    private createCamera(): PerspectiveCamera {
        const { width, height } = this.getContainerSize();
        const camera = new PerspectiveCamera(
            CAMERA_DEFAULTS.PERSPECTIVE.fov,
            width / height,
            CAMERA_DEFAULTS.PERSPECTIVE.near,
            CAMERA_DEFAULTS.PERSPECTIVE.far,
        );

        camera.position.set(
            CAMERA_DEFAULTS.POSITION.x,
            CAMERA_DEFAULTS.POSITION.y,
            CAMERA_DEFAULTS.POSITION.z,
        );

        return camera;
    }

    /**
     * 创建 WebGL 渲染器
     *
     * @param config - 应用配置
     * @returns 配置好的渲染器实例
     */
    private createRenderer(config: Params): WebGLRenderer {
        const renderer = new WebGLRenderer({
            ...RENDERER_DEFAULTS.CONTEXT_ATTRIBUTES,
            antialias:
                config.antialias ??
                RENDERER_DEFAULTS.CONTEXT_ATTRIBUTES.antialias,
        });

        // 输出配置（保持最简）
        renderer.outputColorSpace = RENDERER_DEFAULTS.OUTPUT.colorSpace;
        renderer.toneMapping = NoToneMapping;

        this.container.appendChild(renderer.domElement);

        return renderer;
    }

    /**
     * 创建轨道控制器
     *
     * @returns 配置好的控制器实例
     */
    private createControls(): OrbitControls {
        if (!this.camera || !this.renderer) {
            throw new Error("相机和渲染器必须在创建控制器之前被初始化");
        }
        const controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );

        Object.entries(CONTROLS_DEFAULTS.ORBIT).forEach(([key, value]) => {
            (controls as any)[key] = value;
        });

        return controls;
    }

    /**
     * 设置尺寸自适应
     */
    private setupAutoResize(): void {
        this.resizeObserver = new ResizeObserver(() => {
            this.handleResize();
        });

        this.resizeObserver.observe(this.container);
    }

    /**
     * 处理容器尺寸变化
     */
    private handleResize(): void {
        if (!this.camera || !this.renderer) return;

        const { width, height } = this.getContainerSize();
        const aspect = height === 0 ? 1 : width / height;

        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    /**
     * 初始化应用（仅创建资源，不自动启动）
     */
    public init(): void {
        if (this.initialized) return;

        if (!this.initOptions) {
            throw new Error("初始化失败：缺少必要的配置参数");
        }

        const config = this.initOptions;

        // 初始化场景
        this.scene = this.createScene();

        // 初始化相机
        this.camera = config.camera || this.createCamera();

        // 初始化渲染器
        this.renderer = config.renderer || this.createRenderer(config);

        // 初始化控制器
        if (config.controls !== false) {
            this.controls = this.createControls();
        }

        // 启用尺寸自适应
        this.setupAutoResize();

        this.initialized = true;
    }

    /**
     * 获取应用运行状态
     *
     * @returns 是否正在运行
     */
    public getIsRunning(): boolean {
        return this.isRunning;
    }

    /**
     * 获取容器元素
     *
     * @returns 容器DOM元素
     */
    public getContainer(): HTMLElement {
        return this.container;
    }

    /**
     * 向场景添加网格对象
     *
     * **功能说明：**
     * - 自动将网格添加到场景中
     * - 如果未初始化，会自动调用 init()
     *
     * @param mesh 要添加的网格对象
     * @example
     * ```typescript
     * const app = new ThreeBase({
     *   container: el
     * });
     *
     * // 添加网格
     * app.addMesh(mesh);
     * ```
     */
    public addMesh(mesh: Mesh): void {
        if (!this.initialized) {
            this.init();
        }

        if (!this.scene) {
            throw new Error("场景未初始化，无法添加网格");
        }

        this.scene.add(mesh);
    }

    /**
     * 获取容器尺寸
     *
     * @returns 容器宽度和高度
     */
    private getContainerSize(): { width: number; height: number } {
        const rect = this.container.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
        };
    }

    /**
     * 启动动画循环（公开入口，使用 WebGLRenderer.setAnimationLoop）
     */
    public animate(): void {
        // 保证已初始化
        if (!this.initialized) {
            this.init();
        }
        // 幂等：已运行则不重复启动
        if (this.isRunning) return;

        if (!this.renderer) {
            throw new Error("渲染器未初始化，请先调用 init() 方法");
        }

        this.isRunning = true;
        this.clock.start();
        this.renderer.setAnimationLoop(() => this.renderFrame());
    }

    /**
     * 每帧渲染（由 setAnimationLoop 驱动）
     */
    private renderFrame(): void {
        if (!this.renderer || !this.scene || !this.camera) return;

        const delta = this.clock.getDelta();
        this.deltaTime = delta;
        this.elapsedTime += delta;

        if (this.controls) {
            this.controls.update();
        }

        // 渲染场景
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * 停止应用和动画循环
     */
    public stopAnimate(): void {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.clock.stop();
        this.renderer?.setAnimationLoop(null);
    }

    /**
     * 销毁应用
     */
    public destroy(): void {
        this.initialized = false;

        this.stopAnimate();

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = undefined;
        }

        if (this.controls) {
            this.controls.dispose();
            this.controls = undefined;
        }

        if (this.renderer) {
            this.renderer.dispose();
            this.renderer.domElement.remove();
            this.renderer = undefined;
        }

        // 遍历场景中的所有对象，释放网格资源
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object instanceof Mesh) {
                    disposeMesh(object as Mesh);
                }
            });
            this.scene = undefined;
        }

        this.camera = undefined;
    }
}
