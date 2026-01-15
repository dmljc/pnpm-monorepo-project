import React from "react";
import { Spin } from "antd";

/**
 * 高阶组件：为懒加载组件添加loading状态
 * @param Component - 需要添加loading的React组件
 * @returns 包装了Suspense的组件
 */

const WithLoadingComponent = (Component: React.ReactElement) => {
    return (
        <React.Suspense fallback={<Spin size="large" />}>
            {Component}
        </React.Suspense>
    );
};

export default WithLoadingComponent;
