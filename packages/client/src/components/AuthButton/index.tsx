import React from "react";
import { Button } from "antd";
import { usePermission } from "@/utils";

type AuthButtonProps = {
    /** 权限码，用于判断是否有操作权限 */
    code: string;
    /** 按钮内容 */
    children: React.ReactNode;
} & React.ComponentProps<typeof Button>;

/**
 * 权限按钮组件
 * 根据权限码判断用户是否有操作权限
 * @param code - 权限码
 * @param children - 按钮内容
 * @param rest - Button组件的其他属性
 * @returns 权限控制的按钮组件
 */
const AuthButton: React.FC<AuthButtonProps> = ({ code, children, ...rest }) => {
    const hasPermission = usePermission(code);

    return (
        <Button disabled={!hasPermission} {...rest}>
            {children}
        </Button>
    );
};

export default AuthButton;
