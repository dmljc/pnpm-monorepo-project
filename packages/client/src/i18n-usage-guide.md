# i18n 国际化使用指南

## 概述

本项目已配置完整的国际化支持，包含以下页面模块的翻译：

- **common** - 通用翻译
- **login** - 登录页面
- **user** - 用户管理页面
- **role** - 角色管理页面
- **menu** - 菜单管理页面
- **systemConfig** - 系统配置页面
- **profile** - 个人资料页面
- **workplace** - 工作台页面
- **analysis** - 数据分析页面

## 使用方法

### 1. 基本用法

```tsx
import { useTranslation } from "react-i18next";

const MyComponent = () => {
    const { t } = useTranslation("namespace"); // 指定命名空间

    return <div>{t("key")}</div>;
};
```

### 2. 在页面中使用

```tsx
// 登录页面示例
import { useTranslation } from "react-i18next";

const Login = () => {
    const { t } = useTranslation("login");

    return (
        <div>
            <h1>{t("title")}</h1>
            <input placeholder={t("form.username.placeholder")} />
            <button>{t("form.autoLogin")}</button>
        </div>
    );
};
```

### 3. 带参数的翻译

```tsx
const { t } = useTranslation("login");

// 翻译文件: "captchaSent": "您的验证码是：{{code}}，有效期为 5 分钟"
const message = t("messages.captchaSent", { code: "123456" });
// 结果: "您的验证码是：123456，有效期为 5 分钟"
```

### 4. 多命名空间使用

```tsx
import { useTranslation } from "react-i18next";

const MyComponent = () => {
    const { t: tCommon } = useTranslation("common");
    const { t: tUser } = useTranslation("user");

    return (
        <div>
            <h1>{tCommon("welcome")}</h1>
            <button>{tUser("toolbar.add")}</button>
        </div>
    );
};
```

## 翻译文件结构

每个页面模块都有对应的翻译文件，位于 `public/locales/{language}/{namespace}.json`：

```
public/locales/
├── zh/
│   ├── common.json
│   ├── login.json
│   ├── user.json
│   ├── role.json
│   ├── menu.json
│   ├── systemConfig.json
│   ├── profile.json
│   ├── workplace.json
│   └── analysis.json
└── en/
    ├── common.json
    ├── login.json
    ├── user.json
    ├── role.json
    ├── menu.json
    ├── systemConfig.json
    ├── profile.json
    ├── workplace.json
    └── analysis.json
```

## 命名规范

### 1. 键名命名规范

- 使用小写字母和点号分隔
- 按功能模块分组
- 保持语义清晰

```json
{
    "form": {
        "username": {
            "label": "用户名",
            "placeholder": "请输入用户名",
            "required": "请输入用户名"
        }
    },
    "messages": {
        "createSuccess": "创建成功"
    }
}
```

### 2. 常用键名模式

- `title` - 页面标题
- `form.{field}.{type}` - 表单字段相关
- `table.columns.{field}` - 表格列名
- `actions.{action}` - 操作按钮
- `messages.{type}` - 消息提示
- `status.{state}` - 状态文本

## 最佳实践

### 1. 命名空间选择

- 每个页面使用独立的命名空间
- 通用组件使用 `common` 命名空间
- 避免跨命名空间重复翻译

### 2. 翻译键值设计

- 保持键名简洁明了
- 使用嵌套结构组织相关翻译
- 避免过深的嵌套（建议不超过3层）

### 3. 参数化翻译

- 对于动态内容使用参数
- 参数名使用描述性名称
- 提供默认值处理

```json
{
    "messages": {
        "itemCount": "共 {{count}} 项",
        "timeRemaining": "剩余 {{hours}} 小时 {{minutes}} 分钟"
    }
}
```

## 语言切换

项目默认支持中文（zh）和英文（en），可以通过以下方式切换：

```tsx
import i18n from "@/i18n";

// 切换到英文
i18n.changeLanguage("en");

// 切换到中文
i18n.changeLanguage("zh");
```

## 注意事项

1. **命名空间加载**: 确保在使用前已加载对应的命名空间
2. **键名一致性**: 保持中英文翻译文件的键名完全一致
3. **参数类型**: 确保参数类型与翻译文件中的占位符匹配
4. **性能优化**: 避免在渲染函数中频繁调用 `useTranslation`

## 扩展指南

如需添加新的页面模块翻译：

1. 在 `public/locales/zh/` 和 `public/locales/en/` 下创建对应的 JSON 文件
2. 在 `src/i18n.ts` 的 `ns` 数组中添加新的命名空间
3. 在页面组件中使用 `useTranslation("newNamespace")` 引入翻译
