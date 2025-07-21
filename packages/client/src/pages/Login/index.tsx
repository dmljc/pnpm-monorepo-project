import { FC, useState, useEffect } from "react";
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
import { emailCaptcha } from "./api";
import { configDetail } from "@/pages/SystemConfig/api";
import { useUserStore, useSystemStore } from "@/store";
import useStyles from "./style";

// 登录类型枚举
enum LoginType {
    ACCOUNT = "account",
    EMAIL = "email",
}

// 图标样式常量
const ICON_STYLES: CSSProperties = {
    color: "rgba(0, 0, 0, 0.2)",
    fontSize: "18px",
    verticalAlign: "middle",
    cursor: "pointer",
};

// 登录用户接口
export interface LoginUser {
    username: string;
    password: string;
    email: string;
    captcha: string;
}

// 登录表单配置
const LOGIN_TABS: TabsProps["items"] = [
    {
        key: LoginType.ACCOUNT,
        label: "账号密码登录",
    },
    {
        key: LoginType.EMAIL,
        label: "邮箱登录",
    },
];

const Login: FC = () => {
    const [loginType, setLoginType] = useState<LoginType>(LoginType.ACCOUNT);
    const { styles: ss } = useStyles();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const { systemConfig, setSystemConfig } = useSystemStore.getState();

    useEffect(() => {
        getSystemConfig();
    }, []);

    const getSystemConfig = async () => {
        const res = await configDetail();
        if (res.success) {
            setSystemConfig(res.data);
        }
    };

    // 处理登录提交
    const handleLoginSubmit = async (values: LoginUser) => {
        const params = {
            login:
                loginType === LoginType.ACCOUNT
                    ? values.username
                    : values.email,
            code:
                loginType === LoginType.ACCOUNT
                    ? values.password
                    : values.captcha,
        };

        const resp = await useUserStore.getState().login(params);
        if (resp === true) {
            navigate("/");
        } else {
            messageApi.error("登录失败");
        }
    };

    // 处理Github登录
    const handleGithubLogin = async () => {
        try {
            window.location.href =
                "http://localhost:3000/api/auth/github/login";
        } catch {
            messageApi.error("Github 登录失败");
        }
    };
    // 处理Google登录
    const handleGoogleLogin = async () => {
        try {
            window.location.href =
                "http://localhost:3000/api/auth/google/login";
        } catch {
            messageApi.error("Google 登录失败");
        }
    };

    // 获取验证码
    const sendEmailCaptcha = async () => {
        const res = await emailCaptcha({
            address: "1593025641@qq.com",
        });
        messageApi.success(`您的验证码是：${res?.data}，有效期为 5 分钟`);
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

    // 渲染邮箱登录表单
    const renderEmailLogin = () => (
        <>
            <ProFormText
                fieldProps={{
                    size: "large",
                    prefix: <MobileOutlined className={ss.email} />,
                }}
                name="email"
                placeholder={"邮箱"}
                rules={[
                    {
                        required: true,
                        message: "请输入邮箱！",
                    },
                    {
                        pattern:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "请输入正确的邮箱格式！",
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
                rules={[
                    { required: true, message: "请输入验证码！" },
                    {
                        pattern: /^\d{6}$/,
                        message: "验证码必须是6位数字",
                    },
                ]}
                onGetCaptcha={sendEmailCaptcha}
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
                        onClick={handleGoogleLogin}
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

    // 渲染版权信息
    const renderCopyright = () => {
        if (!systemConfig || !systemConfig.copyright) return null;
        return <div className={ss.copyright}>{systemConfig.copyright}</div>;
    };

    return (
        <div className={ss.root}>
            <LoginFormPage
                initialValues={{
                    username: "zfcstring",
                    password: "999999",
                    email: "1593025641@qq.com",
                }}
                backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                logo={systemConfig.logo}
                title={systemConfig.name}
                onFinish={handleLoginSubmit}
                subTitle={systemConfig.description}
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
                    : renderEmailLogin()}
                <div className={ss.checkbox}>
                    <ProFormCheckbox noStyle name="autoLogin">
                        自动登录
                    </ProFormCheckbox>
                    <a className={ss.forget}>忘记密码</a>
                </div>
                {contextHolder}
            </LoginFormPage>
            {renderCopyright()}
        </div>
    );
};

export default Login;
