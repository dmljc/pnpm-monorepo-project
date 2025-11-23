import { FC, useEffect, useState, useCallback } from "react";
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

const { TextArea } = Input;
const { Item } = Form;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const CreateRoleModal: FC<ModalProps> = (props: ModalProps) => {
    const { modalType, open, record, handleClose, handleOk } = props;
    const { t } = useTranslation();
    const [form] = Form.useForm<UpdateRole>();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedMenuKeys, setSelectedMenuKeys] = useState<React.Key[]>([]);

    const [messageApi, contextHolder] = message.useMessage();

    const onOk = async () => {
        await form.validateFields();
        const values = form.getFieldsValue();

        // permission字段现在已经是字符串，不需要再转换
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
                        ? t("role:messages.createSuccess")
                        : t("role:messages.updateSuccess"),
                );
                handleOk(record?.id);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setConfirmLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            if (modalType === ModalTypeEnum.UPDATE) {
                form.setFieldsValue({ ...record });
                // 将权限字符串转换为数组
                if (
                    record.permission &&
                    typeof record.permission === "string"
                ) {
                    const permissionArray = record.permission
                        .split(",")
                        .map(Number);
                    setSelectedMenuKeys(permissionArray);
                } else {
                    setSelectedMenuKeys([]);
                }
            } else {
                form.resetFields();
                setSelectedMenuKeys([]);
            }
        }
    }, [open, modalType, record]); // 移除form依赖，避免循环

    const onChangeStatus = (e: any) => {
        console.log(e.target.value);
    };

    const onChangeMenu = useCallback(
        (selectedRowKeys: React.Key[]) => {
            // 避免频繁调用，只在值真正改变时更新
            if (
                JSON.stringify(selectedRowKeys) !==
                JSON.stringify(selectedMenuKeys)
            ) {
                setSelectedMenuKeys(selectedRowKeys);
                // 将选中的键转换为字符串并设置为表单值
                form.setFieldValue("permission", selectedRowKeys.join(","));
            }
        },
        [selectedMenuKeys],
    );

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
                size="large"
                style={{ width: "70%" }}
                onClose={handleClose}
                placement="right"
                extra={
                    <Space>
                        <Button onClick={handleClose}>
                            {t("role:modal.buttons.cancel")}
                        </Button>
                        <Button
                            type="primary"
                            onClick={onOk}
                            disabled={confirmLoading}
                        >
                            {confirmLoading
                                ? t("common:loading", { defaultValue: "..." })
                                : t("role:modal.buttons.confirm")}
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
                                label={t("role:form.status.label")}
                                name="status"
                                rules={[
                                    {
                                        required: true,
                                        message: t("role:form.status.label"),
                                    },
                                ]}
                            >
                                <Radio.Group onChange={onChangeStatus}>
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
