import { FC, useEffect, useState } from "react";
import { Form, Upload, Input, Button, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import { create } from "./api";
import { useSystemStore } from "@/store/systemStore";
import useStyles from "./style";

const { Item } = Form;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const Config: FC = () => {
    const [form] = Form.useForm<any>();
    const { styles: ss } = useStyles();
    const [messageApi, contextHolder] = message.useMessage();
    const { systemConfig, setSystemConfig } = useSystemStore();

    const [fileList, setFileList] = useState<UploadFile[]>([
        {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        },
    ]);

    const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onPreview = async (file: UploadFile) => {
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

    useEffect(() => {
        form.setFieldsValue(systemConfig);
    }, [systemConfig]);

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
                messageApi.success("保存成功");
            }
        } catch (error) {
            console.error("表单验证失败:", error);
        }
    };

    const handleReset = () => {
        form.resetFields();
    };

    return (
        <>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                name="systemConfig"
                className={ss.root}
            >
                <Item
                    label="系统图标"
                    name="logo"
                    extra="用于登录页和导航栏的网站图标，建议使用 .svg 格式"
                    rules={[{ required: false, message: "请上传网站图标" }]}
                >
                    <ImgCrop rotationSlider>
                        <Upload
                            action="ttp://localhost:3000/api/minio/upload"
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                        >
                            {fileList.length < 1 && "+ Upload"}
                        </Upload>
                    </ImgCrop>
                </Item>
                <Item
                    label="系统名称"
                    name="name"
                    extra="显示在浏览器标题栏和登录界面的系统名称"
                    rules={[{ required: true, message: "请输入网站名称" }]}
                >
                    <Input
                        showCount
                        allowClear
                        maxLength={20}
                        placeholder="请输入系统名称"
                    />
                </Item>
                <Item
                    label="系统描述"
                    name="description"
                    extra="用于 SEO 的网站元描述"
                    rules={[{ required: true, message: "请输入网站描述" }]}
                >
                    <Input
                        showCount
                        allowClear
                        maxLength={30}
                        placeholder="请输入系统描述"
                    />
                </Item>
                <Item
                    label="版权说明"
                    name="copyright"
                    extra="显示在页面底部的版权声明文本"
                    rules={[{ required: true, message: "请输入版权说明" }]}
                >
                    <Input
                        showCount
                        allowClear
                        maxLength={60}
                        placeholder="请输入版权说明"
                    />
                </Item>
                <Item
                    label="ICP 备案号"
                    name="icp"
                    extra="工信部 ICP 备案编号（如：京ICP备12345678号）"
                    rules={[{ required: true, message: "请输入备案号" }]}
                >
                    <Input
                        showCount
                        allowClear
                        maxLength={30}
                        placeholder="请输入备案号"
                    />
                </Item>
                <Item>
                    <Button type="primary" onClick={handleSubmit}>
                        保存
                    </Button>
                    <Button htmlType="button" onClick={handleReset}>
                        重置
                    </Button>
                </Item>
            </Form>
        </>
    );
};

export default Config;
