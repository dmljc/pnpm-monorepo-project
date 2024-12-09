import { FC } from "react";
import { Button, Form, Input, message } from "antd";
import { login } from "./api";
import { useNavigate } from "react-router-dom";
interface LoginUser {
    username: string;
    password: string;
}

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const Login: FC = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: LoginUser) => {
        try {
            const res = await login(values);
            if (res.success) {
                localStorage.setItem("token", res.data.token);
                messageApi.success("登录成功");
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            }
        } catch (e) {
            messageApi.error(e as any);
        }
    };

    return (
        <div
            className="login"
            style={{
                background: "#fff",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Form
                {...layout}
                onFinish={onFinish}
                colon={false}
                autoComplete="off"
                initialValues={{
                    username: "zfcstring",
                    password: "868891",
                }}
                style={{ minWidth: 400 }}
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: "请输入用户名!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: "请输入密码!" }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item label=" ">
                    <Button
                        className="btn"
                        block
                        type="primary"
                        htmlType="submit"
                    >
                        登录
                    </Button>
                </Form.Item>
            </Form>
            {contextHolder}
        </div>
    );
};

export default Login;
