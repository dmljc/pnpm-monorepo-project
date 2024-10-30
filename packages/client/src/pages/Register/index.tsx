import { Button, Form, Input, message } from "antd";
import { register } from "./api";
import "./index.css";

interface RegisterUser {
  username: string;
  password: string;
  password2: string;
}

const onFinish = async (values: RegisterUser) => {
  const { password, password2 } = values;
  if (password !== password2) {
    message.error("两次密码不一致");
    return;
  }

  try {
    const res = await register(values);

    if (res.success) {
      message.success("注册成功");

    //   setTimeout(() => {
    //     window.location.href = "/login";
    //   }, 1000);
    }
  } catch (e: any) {
    message.error(e);
  }
};

const layout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const layout2 = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
};

const Register = () => {
  return (
    <div className="register">
      <h1 className="title">新三国管理系统</h1>
      <Form
        {...layout1}
        initialValues={{
          username: "zfc",
          password: "123456",
          password2: "123456",
        }}
        onFinish={onFinish}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密 码"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="password2"
          rules={[{ required: true, message: "请输入确认密码!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...layout2}>
          <div className="links">
            <a href="/login">已有账号？去登录</a>
          </div>
        </Form.Item>

        <Form.Item label=" ">
          <Button className="btn" type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
