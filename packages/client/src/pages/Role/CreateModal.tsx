import { FC, useEffect, useState } from "react";
import { Form, Input, Radio, message, Modal } from "antd";
import { ModalProps, UpdateRole } from "./interface";
import { ModalTypeEnum } from "@/utils";
import { create, update } from "./api";

const { TextArea } = Input;
const { Item } = Form;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};

const CreateModal: FC<ModalProps> = (props: ModalProps) => {
    const { modalType, open, record, handleClose, handleOk } = props;
    const [form] = Form.useForm<UpdateRole>();
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const onOk = async () => {
        await form.validateFields();
        const values = form.getFieldsValue();
        const params =
            modalType === ModalTypeEnum.CREATE
                ? values
                : { ...values, id: record.id };

        try {
            setConfirmLoading(true);
            const apiUrl = modalType === ModalTypeEnum.CREATE ? create : update;
            const resp = await apiUrl(params);
            if (resp.success === true) {
                messageApi.success(
                    modalType === ModalTypeEnum.CREATE
                        ? "新增成功"
                        : "修改成功",
                );
                handleOk();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setConfirmLoading(false);
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
    }, [open, modalType]);

    const onChangeStatus = (e: any) => {
        console.log(e.target.value);
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={
                    modalType === ModalTypeEnum.CREATE ? "新增角色" : "修改角色"
                }
                open={open}
                width={600}
                onOk={onOk}
                forceRender
                onCancel={handleClose}
                confirmLoading={confirmLoading}
            >
                <Form
                    form={form}
                    {...layout}
                    initialValues={{
                        status: 1,
                    }}
                >
                    <Item
                        label="名称"
                        name="name"
                        rules={[{ required: false, message: "请输入名称" }]}
                    >
                        <Input
                            showCount
                            allowClear
                            maxLength={10}
                            placeholder="请输入名称"
                        />
                    </Item>
                    <Item
                        label="编码"
                        name="code"
                        rules={[{ required: false, message: "请输入编码" }]}
                    >
                        <Input
                            showCount
                            allowClear
                            maxLength={10}
                            placeholder="请输入编码"
                        />
                    </Item>
                    <Item
                        label="状态"
                        name="status"
                        rules={[{ required: true, message: "请选择状态" }]}
                    >
                        <Radio.Group onChange={onChangeStatus}>
                            <Radio value={1}>启用</Radio>
                            <Radio value={0}>停用</Radio>
                        </Radio.Group>
                    </Item>
                    <Item
                        label="备注"
                        name="remark"
                        rules={[{ required: false, message: "请输入备注" }]}
                    >
                        <TextArea
                            showCount
                            allowClear
                            maxLength={100}
                            autoSize={{ minRows: 4, maxRows: 6 }}
                            placeholder="请输入备注"
                        />
                    </Item>
                </Form>
            </Modal>
        </>
    );
};

export default CreateModal;
