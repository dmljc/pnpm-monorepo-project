import { FC, useEffect, useState } from "react";
import { Form, Input, message, Modal, Radio, Select } from "antd";
import { OSSUpload } from "../../components/index";
import { ModalProps, UpdateUser } from "./interface";
import { ModalTypeEnum } from "@/utils";
import { create, update } from "./api";
import { list } from "../Role/api";

const { Item } = Form;
const { TextArea } = Input;
// const { Group } = Radio;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};

const defaultAvatar =
    "https://img0.baidu.com/it/u=3170389506,3533872302&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500";

const CreateModal: FC<ModalProps> = (props: ModalProps) => {
    const { modalType, open, record, handleClose, handleOk } = props;

    const [form] = Form.useForm<UpdateUser>();
    const [roleOptions, setRoleOptions] = useState([]);
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
    }, [modalType]);

    useEffect(() => {
        open && onFetchRoleOptions();
    }, [open]);

    const onFetchRoleOptions = async () => {
        try {
            const resp = await list({
                current: 1,
                pageSize: 100,
            });
            // 强制更新状态
            setRoleOptions(resp?.data || []);
        } catch (error) {
            console.error("获取角色列表失败:", error);
            setRoleOptions([]);
        }
    };

    const onChangeStatus = (e: any) => {
        console.log(e.target.value);
    };

    const onAvatarUploadSuccess = (url: string) => {
        form.setFieldsValue({
            avatar: url,
        });
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={
                    modalType === ModalTypeEnum.CREATE ? "新增用户" : "修改用户"
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
                    name="create-user"
                    {...layout}
                    initialValues={{
                        status: 1,
                        avatar: defaultAvatar,
                    }}
                >
                    <Item
                        label="角色"
                        name="role"
                        rules={[{ required: true, message: "请选择角色" }]}
                    >
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            fieldNames={{ label: "name", value: "code" }}
                            options={roleOptions}
                            placeholder="请选择角色"
                        />
                    </Item>

                    <Item
                        label="账号"
                        name="username"
                        rules={[{ required: true, message: "请输入账号" }]}
                    >
                        <Input
                            showCount
                            allowClear
                            maxLength={10}
                            placeholder="请输入账号"
                        />
                    </Item>
                    <Item
                        label="密码"
                        name="password"
                        rules={[
                            { required: true, message: "请输入密码" },
                            { min: 6, message: "密码长度不能少于6位" },
                            { max: 10, message: "密码长度不能超过10位" },
                        ]}
                    >
                        <Input
                            showCount
                            allowClear
                            minLength={6}
                            maxLength={10}
                            placeholder="请输入密码"
                        />
                    </Item>
                    <Item
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: "请输入姓名" }]}
                    >
                        <Input
                            showCount
                            allowClear
                            maxLength={10}
                            placeholder="请输入姓名"
                        />
                    </Item>
                    <Item
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
                        <Input
                            showCount
                            allowClear
                            maxLength={11}
                            placeholder="请输入手机号"
                        />
                    </Item>
                    <Item
                        label="邮箱"
                        name="email"
                        rules={[{ required: true, message: "请输入邮箱" }]}
                    >
                        <Input allowClear placeholder="请输入邮箱" />
                    </Item>
                    <Item
                        label="状态"
                        name="status"
                        rules={[{ required: true, message: "请选择用户状态" }]}
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
                    <Item
                        label="头像"
                        name="avatar"
                        rules={[{ required: false, message: "请上传头像!" }]}
                    >
                        <OSSUpload
                            value={record?.avatar}
                            onSuccess={onAvatarUploadSuccess}
                        />
                    </Item>
                </Form>
            </Modal>
        </>
    );
};

export default CreateModal;
