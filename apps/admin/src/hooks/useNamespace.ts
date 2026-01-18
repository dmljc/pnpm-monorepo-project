/**
 * 按需加载 i18n 命名空间的 Hook
 * 只在需要时加载对应的翻译文件
 */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * 按需加载命名空间
 * @param namespaces 需要加载的命名空间（单个或数组）
 * @returns i18n 实例和加载状态
 */
export const useNamespace = (
    namespaces: string | string[],
): {
    t: ReturnType<typeof useTranslation>["t"];
    i18n: ReturnType<typeof useTranslation>["i18n"];
    ready: boolean;
} => {
    const [ready, setReady] = useState(false);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const ns = Array.isArray(namespaces) ? namespaces : [namespaces];

        // 检查是否所有命名空间都已加载
        const allLoaded = ns.every((namespace) =>
            i18n.hasResourceBundle(i18n.language, namespace),
        );

        if (allLoaded) {
            setReady(true);
            return;
        }

        // 加载缺失的命名空间
        const loadNamespaces = async () => {
            try {
                await i18n.loadNamespaces(ns);
                setReady(true);
            } catch (error) {
                console.error("Failed to load namespaces:", ns, error);
                setReady(true); // 即使失败也设置为 ready，避免无限加载
            }
        };

        loadNamespaces();
    }, [namespaces, i18n]);

    return { t, i18n, ready };
};

/**
 * 预加载命名空间（用于提前加载可能需要的翻译文件）
 * @param namespaces 要预加载的命名空间
 */
export const usePreloadNamespace = (namespaces: string | string[]) => {
    const { i18n } = useTranslation();
    const ns = Array.isArray(namespaces) ? namespaces : [namespaces];

    useEffect(() => {
        i18n.loadNamespaces(ns).catch((error) => {
            console.error("Failed to preload namespaces:", ns, error);
        });
    }, [namespaces, i18n]);
};
