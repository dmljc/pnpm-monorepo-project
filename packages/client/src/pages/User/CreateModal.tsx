import { useEffect } from "react";
import { Form, Input, message, Modal } from "antd";
import { Coverupload } from "../../components/index";
import { ModalProps, UpdateBook } from "./interface";
import { create, update } from "./api";

const { TextArea } = Input;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const CreateModal = (props: ModalProps) => {
    const { modalType, isOpen, record, handleClose } = props;
    const [form] = Form.useForm<UpdateBook>();

    const handleOk = async () => {
        await form.validateFields();
        const values = form.getFieldsValue();
        const params =
            modalType === "create" ? values : { ...values, id: record.id };

        try {
            const apiUrl = modalType === "create" ? create : update;
            const resp = await apiUrl(params);
            if (resp.success === true) {
                message.success("操作成功");
                form.resetFields();
                handleClose();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (modalType === "update") {
            form.setFieldsValue({
                ...record,
            });
        } else {
            form.resetFields();
        }
    }, [modalType]);

    return (
        <Modal
            title={modalType === "create" ? "添加英雄" : "编辑英雄"}
            open={isOpen}
            onOk={handleOk}
            onCancel={() => handleClose()}
            okText={"创建"}
            forceRender
        >
            <Form form={form} {...layout}>
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[{ required: true, message: "请输入名称!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="字名"
                    name="word"
                    rules={[{ required: true, message: "请输入作者的字!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="介绍"
                    name="description"
                    rules={[{ required: true, message: "请输入介绍!" }]}
                >
                    <TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
                </Form.Item>
                <Form.Item
                    label="头像"
                    name="avatar"
                    rules={[{ required: false, message: "请上传头像!" }]}
                >
                    <Coverupload />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateModal;