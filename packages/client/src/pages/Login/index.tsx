// React 相关
import { FC, useState, useEffect } from "react";
import type { CSSProperties } from "react";

// 第三方库
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
import { useTranslation } from "react-i18next";

// 工具/常量
import useStyles from "./style";

// 组件
import { LoginControls } from "@/components";

// Store
import { useUserStore, useSystemStore } from "@/store";

// API 调用
import { emailCaptcha } from "./api";
import { configDetail } from "@/pages/SystemConfig/api";

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

// 登录表单配置（使用函数以便读取 i18n）
const getLoginTabs = (
    t: (key: string, options?: any) => string,
): TabsProps["items"] => [
    {
        key: LoginType.ACCOUNT,
        label: t("login:tabs.account"),
    },
    {
        key: LoginType.EMAIL,
        label: t("login:tabs.email"),
    },
];

const Login: FC = () => {
    const { t } = useTranslation();
    const [loginType, setLoginType] = useState<LoginType>(LoginType.ACCOUNT);
    const { styles: ss } = useStyles();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const { systemConfig, setSystemConfig } = useSystemStore();

    useEffect(() => {
        getSystemConfig();
        // 初始化主题
        const { theme } = useSystemStore.getState();
        document.documentElement.setAttribute("data-theme", theme);
    }, []);

    const getSystemConfig = async () => {
        const res = await configDetail();
        if (res.success) {
            setSystemConfig(res.data);
        }
    };

    // 处理登录提交
    const handleLoginSubmit = async (values: LoginUser) => {
        try {
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
                messageApi.success(t("login:messages.loginSuccess"));
                navigate("/");
            } else {
                messageApi.error(t("login:messages.loginFailed"));
            }
        } catch {
            messageApi.error(t("login:messages.networkError"));
        }
    };

    // 处理Github登录
    const handleGithubLogin = async () => {
        try {
            window.location.href =
                "http://localhost:3000/api/auth/github/login";
        } catch {
            messageApi.error(t("login:messages.githubLoginFailed"));
        }
    };

    // 处理Google登录
    const handleGoogleLogin = async () => {
        try {
            window.location.href =
                "http://localhost:3000/api/auth/google/login";
        } catch {
            messageApi.error(t("login:messages.googleLoginFailed"));
        }
    };

    // 处理微信登录
    const handleWechatLogin = async () => {
        try {
            // 微信登录逻辑
            messageApi.info(t("login:messages.wechatLoginComingSoon"));
        } catch {
            messageApi.error(t("login:messages.wechatLoginFailed"));
        }
    };

    // 获取验证码
    const sendEmailCaptcha = async () => {
        try {
            const res = await emailCaptcha({
                address: "1593025641@qq.com",
            });
            if (res?.success) {
                messageApi.success(t("login:messages.captchaSent"));
            } else {
                messageApi.error(t("login:messages.captchaSendFailed"));
            }
        } catch {
            messageApi.error(t("login:messages.captchaSendFailed"));
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
                placeholder={t("login:form.username.placeholder")}
                rules={[
                    {
                        required: true,
                        message: t("login:form.username.required"),
                    },
                ]}
            />
            <ProFormText.Password
                name="password"
                fieldProps={{
                    size: "large",
                    prefix: <LockOutlined className={ss.password} />,
                }}
                placeholder={t("login:form.password.placeholder")}
                rules={[
                    {
                        required: true,
                        message: t("login:form.password.required"),
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
                placeholder={t("login:form.email.placeholder")}
                rules={[
                    {
                        required: true,
                        message: t("login:form.email.required"),
                    },
                    {
                        pattern:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: t("login:form.email.invalid"),
                    },
                ]}
            />
            <ProFormCaptcha
                fieldProps={{
                    size: "large",
                    prefix: <LockOutlined className={ss.captcha} />,
                }}
                captchaProps={{ size: "large" }}
                placeholder={t("login:form.captcha.placeholder")}
                captchaTextRender={(timing, count) => {
                    return timing
                        ? t("login:form.captcha.countdown", { count })
                        : t("login:form.captcha.getCode");
                }}
                name="captcha"
                rules={[
                    {
                        required: true,
                        message: t("login:form.captcha.required"),
                    },
                    {
                        pattern: /^\d{6}$/,
                        message: t("login:form.captcha.invalid"),
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
                <span className={ss.others}>{t("login:otherLogin")}</span>
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
                        onClick={handleWechatLogin}
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
            {/* 右上角控制栏 */}
            <LoginControls />

            <LoginFormPage
                initialValues={{
                    username: "zfcstring",
                    password: "999999",
                    email: "1593025641@qq.com",
                }}
                logo={systemConfig.logo}
                title={systemConfig.name}
                onFinish={handleLoginSubmit}
                subTitle={t("login:subtitle")}
                actions={renderOtherLoginMethods()}
            >
                <Tabs
                    centered
                    items={getLoginTabs(t)}
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
                        {t("login:form.autoLogin")}
                    </ProFormCheckbox>
                    <a className={ss.forget}>
                        {t("login:form.forgetPassword")}
                    </a>
                </div>
                {contextHolder}
            </LoginFormPage>
            {renderCopyright()}
        </div>
    );
};

export default Login;
