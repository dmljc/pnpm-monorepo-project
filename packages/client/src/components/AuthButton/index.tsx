import { Button } from "antd";
import { usePermission } from "@/utils";

// 权限按钮Props
type AuthButtonProps = {
    code: string;
    children: React.ReactNode;
} & React.ComponentProps<typeof Button>;

// 权限按钮
// 根据code判断是否有权限
// 如果有权限则显示按钮
// 如果没有权限则禁用按钮

const AuthButton = ({ code, children, ...rest }: AuthButtonProps) => {
    const hasPermission = usePermission(code);

    return (
        <Button disabled={!hasPermission} {...rest}>
            {children}
        </Button>
    );
};

export default AuthButton;
