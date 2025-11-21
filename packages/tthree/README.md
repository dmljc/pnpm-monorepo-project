threejs-campus-visualization/
├── public/ # 静态资源
├── src/
│ ├── core/ # 核心引擎
│ │ ├── ThreeApp.ts # 主应用类
│ │ ├── RenderEngine.ts # 渲染引擎
│ │ ├── SceneManager.ts # 场景管理器
│ │ ├── CameraController.ts # 相机控制器
│ │ └── constants.ts # 核心引擎常量定义
│ ├── utils/ # 工具函数
│ │ ├── dispose.ts # 资源清理工具
│ │ └── index.ts # 统一导出
│ ├── effects/ # 特效系统
│ │ ├── base/ # 基础特效类
│ │ │ ├── BaseEffect.ts
│ │ │ ├── ParticleEffect.ts
│ │ │ └── ShaderEffect.ts
│ │ ├── weather/ # 天气特效
│ │ │ ├── RainEffect.ts
│ │ │ ├── SnowEffect.ts
│ │ │ ├── FogEffect.ts
│ │ │ └── index.ts # 统一导出
│ ├── components/ # 三维组件
│ │ ├── vehicles/ # 车辆组件
│ │ │ ├── Car.ts
│ │ │ ├── Truck.ts
│ │ │ └── VehicleManager.ts
│ ├── utils/ # 工具函数
│ │ ├── math/ # 数学工具
│ │ │ ├── VectorUtils.ts
│ │ │ ├── ColorUtils.ts
│ │ │ └── GeometryUtils.ts
│ │ ├── helpers/ # 调试助手
│ │ │ ├── DebugGUI.ts
│ │ │ ├── StatsHelper.ts
│ │ │ └── GridHelper.ts
│ │ └── constants/ # 常量定义
│ │ ├── EffectTypes.ts
│ │ ├── WeatherTypes.ts
│ │ └── AlarmTypes.ts
│ ├── scenes/ # 场景定义
│ │ ├── BaseScene.ts
│ │ ├── DayScene.ts
│ │ ├── NightScene.ts
│ │ └── EmergencyScene.ts
│ └── index.ts # 应用入口
├── package.json
├── rollup.config.js # Rollup构建配置
├── tsconfig.json # TypeScript配置
├── typedoc.json # TypeDoc文档配置
└── README.md
