import { useEffect, useState } from "react";
import {
    Form,
    Input,
    Radio,
    message,
    Drawer,
    Row,
    Col,
    Button,
    Space,
} from "antd";
import { useTranslation } from "react-i18next";
import { IconComponent, TreeTable } from "@/components/index.tsx";
import { ModalProps, UpdateRole } from "./interface";
import { ModalTypeEnum } from "@/utils";
import { create, update } from "./api";
import { formatStringToNumberArray } from "./utils";

const { TextArea } = Input;
const { Item } = Form;

// Form 级别的布局配置（用于非 Row/Col 嵌套的 Item）
const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

// Row/Col 中 Item 的布局配置
const rowItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const CreateRoleModal = (props: ModalProps) => {
    const { modalType, open, record, handleClose, handleOk } = props;
    const { t } = useTranslation();
    const [form] = Form.useForm<UpdateRole>();
    const [selectedMenuKeys, setSelectedMenuKeys] = useState<React.Key[]>([]);
    const [isPending, setIsPending] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const onOk = async () => {
        try {
            setIsPending(true);
            await form.validateFields();
            const values = form.getFieldsValue();

            const params =
                modalType === ModalTypeEnum.CREATE
                    ? values
                    : { ...values, id: record.id };

            const apiUrl = modalType === ModalTypeEnum.CREATE ? create : update;
            const resp = await apiUrl(params);
            if (resp.success === true) {
                messageApi.success(
                    modalType === ModalTypeEnum.CREATE
                        ? t("role:messages.createSuccess")
                        : t("role:messages.updateSuccess"),
                );
                handleOk(record?.id);
            }
        } finally {
            setIsPending(false);
        }
    };

    useEffect(() => {
        if (open) {
            if (modalType === ModalTypeEnum.UPDATE && record) {
                form.setFieldsValue({ ...record });
                setSelectedMenuKeys(
                    record?.permission
                        ? formatStringToNumberArray(record.permission)
                        : [],
                );
            } else {
                form.resetFields();
                setSelectedMenuKeys([]);
            }
        }
    }, [open, modalType, record, form]);

    const onChangeMenu = (selectedRowKeys: React.Key[]) => {
        setSelectedMenuKeys(selectedRowKeys);
        form.setFieldValue("permission", selectedRowKeys.join(","));
    };

    return (
        <>
            {contextHolder}
            <Drawer
                title={
                    modalType === ModalTypeEnum.CREATE
                        ? t("role:modal.title.create")
                        : t("role:modal.title.edit")
                }
                open={open}
                onClose={handleClose}
                placement="right"
                styles={{ wrapper: { width: "70%" } }}
                extra={
                    <Space>
                        <Button onClick={handleClose}>
                            {t("role:modal.buttons.cancel")}
                        </Button>
                        <Button
                            type="primary"
                            onClick={onOk}
                            disabled={isPending}
                            loading={isPending}
                        >
                            {t("role:modal.buttons.confirm")}
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    name="createRoleForm"
                    {...layout}
                    initialValues={{
                        status: 1,
                    }}
                >
                    <Row>
                        <Col span={12}>
                            <Item
                                {...rowItemLayout}
                                label={t("role:form.name.label")}
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: t("role:form.name.required"),
                                    },
                                ]}
                            >
                                <Input
                                    showCount
                                    allowClear
                                    maxLength={10}
                                    placeholder={t(
                                        "role:form.name.placeholder",
                                    )}
                                />
                            </Item>
                        </Col>

                        <Col span={12}>
                            <Item
                                {...rowItemLayout}
                                label={t("role:form.icon.label")}
                                name="icon"
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "role:form.icon.placeholder",
                                        ),
                                    },
                                ]}
                            >
                                <IconComponent />
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Item
                                {...rowItemLayout}
                                label={t("role:form.code.label")}
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: t("role:form.code.required"),
                                    },
                                ]}
                            >
                                <Input
                                    showCount
                                    allowClear
                                    maxLength={10}
                                    placeholder={t(
                                        "role:form.code.placeholder",
                                    )}
                                />
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item
                                {...rowItemLayout}
                                label={t("role:form.status.label")}
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: t("role:form.status.label"),
                                    },
                                ]}
                            >
                                <Radio.Group>
                                    <Radio value={1}>
                                        {t("role:form.status.enabled")}
                                    </Radio>
                                    <Radio value={0}>
                                        {t("role:form.status.disabled")}
                                    </Radio>
                                </Radio.Group>
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Item
                                {...rowItemLayout}
                                label={t("role:form.remark.label")}
                                name="remark"
                                rules={[
                                    {
                                        required: false,
                                        message: t(
                                            "role:form.remark.placeholder",
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
                                        "role:form.remark.placeholder",
                                    )}
                                />
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Item
                                labelCol={{ span: 2 }}
                                wrapperCol={{ span: 22 }}
                                label={t("role:form.permission.label")}
                                name="permission"
                                rules={[
                                    {
                                        required: true,
                                        message: t(
                                            "role:form.permission.placeholder",
                                        ),
                                    },
                                ]}
                            >
                                <TreeTable
                                    selecteable={true}
                                    selectedRowKeys={selectedMenuKeys}
                                    onChange={onChangeMenu}
                                />
                            </Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};

export default CreateRoleModal;
