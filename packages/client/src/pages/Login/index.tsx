import { FC, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Divider, Space, Tabs, message } from "antd";
import type { TabsProps } from "antd";
import {
    GithubOutlined,
    GoogleOutlined,
    WechatOutlined,
    LockOutlined,
    MobileOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    LoginFormPage,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
} from "@ant-design/pro-components";
import { login } from "./api";

import useStyles from "./style";

// 登录类型枚举
enum LoginType {
    ACCOUNT = "account",
    PHONE = "phone",
}

// 图标样式常量
const ICON_STYLES: CSSProperties = {
    color: "rgba(0, 0, 0, 0.2)",
    fontSize: "18px",
    verticalAlign: "middle",
    cursor: "pointer",
};

// 登录用户接口
interface LoginUser {
    username: string;
    password: string;
}

// 登录表单配置
const LOGIN_TABS: TabsProps["items"] = [
    {
        key: LoginType.ACCOUNT,
        label: "账号密码登录",
    },
    {
        key: LoginType.PHONE,
        label: "手机号登录",
    },
];

const Login: FC = () => {
    const [loginType, setLoginType] = useState<LoginType>(LoginType.ACCOUNT);
    const { styles: ss } = useStyles();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    // 处理登录提交
    const handleLoginSubmit = async (values: LoginUser) => {
        try {
            const res = await login(values);
            if (res.success) {
                const { access_token, refresh_token } = res.data;
                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);
                messageApi.success("登录成功");
                setTimeout(() => navigate("/"), 1000);
            }
        } catch (error) {
            messageApi.error(String(error));
        }
    };

    // 处理Github登录
    const handleGithubLogin = async () => {
        try {
            window.location.href =
                "http://localhost:3000/api/auth/github/login";
        } catch {
            messageApi.error("Github登录失败");
        }
    };

    // 渲染账号密码登录表单
    const renderAccountLogin = () => (
        <>
            <ProFormText
                name="username"
                fieldProps={{
                    size: "large",
                    prefix: <UserOutlined className={ss.username} />,
                }}
                placeholder={"用户名: zfcstring"}
                rules={[
                    {
                        required: true,
                        message: "请输入用户名!",
                    },
                ]}
            />
            <ProFormText.Password
                name="password"
                fieldProps={{
                    size: "large",
                    prefix: <LockOutlined className={ss.password} />,
                }}
                placeholder={"密码: 999999"}
                rules={[
                    {
                        required: true,
                        message: "请输入密码！",
                    },
                ]}
            />
        </>
    );

    // 渲染手机号登录表单
    const renderPhoneLogin = () => (
        <>
            <ProFormText
                fieldProps={{
                    size: "large",
                    prefix: <MobileOutlined className={ss.mobile} />,
                }}
                name="mobile"
                placeholder={"手机号"}
                rules={[
                    {
                        required: true,
                        message: "请输入手机号！",
                    },
                    {
                        pattern: /^1\d{10}$/,
                        message: "手机号格式错误！",
                    },
                ]}
            />
            <ProFormCaptcha
                fieldProps={{
                    size: "large",
                    prefix: <LockOutlined className={ss.captcha} />,
                }}
                captchaProps={{ size: "large" }}
                placeholder={"请输入验证码"}
                captchaTextRender={(timing, count) => {
                    return timing ? `${count} ${"获取验证码"}` : "获取验证码";
                }}
                name="captcha"
                rules={[{ required: true, message: "请输入验证码！" }]}
                onGetCaptcha={async () => {
                    message.success("获取验证码成功！验证码为：1234");
                }}
            />
        </>
    );

    // 渲染第三方登录按钮
    const renderOtherLoginMethods = () => (
        <div className={ss.actions}>
            <Divider plain>
                <span className={ss.others}>其他登录方式</span>
            </Divider>
            <Space align="center" size={24}>
                <div className={ss.alipay}>
                    <GithubOutlined
                        onClick={handleGithubLogin}
                        style={{ ...ICON_STYLES, color: "#1677FF" }}
                    />
                </div>
                <div className={ss.taobao}>
                    <GoogleOutlined
                        style={{ ...ICON_STYLES, color: "#1677FF" }}
                    />
                </div>
                <div className={ss.weibo}>
                    <WechatOutlined
                        style={{ ...ICON_STYLES, color: "#1890ff" }}
                    />
                </div>
            </Space>
        </div>
    );

    return (
        <div className={ss.root}>
            <LoginFormPage
                initialValues={{
                    username: "zfcstring",
                    password: "999999",
                }}
                backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                logo="https://github.githubassets.com/favicons/favicon.png"
                title="Github"
                onFinish={handleLoginSubmit}
                subTitle="全球最大的代码托管平台"
                actions={renderOtherLoginMethods()}
            >
                <Tabs
                    centered
                    items={LOGIN_TABS}
                    activeKey={loginType}
                    onChange={(activeKey) =>
                        setLoginType(activeKey as LoginType)
                    }
                />
                {loginType === LoginType.ACCOUNT
                    ? renderAccountLogin()
                    : renderPhoneLogin()}
                <div className={ss.checkbox}>
                    <ProFormCheckbox noStyle name="autoLogin">
                        自动登录
                    </ProFormCheckbox>
                    <a className={ss.forget}>忘记密码</a>
                </div>
                {contextHolder}
            </LoginFormPage>
        </div>
    );
};

export default Login;
