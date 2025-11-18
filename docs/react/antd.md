---
outline: deep
---

# 换肤

## 配置主题

通过在 `ConfigProvider` 中传入 `theme` 属性，实现一键换肤。

```js{3}
<ConfigProvider
    theme={{
        algorithm: isDarkModel ? darkAlgorithm : defaultAlgorithm,
    }}
>
    <Layout></Layout>
</ConfigProvider>
```

## 遇到的问题

![header](/header.jpg)

## 解决方案

```js{4-8}
<ConfigProvider
    theme={{
        algorithm: isDarkModel ? darkAlgorithm : defaultAlgorithm,
        components: {
            // 单独处理个别组件
            Layout: {
                headerBg: isDarkModel ? "#141414" : "#fff",
            },
        },
    }}
>
    <Layout></Layout>
</ConfigProvider>
```
