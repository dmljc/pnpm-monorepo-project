import { FC, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { Divider, Space, Tabs, message } from "antd";
import type { TabsProps } from "antd";
import {
    AlipayOutlined,
    LockOutlined,
    MobileOutlined,
    TaobaoOutlined,
    UserOutlined,
    WeiboOutlined,
} from "@ant-design/icons";
import {
    LoginFormPage,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
} from "@ant-design/pro-components";
import { login } from "./api";

import useStyles from "./style";

type LoginType = "phone" | "account";

const iconStyles: CSSProperties = {
    color: "rgba(0, 0, 0, 0.2)",
    fontSize: "18px",
    verticalAlign: "middle",
    cursor: "pointer",
};

interface LoginUser {
    username: string;
    password: string;
}

const Login: FC = () => {
    const [loginType, setLoginType] = useState<LoginType>("account");
    const { styles: ss } = useStyles();

    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const items: TabsProps["items"] = [
        {
            key: "account",
            label: "账号密码登录",
        },
        {
            key: "phone",
            label: "手机号登录",
        },
    ];

    const onFinish = async (values: LoginUser) => {
        try {
            const res = await login(values);
            if (res.success) {
                localStorage.setItem("access_token", res.data.access_token);
                localStorage.setItem("refresh_token", res.data.refresh_token);
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
        <div className={ss.root}>
            <LoginFormPage
                initialValues={{
                    username: "zfcstring",
                    password: "999999",
                }}
                backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
                logo="https://github.githubassets.com/favicons/favicon.png"
                title="Github"
                onFinish={onFinish}
                subTitle="全球最大的代码托管平台"
                actions={
                    <div className={ss.actions}>
                        <Divider plain>
                            <span className={ss.others}>其他登录方式</span>
                        </Divider>
                        <Space align="center" size={24}>
                            <div className={ss.alipay}>
                                <AlipayOutlined
                                    style={{ ...iconStyles, color: "#1677FF" }}
                                />
                            </div>
                            <div className={ss.taobao}>
                                <TaobaoOutlined
                                    style={{ ...iconStyles, color: "#FF6A10" }}
                                />
                            </div>
                            <div className={ss.weibo}>
                                <WeiboOutlined
                                    style={{ ...iconStyles, color: "#1890ff" }}
                                />
                            </div>
                        </Space>
                    </div>
                }
            >
                <Tabs
                    centered
                    items={items}
                    activeKey={loginType}
                    onChange={(activeKey) =>
                        setLoginType(activeKey as LoginType)
                    }
                />
                {loginType === "account" && (
                    <>
                        <ProFormText
                            name="username"
                            fieldProps={{
                                size: "large",
                                prefix: (
                                    <UserOutlined className={ss.username} />
                                ),
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
                                prefix: (
                                    <LockOutlined className={ss.password} />
                                ),
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
                )}
                {loginType === "phone" && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: "large",
                                prefix: (
                                    <MobileOutlined className={ss.mobile} />
                                ),
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
                                if (timing) {
                                    return `${count} ${"获取验证码"}`;
                                }
                                return "获取验证码";
                            }}
                            name="captcha"
                            rules={[
                                { required: true, message: "请输入验证码！" },
                            ]}
                            onGetCaptcha={async () => {
                                message.success(
                                    "获取验证码成功！验证码为：1234",
                                );
                            }}
                        />
                    </>
                )}
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
