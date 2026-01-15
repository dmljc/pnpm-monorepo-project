import { FC, useEffect, useTransition, useState } from "react";
import { Form, Input, message, Modal, Radio, Select } from "antd";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();

    const [form] = Form.useForm<UpdateUser>();
    const [messageApi, contextHolder] = message.useMessage();

    // React 19: 使用 useTransition 优化并发渲染和表单提交
    const [isPending, startTransition] = useTransition();

    // 角色列表状态
    const [roleOptions, setRoleOptions] = useState<any[]>([]);
    const [roleLoading, setRoleLoading] = useState(false);

    // 获取角色列表
    const fetchRoleList = async () => {
        setRoleLoading(true);
        try {
            const resp = await list({ current: 1, pageSize: 100 });
            const options = Array.isArray(resp?.data)
                ? resp.data
                : resp?.data?.data || [];
            setRoleOptions(options);
        } finally {
            // API 错误由拦截器统一处理，这里只需要确保 loading 状态重置
            setRoleLoading(false);
        }
    };

    // 只在 Modal 打开时获取一次
    useEffect(() => {
        if (open && roleOptions.length === 0) {
            fetchRoleList();
        }
    }, [open]);

    const onOk = async () => {
        await form.validateFields();
        const values = form.getFieldsValue();
        const params =
            modalType === ModalTypeEnum.CREATE
                ? values
                : { ...values, id: record.id };

        // React 19: 在 startTransition 包装异步操作，确保流畅的 UI 过渡
        startTransition(async () => {
            const apiUrl = modalType === ModalTypeEnum.CREATE ? create : update;
            const resp = await apiUrl(params);
            if (resp.success === true) {
                messageApi.success(
                    modalType === ModalTypeEnum.CREATE
                        ? t("user:messages.createSuccess")
                        : t("user:messages.updateSuccess"),
                );

                handleOk();
            }
        });
    };

    useEffect(() => {
        if (open) {
            if (modalType === ModalTypeEnum.UPDATE && record) {
                form.setFieldsValue({
                    ...record,
                });
            } else {
                form.resetFields();
            }
        }
    }, [modalType, record, open]);

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
                    modalType === ModalTypeEnum.CREATE
                        ? t("user:modal.title.create")
                        : t("user:modal.title.edit")
                }
                open={open}
                width={600}
                onOk={onOk}
                forceRender
                onCancel={handleClose}
                confirmLoading={isPending}
            >
                <Form
                    form={form}
                    name="createUser"
                    {...layout}
                    initialValues={{
                        status: 1,
                        avatar: defaultAvatar,
                    }}
                >
                    <Item
                        label={t("user:modal.form.role.label")}
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: t("user:modal.form.role.required"),
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            loading={roleLoading}
                            optionFilterProp="label"
                            fieldNames={{ label: "name", value: "code" }}
                            options={roleOptions}
                            placeholder={t("user:modal.form.role.placeholder")}
                        />
                    </Item>

                    <Item
                        label={t("user:modal.form.username.label")}
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: t("user:modal.form.username.required"),
                            },
                        ]}
                    >
                        <Input
                            showCount
                            allowClear
                            maxLength={10}
                            placeholder={t(
                                "user:modal.form.username.placeholder",
                            )}
                        />
                    </Item>
                    <Item
                        label={t("user:modal.form.password.label")}
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: t("user:modal.form.password.required"),
                            },
                            {
                                min: 6,
                                message: t("user:modal.form.password.min"),
                            },
                            {
                                max: 10,
                                message: t("user:modal.form.password.max"),
                            },
                        ]}
                    >
                        <Input
                            showCount
                            allowClear
                            minLength={6}
                            maxLength={10}
                            placeholder={t(
                                "user:modal.form.password.placeholder",
                            )}
                        />
                    </Item>
                    <Item
                        label={t("user:modal.form.name.label")}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: t("user:modal.form.name.required"),
                            },
                        ]}
                    >
                        <Input
                            showCount
                            allowClear
                            maxLength={10}
                            placeholder={t("user:modal.form.name.placeholder")}
                        />
                    </Item>
                    <Item
                        label={t("user:modal.form.phone.label")}
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: t("user:modal.form.phone.required"),
                            },
                            {
                                pattern: /^1\d{10}$/,
                                message: t("user:modal.form.phone.invalid"),
                            },
                        ]}
                    >
                        <Input
                            showCount
                            allowClear
                            maxLength={11}
                            placeholder={t("user:modal.form.phone.placeholder")}
                        />
                    </Item>
                    <Item
                        label={t("user:modal.form.email.label")}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: t("user:modal.form.email.required"),
                            },
                        ]}
                    >
                        <Input
                            allowClear
                            placeholder={t("user:modal.form.email.placeholder")}
                        />
                    </Item>
                    <Item
                        label={t("user:modal.form.status.label")}
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: t("user:modal.form.status.required"),
                            },
                        ]}
                    >
                        <Radio.Group onChange={onChangeStatus}>
                            <Radio value={1}>
                                {t("user:modal.form.status.enabled")}
                            </Radio>
                            <Radio value={0}>
                                {t("user:modal.form.status.disabled")}
                            </Radio>
                        </Radio.Group>
                    </Item>
                    <Item
                        label={t("user:modal.form.remark.label")}
                        name="remark"
                        rules={[
                            {
                                required: false,
                                message: t(
                                    "user:modal.form.remark.placeholder",
                                ),
                            },
                        ]}
                    >
                        <TextArea
                            showCount
                            allowClear
                            maxLength={100}
                            autoSize={{ minRows: 4, maxRows: 6 }}
                            placeholder={t(
                                "user:modal.form.remark.placeholder",
                            )}
                        />
                    </Item>
                    <Item
                        label={t("user:modal.form.avatar.label")}
                        name="avatar"
                        rules={[
                            {
                                required: false,
                                message: t("user:modal.form.avatar.required"),
                            },
                        ]}
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
