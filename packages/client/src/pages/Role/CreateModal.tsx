import { useEffect } from "react";
import { Form, Input, message, Modal } from "antd";
import { ModalProps, UpdateRole } from "./interface";
import { ModalTypeEnum } from "@/utils";
import { create, update } from "./api";

const { TextArea } = Input;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};

const CreateModal = (props: ModalProps) => {
    const { modalType, isOpen, record, handleClose } = props;
    const [form] = Form.useForm<UpdateRole>();
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
                    modalType === ModalTypeEnum.CREATE ? "新增角色" : "修改角色"
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
                        label="角色姓名"
                        name="name"
                        rules={[{ required: true, message: "请输入角色姓名" }]}
                    >
                        <Input placeholder="请输入角色姓名" />
                    </Form.Item>
                    <Form.Item
                        label="角色编码"
                        name="code"
                        rules={[{ required: true, message: "请输入角色编码" }]}
                    >
                        <Input placeholder="请输入角色编码" />
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
                </Form>
            </Modal>
        </>
    );
};

export default CreateModal;
