import { FC, useEffect } from "react";
import { Form, Input, message, Modal, Radio } from "antd";
// import { Coverupload } from "../../components/index";
import { ModalProps, UpdateUser } from "./interface";
import { ModalTypeEnum } from "@/utils";
import { create, update } from "./api";

const { TextArea } = Input;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};

const CreateModal: FC<ModalProps> = (props: ModalProps) => {
    const { modalType, isOpen, record, handleClose } = props;
    const [form] = Form.useForm<UpdateUser>();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = async () => {
        await form.validateFields();
        const values = form.getFieldsValue();
        const params =
            modalType === ModalTypeEnum.CREATE
                ? values
                : { ...values, id: record.id };

        try {
            const apiUrl = modalType === ModalTypeEnum.CREATE ? create : update;
            const resp = await apiUrl(params);
            if (resp.success === true) {
                handleClose();
                messageApi.success(
                    modalType === ModalTypeEnum.CREATE
                        ? "新增成功"
                        : "修改成功",
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (modalType === ModalTypeEnum.UPDATE) {
            form.setFieldsValue({
                ...record,
            });
        } else {
            form.resetFields();
        }
    }, [isOpen, modalType]);

    return (
        <>
            {contextHolder}
            <Modal
                title={
                    modalType === ModalTypeEnum.CREATE ? "新增用户" : "修改用户"
                }
                open={isOpen}
                width={600}
                onOk={handleOk}
                forceRender
                onCancel={() => handleClose()}
            >
                <Form
                    form={form}
                    {...layout}
                    initialValues={{
                        sex: 1,
                    }}
                >
                    <Form.Item
                        label="账号"
                        name="username"
                        rules={[{ required: true, message: "请输入账号" }]}
                    >
                        <Input placeholder="请输入账号" />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: "请输入密码" }]}
                    >
                        <Input placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: "请输入姓名" }]}
                    >
                        <Input placeholder="请输入姓名" />
                    </Form.Item>
                    <Form.Item
                        label="性别"
                        name="sex"
                        rules={[{ required: true, message: "请选择性别" }]}
                    >
                        <Radio.Group>
                            <Radio value={1}>男</Radio>
                            <Radio value={2}>女</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                            { required: true, message: "请输入手机号" },
                            {
                                pattern: /^1\d{10}$/,
                                message: "手机号格式异常",
                            },
                        ]}
                    >
                        <Input placeholder="请输入手机号" />
                    </Form.Item>
                    <Form.Item
                        label="备注"
                        name="remark"
                        rules={[{ required: false, message: "请输入备注" }]}
                    >
                        <TextArea
                            autoSize={{ minRows: 4, maxRows: 6 }}
                            placeholder="请输入备注"
                        />
                    </Form.Item>
                    {/* <Form.Item
                        label="头像"
                        name="avatar"
                        rules={[{ required: false, message: "请上传头像!" }]}
                    >
                        <Coverupload />
                    </Form.Item> */}
                </Form>
            </Modal>
        </>
    );
};

export default CreateModal;
