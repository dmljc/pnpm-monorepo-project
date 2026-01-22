## `tthree` 项目结构

<!-- ```text
tthree/
├── src/
│   ├── core/                      # 核心 3D 引擎
│   │   ├── Tthree.ts            # 主应用类
│   │   ├── RenderEngine.ts        # 渲染引擎
│   │   ├── SceneManager.ts        # 场景管理器
│   │   └── CameraController.ts    # 相机控制器
│   ├── loaders/                   # 加载器模块
│   │   ├── LoadingManager.ts      # 加载管理器
│   │   └── ModelLoader.ts         # 模型加载器
│   ├── components/                # UI 组件
│   │   └── ProgressBar.ts         # 进度条组件
│   ├── config/                    # 配置和常量
│   │   └── constants.ts           # 默认配置
│   ├── utils/                     # 工具函数
│   │   ├── dispose.ts             # 资源清理工具
│   │   └── index.ts               # 统一导出
│   └── index.ts                   # 应用入口
├── dist/                          # 构建输出目录
├── docs/                          # 文档目录
├── package.json
├── rollup.config.js               # Rollup 构建配置
├── tsconfig.json                  # TypeScript 配置
├── typedoc.json                   # TypeDoc 文档配置
└── README.md
``` -->

---

## `packages/tthree/src/` 目录结构（含天气特效系统）

```text
packages/tthree/src/
├── components/
│   └── ProgressBar.ts
├── config/
│   └── constants.ts
├── core/
│   ├── CameraController.ts
│   ├── RenderEngine.ts
│   ├── SceneManager.ts
│   └── Tthree.ts
├── loaders/
│   ├── LoadingManager.ts
│   └── ModelLoader.ts
├── utils/
│   ├── dispose.ts
│   └── index.ts
├── effects/
│   ├── Weather.ts                 # 抽象基类：生命周期 + 强度 + 启停
│   ├── Wind.ts                    # 风：提供风场参数（写入 ctx.state）
│   ├── Rain.ts                    # 雨：粒子系统，读 ctx.state.wind
│   ├── Snow.ts                    # 雪：粒子系统，读 ctx.state.wind
│   ├── Hail.ts                    # 冰雹：粒子/instancing，读 ctx.state
│   ├── Lightning.ts               # 闪电：闪光 + 可选电弧形体
│   ├── Thunder.ts                 # 打雷：音效 + 可选镜头震动
│   ├── Tornado.ts                 # 龙卷风：旋涡力场/粒子或体积效果
│   ├── composite/
│   │   ├── CompositeWeather.ts    # 组合容器：管理子 Weather 的生命周期
│   │   ├── Orchestrator.ts        # 导演接口：编排联动的统一入口
│   │   ├── StormOrchestrator.ts   # 暴风雨导演：雨 + 闪电 + 雷 的联动
│   │   └── presets.ts             # 预设组合（Storm/Blizzard/...）
│   ├── WeatherSystem.ts           # 系统管理器：注册/切换/每帧 tick
│   └── index.ts                   # effects 统一导出
└── index.ts                       # 包入口（export core/loaders/effects 等）
```

---

## 核心设计与职责边界（Composite + Orchestrator）

### 1) `Weather` 抽象基类（单一天气效果）

- **职责**：统一生命周期与强度控制，保证任意天气都能被 `WeatherSystem` / `CompositeWeather` 调度。
- **必须提供**：
    - `init(ctx)`：初始化资源（添加到 `scene`、创建材质、音频、后处理等）
    - `start()` / `stop()`：启停（建议支持渐入/渐出，但不是强制）
    - `update(dt, t)`：每帧更新（active 时运行）
    - `dispose()`：彻底释放（移除对象 + dispose + 解绑）
- **通用能力**：
    - `intensity (0~1)`：统一强度入口（雨量/风速/闪电频率/音量等映射）
    - `active`：当前启用状态

