import { Button } from "antd";
import { useMenuStore } from "@/store/menuStore";

type AuthButtonProps = {
    code: string;
    children: React.ReactNode;
} & React.ComponentProps<typeof Button>;

const AuthButton = ({ code, children, ...rest }: AuthButtonProps) => {
    const buttonList = useMenuStore()?.menuMeButtonList;
    const hasPermission = buttonList?.some((item) => item.code === code);
    if (!hasPermission) {
        return null; // 没有权限，不显示
    }

    return <Button {...rest}>{children}</Button>;
};

export default AuthButton;
