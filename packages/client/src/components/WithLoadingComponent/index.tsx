import React from "react";
import { Spin } from "antd";

const WithLoadingComponent = (Component: React.ReactElement) => {
    return (
        <React.Suspense fallback={<Spin size="large" />}>
            {Component}
        </React.Suspense>
    );
};

export default WithLoadingComponent;
