import React from "react";
import { Spin } from "antd";

const WithLoadingComponent = (Component: JSX.Element) => {
    return (
        <React.Suspense fallback={<Spin size="large" />}>
            {Component}
        </React.Suspense>
    );
};

export default WithLoadingComponent;
