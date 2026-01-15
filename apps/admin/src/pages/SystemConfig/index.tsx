import { FC, useEffect, useState } from "react";
import { Form, Upload, Input, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { useTranslation } from "react-i18next";
import { AuthButton } from "@/components";
import useStyles from "./style";
import { useSystemStore } from "@/store/systemStore";
import { create } from "./api";
import { usePermission } from "@/utils/utils";

const { Item } = Form;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const Config: FC = () => {
    const { t } = useTranslation();
    // ==================== 状态管理 ====================
    const [form] = Form.useForm<any>();
    const { styles: ss } = useStyles();
    const [messageApi, contextHolder] = message.useMessage();
    const { systemConfig, setSystemConfig } = useSystemStore();

    const permission = usePermission("system_config:save");

    // 文件上传相关状态
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
    ]);

    // ==================== 副作用钩子 ====================
    useEffect(() => {
        form.setFieldsValue(systemConfig);
    }, [systemConfig]);

    // ==================== 事件处理函数 ====================
    const handleFileChange: UploadProps["onChange"] = ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
    };

    const handleFilePreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as FileType);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const handleSubmit = async () => {
        try {
            // 验证表单字段
            const values = await form.validateFields();

            // 处理logo字段 - 从fileList中获取URL
            const logoUrl = fileList[0]?.url || fileList[0]?.response?.url;
            const submitData = {
                ...values,
                logo: logoUrl,
            };

            const res = await create(submitData);

            if (res.success) {
                setSystemConfig(res.data);
                messageApi.success(t("systemConfig:messages.saveSuccess"));
            }
        } catch (error) {
            console.error("表单验证失败:", error);
        }
    };

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                name="systemConfig"
                className={ss.root}
            >
                <Item
                    label={t("systemConfig:form.logo.label")}
                    name="logo"
                    extra={t("systemConfig:form.logo.extra")}
                    rules={[
                        {
                            required: false,
                            message: t("systemConfig:form.logo.required"),
                        },
                    ]}
                >
                    <ImgCrop rotationSlider>
                        <Upload
                            action="ttp://localhost:3000/api/minio/upload"
                            listType="picture-card"
                            disabled={!permission}
                            fileList={fileList}
                            onChange={handleFileChange}
                            onPreview={handleFilePreview}
                        >
                            {fileList.length < 1 &&
                                t("systemConfig:form.logo.upload")}
                        </Upload>
                    </ImgCrop>
                </Item>
                <Item
                    label={t("systemConfig:form.name.label")}
                    name="name"
                    extra={t("systemConfig:form.name.extra")}
                    rules={[
                        {
                            required: true,
                            message: t("systemConfig:form.name.required"),
                        },
                    ]}
                >
                    <Input
                        showCount
                        allowClear
                        maxLength={20}
                        disabled={!permission}
                        placeholder={t("systemConfig:form.name.placeholder")}
                    />
                </Item>
                <Item
                    label={t("systemConfig:form.description.label")}
                    name="description"
                    extra={t("systemConfig:form.description.extra")}
                    rules={[
                        {
                            required: true,
                            message: t(
                                "systemConfig:form.description.required",
                            ),
                        },
                    ]}
                >
                    <Input
                        showCount
                        allowClear
                        maxLength={30}
                        disabled={!permission}
                        placeholder={t(
                            "systemConfig:form.description.placeholder",
                        )}
                    />
                </Item>
                <Item
                    label={t("systemConfig:form.copyright.label")}
                    name="copyright"
                    extra={t("systemConfig:form.copyright.extra")}
                    rules={[
                        {
                            required: true,
                            message: t("systemConfig:form.copyright.required"),
                        },
                    ]}
                >
                    <Input
                        showCount
                        allowClear
                        maxLength={60}
                        disabled={!permission}
                        placeholder={t(
                            "systemConfig:form.copyright.placeholder",
                        )}
                    />
                </Item>
                <Item
                    label={t("systemConfig:form.icp.label")}
                    name="icp"
                    extra={t("systemConfig:form.icp.extra")}
                    rules={[
                        {
                            required: true,
                            message: t("systemConfig:form.icp.required"),
                        },
                    ]}
                >
                    <Input
                        showCount
                        allowClear
                        maxLength={30}
                        disabled={!permission}
                        placeholder={t("systemConfig:form.icp.placeholder")}
                    />
                </Item>
                <Item>
                    <AuthButton
                        code="system_config:save"
                        key="system_config:save"
                        type="primary"
                        style={{ width: "100%" }}
                        disabled={!permission}
                        onClick={handleSubmit}
                    >
                        {t("systemConfig:buttons.save")}
                    </AuthButton>
                </Item>
            </Form>
            {contextHolder}
        </>
    );
};

export default Config;
