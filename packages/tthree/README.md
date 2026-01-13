tthree/
├── src/
│ ├── core/ # 核心 3D 引擎
│ │ ├── ThreeApp.ts # 主应用类
│ │ ├── RenderEngine.ts # 渲染引擎
│ │ ├── SceneManager.ts # 场景管理器
│ │ └── CameraController.ts # 相机控制器
│ ├── loaders/ # 加载器模块
│ │ ├── LoadingManager.ts # 加载管理器
│ │ └── ModelLoader.ts # 模型加载器
│ ├── components/ # UI 组件
│ │ └── ProgressBar.ts # 进度条组件
│ ├── config/ # 配置和常量
│ │ └── constants.ts # 默认配置
│ ├── utils/ # 工具函数
│ │ ├── dispose.ts # 资源清理工具
│ │ └── index.ts # 统一导出
│ └── index.ts # 应用入口
├── dist/ # 构建输出目录
├── docs/ # 文档目录
├── package.json
├── rollup.config.js # Rollup构建配置
├── tsconfig.json # TypeScript配置
├── typedoc.json # TypeDoc文档配置
└── README.md
