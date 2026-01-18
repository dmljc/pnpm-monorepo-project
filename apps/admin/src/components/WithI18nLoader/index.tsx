/**
 * 高阶组件：为页面组件添加 i18n 按需加载
 * 使用事件监听确保翻译完全加载后再渲染
 */
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import i18n from "@/i18n";

interface WithI18nLoaderProps {
    /** 需要加载的命名空间 */
    namespace: string | string[];
    /** 页面组件 */
    children: React.ReactElement;
}

/**
 * i18n 加载器组件
 * 确保翻译资源完全就绪后才渲染子组件
 */
const WithI18nLoader: React.FC<WithI18nLoaderProps> = ({
    namespace,
    children,
}) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let mounted = true;
        const ns = Array.isArray(namespace) ? namespace : [namespace];
        const currentLang = i18n.language;

        const checkAndLoadTranslations = async () => {
            try {
                // 1. 检查是否所有命名空间都已加载
                const allLoaded = ns.every((n) =>
                    i18n.hasResourceBundle(currentLang, n),
                );

                if (allLoaded) {
                    if (mounted) setIsReady(true);
                    return;
                }

                // 2. 设置加载状态
                if (mounted) setIsReady(false);

                // 3. 创建加载完成的 Promise
                const loadPromise = new Promise<void>((resolve) => {
                    let checkCount = 0;
                    const maxChecks = 10;

                    // 监听资源加载事件
                    const onLoaded = (_loaded: string[]) => {
                        checkCount++;

                        // 检查所需的命名空间是否都已加载
                        const allReady = ns.every((n) =>
                            i18n.hasResourceBundle(currentLang, n),
                        );

                        if (allReady || checkCount >= maxChecks) {
                            i18n.off("loaded", onLoaded);
                            resolve();
                        }
                    };

                    // 监听加载事件
                    i18n.on("loaded", onLoaded);

                    // 超时保护（3秒）
                    setTimeout(() => {
                        i18n.off("loaded", onLoaded);
                        resolve();
                    }, 3000);
                });

                // 4. 开始加载命名空间
                await i18n.loadNamespaces(ns);

                // 5. 等待加载完成事件
                await loadPromise;

                // 6. 最终验证
                const finalCheck = ns.every((n) =>
                    i18n.hasResourceBundle(currentLang, n),
                );

                if (!finalCheck) {
                    console.warn(
                        "[WithI18nLoader] Resources may not be fully loaded:",
                        ns,
                    );
                }

                // 7. 设置就绪状态
                if (mounted) {
                    setIsReady(true);
                }
            } catch (error) {
                console.error(
                    "[WithI18nLoader] Failed to load namespaces:",
                    ns,
                    error,
                );
                if (mounted) {
                    setIsReady(true); // 失败也继续，避免阻塞
                }
            }
        };

        checkAndLoadTranslations();

        return () => {
            mounted = false;
        };
    }, [namespace]);

    // 翻译未就绪，显示加载状态
    if (!isReady) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                    width: "100%",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    // 翻译就绪，渲染子组件
    return children;
};

/**
 * 创建带 i18n 加载的组件包装器
 * @param Component 页面组件
 * @param namespace 需要加载的命名空间
 * @returns 包装后的组件
 */
export const withI18nLoader = (
    Component: React.ReactElement,
    namespace: string | string[],
): React.ReactElement => {
    return (
        <React.Suspense
            fallback={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "400px",
                    }}
                >
                    <Spin size="large" />
                </div>
            }
        >
            <WithI18nLoader namespace={namespace}>{Component}</WithI18nLoader>
        </React.Suspense>
    );
};

export default WithI18nLoader;
