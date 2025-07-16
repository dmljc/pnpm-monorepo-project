import { FC, useState } from "react";
import { Form, Upload, Input, Space, Button } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import ImgCrop from "antd-img-crop";
import useStyles from "./style";

const { Item } = Form;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8 },
};
const tailLayout = {
    wrapperCol: { span: 16 },
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const Config: FC = () => {
    const [form] = Form.useForm<any>();
    const { styles: ss } = useStyles();

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

    return (
        <Form
            form={form}
            layout="vertical"
            {...layout}
            name="systemConfig"
            className={ss.root}
        >
            <Item
                label="系统图标"
                name="logo"
                extra="用于登录页和导航栏的网站图标，建议使用 .svg 格式"
                rules={[{ required: true, message: "请上传网站图标" }]}
            >
                <ImgCrop rotationSlider>
                    <Upload
                        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
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
                    maxLength={10}
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
                    maxLength={10}
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
                    maxLength={10}
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
                    maxLength={20}
                    placeholder="请输入备案号"
                />
            </Item>
            <Form.Item {...tailLayout}>
                <Space>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                    <Button htmlType="button">重置</Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default Config;