### 2) `WeatherContext`（共享上下文：无 EventBus，靠共享状态）

- **关键点**：组合联动时，不用事件系统；大部分联动参数通过 `ctx.state` 共享，避免“互相引用”的耦合。
- **建议包含**：
    - **three 对象**：`scene` / `camera` / `renderer`
    - **能力对象（可选）**：`audio`（音频管理）、`postprocess`（闪屏/曝光）、`random`（可复现随机）
    - **统一边界**：`bounds`（天气作用范围）
    - **共享状态 `state`（组合联动核心）**：
        - `state.wind: { vector, gust, turbulence }`
        - `state.stormLevel: number`（暴风强度 0~1）
        - `state.lightning: { lastFlashTime, lastFlashPos, flashEnergy }`（可选）
- **约束**：`state` 的 schema 由 weather 子系统维护，子天气只读写自己负责的字段，避免“全局大泥球”。

### 3) `ParticleWeather`（雨 / 雪 / 冰雹的复用基类）

- **职责**：封装粒子/实例化渲染公共逻辑：创建 `geometry/material`、更新位置、越界重生、强度映射（粒子数/速度/大小）。
- **建议策略**：
    - 雨/雪：优先 `Points + BufferGeometry`（足够高性能）
    - 冰雹：可用 `InstancedMesh`（更有体积感）或仍用 `Points`（先走通）
- **与风联动**：
    - 在 `update` 中读取 `ctx.state.wind.vector`，作为速度偏移，实现“斜雨/飘雪”。

---

## 组合天气核心：Composite + Orchestrator

### 4) `CompositeWeather`（组合容器）

- **职责**：自身也是 `Weather`，但不实现具体视觉；负责子天气生命周期管理与统一强度控制。
- **行为规范**：
    - `init(ctx)`：顺序初始化 `children`（并保存 `ctx`）
    - `start/stop`：默认传播给所有子天气（允许只启动部分）
    - `update(dt, t)`：先调用 `orchestrator`（若存在）再更新子天气
    - `intensity`：父强度乘子强度基准（示例：`childIntensity = parent * childBase`）
    - `dispose`：逆序释放子天气（更安全）

### 5) `Orchestrator`（导演：组合联动逻辑唯一入口）

- **职责**：集中编排“离散联动”和“时序控制”，避免 EventBus，也避免子天气互相调用造成网状耦合。
- **典型导演能力（以 Storm 为例）**：
    - 控制闪电触发节奏（根据 `stormLevel`、随机区间）
    - **闪电 -> 雷声延迟**：导演计算 \(delay = distance / 声速\)，再调用 `Thunder.schedule(delay, energy)`（或 `Thunder.play(...)`）
    - 根据 `stormLevel` 动态调节雨量、风阵（gust）、闪电频率
    - 可选：屏幕轻微曝光闪烁、镜头抖动强度等
- **关键约束**：
    - 子天气可暴露“可被导演调用的有限接口”，例如：
        - `Lightning.flash(position, energy)`
        - `Thunder.schedule(delay, energy)`
        - `Wind.setTarget(vector, gustiness)`
    - 子天气不要反向依赖导演，也不要直接调用其他子天气。

---

## `WeatherSystem`（系统管理器：挂到 `Tthree`）

### 6) `WeatherSystem`

- **职责**：
    - `register(weather)` / `unregister(type)`
    - `setActive(type | instance)`：切换当前天气（支持 `replace` / `overlay` 策略）
    - `tick(dt, t)`：每帧调用当前 active weather 的 `update`
    - `disposeAll()`：统一释放

### 7) 接入 `Tthree` 的方式（需要落地的一点）

因为目前 `Tthree.renderFrame()` 是内部私有逻辑，天气系统要在每帧更新，需要在 `Tthree` 增加一个“每帧扩展点（frame hook / updater）”，供 `WeatherSystem.tick()` 注册执行。
