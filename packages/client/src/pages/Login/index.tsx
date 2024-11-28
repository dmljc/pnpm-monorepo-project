import { FC } from "react";
import { Button, Form, Input, message } from "antd";
import { login } from "./api";
import { useNavigate } from "react-router-dom";
import "./index.css";
interface LoginUser {
    username: string;
    password: string;
}

const layout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const layout2 = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
};

const Login: FC = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: LoginUser) => {
        try {
            const res = await login(values);
            if (res.success) {
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
        <div className="login">
            {contextHolder}
            <h1 className="title">英雄管理系统</h1>
            <Form
                {...layout1}
                onFinish={onFinish}
                colon={false}
                autoComplete="off"
                initialValues={{
                    username: "zfc",
                    password: "123456",
                    password2: "123456",
                }}
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

                <Form.Item {...layout2}>
                    <div className="links">
                        <a href="/register">没有账号？去注册</a>
                    </div>
                </Form.Item>

                <Form.Item label=" ">
                    <Button className="btn" type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
