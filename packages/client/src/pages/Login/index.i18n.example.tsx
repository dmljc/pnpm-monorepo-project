// 这是一个示例文件，展示如何在Login页面中使用i18n翻译
// 实际使用时，请将翻译键值对应用到Login/index.tsx中

import { useTranslation } from "react-i18next";

// 示例：如何在Login组件中使用翻译
const LoginExample = () => {
    const { t } = useTranslation("login"); // 使用login命名空间

    // 使用翻译的示例
    const LOGIN_TABS = [
        {
            key: "account",
            label: t("tabs.account"), // "账号密码登录" / "Account Login"
        },
        {
            key: "email", 
            label: t("tabs.email"), // "邮箱登录" / "Email Login"
        },
    ];

    // 表单验证消息
    const validationMessages = {
        username: {
            required: t("form.username.required"), // "请输入用户名!" / "Please enter username!"
        },
        password: {
            required: t("form.password.required"), // "请输入密码！" / "Please enter password!"
        },
        email: {
            required: t("form.email.required"), // "请输入邮箱！" / "Please enter email!"
            invalid: t("form.email.invalid"), // "请输入正确的邮箱格式！" / "Please enter a valid email format!"
        },
        captcha: {
            required: t("form.captcha.required"), // "请输入验证码！" / "Please enter verification code!"
            invalid: t("form.captcha.invalid"), // "验证码必须是6位数字" / "Verification code must be 6 digits"
        }
    };

    // 占位符文本
    const placeholders = {
        username: t("form.username.placeholder"), // "用户名: zfcstring"
        password: t("form.password.placeholder"), // "密码: 999999"
        email: t("form.email.placeholder"), // "邮箱"
        captcha: t("form.captcha.placeholder"), // "请输入验证码"
    };

    // 按钮文本
    const buttonTexts = {
        autoLogin: t("form.autoLogin"), // "自动登录" / "Auto Login"
        forgetPassword: t("form.forgetPassword"), // "忘记密码" / "Forgot Password"
        getCaptcha: t("form.captcha.getCode"), // "获取验证码" / "Get Code"
    };

    // 消息提示
    const messages = {
        loginFailed: t("messages.loginFailed"), // "登录失败" / "Login failed"
        githubLoginFailed: t("messages.githubLoginFailed"), // "Github 登录失败" / "Github login failed"
        googleLoginFailed: t("messages.googleLoginFailed"), // "Google 登录失败" / "Google login failed"
    };

    // 带参数的翻译示例
    const sendCaptchaMessage = (code: string) => {
        return t("messages.captchaSent", { code }); // "您的验证码是：123456，有效期为 5 分钟"
    };

    // 倒计时文本
    const getCountdownText = (count: number) => {
        return t("form.captcha.countdown", { count }); // "5 获取验证码" / "5 Get Code"
    };

    return null; // 这只是示例，不返回实际内容
};

export default LoginExample;
