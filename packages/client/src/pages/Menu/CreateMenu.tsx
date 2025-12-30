import { FC, useEffect, useMemo, useState } from "react";
import { Form, Input, Radio, message, Modal, TreeSelect } from "antd";
import type { TreeSelectProps } from "antd";
import { useTranslation } from "react-i18next";
import { ModalProps, UpdateMenu } from "./interface";
import { ModalTypeEnum } from "@/utils";
import { create, update } from "./api";
import { getTypeOptions } from "./constant";
import { IconComponent } from "@/components";
import { useMenuStore } from "@/store/menuStore";

const { Item } = Form;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
};

const CreateMenu: FC<ModalProps> = (props: ModalProps) => {
    const { modalType, open, record, handleClose } = props;
    const { t } = useTranslation();
    const menuStore = useMenuStore();
    const [form] = Form.useForm<UpdateMenu>();
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    // 监听type字段
    const type = Form.useWatch("type", form);
    // 监听icon字段
    const icon = Form.useWatch("icon", form);

    const onChangeMenuType = () => {
        Object.keys(form.getFieldsValue()).forEach((key) => {
            if (key !== "type") {
                form.setFieldsValue({ [key]: undefined });
            }
        });
    };

    const onOk = async () => {
        try {
            setConfirmLoading(true);
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
                        ? t("menu:messages.createSuccess")
                        : t("menu:messages.updateSuccess"),
                );
                menuStore.getMenuMeList();
                handleClose();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setConfirmLoading(false);
        }
    };

    // 将菜单列表转换为树形结构
    const normalizedMenuTreeData = useMemo<TreeSelectProps["treeData"]>(() => {
        const normalize = (list: any[]): any[] =>
            (list || []).map((node: any) => {
                const children = Array.isArray(node?.children)
                    ? normalize(node.children)
                    : undefined;
                return {
                    key: node.id,
                    value: node.id,
                    title: node.label,
                    children,
                };
            });
        return normalize(menuStore.menuMeList as any);
    }, [menuStore.menuMeList]);

    // 监听open变化
    useEffect(() => {
        if (open) {
            if (modalType === ModalTypeEnum.UPDATE) {
                form.setFieldsValue({
                    ...record,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, modalType, record]);

    function onFinish(values: UpdateMenu): void {
        console.log(values);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title={
                    modalType === ModalTypeEnum.CREATE
                        ? t("menu:table.actions.add")
                        : t("menu:table.actions.edit")
                }
                open={open}
                onOk={onOk}
                forceRender
                onCancel={handleClose}
                confirmLoading={confirmLoading}
            >
                <Form
                    {...layout}
                    form={form}
                    initialValues={{
                        type: "catalog",
                    }}
                    onFinish={onFinish}
                >
                    <Item
                        name="type"
                        label={t("menu:form.type.label")}
                        rules={[
                            {
                                required: true,
                                message: t("menu:form.type.required"),
                            },
                        ]}
                    >
                        <Radio.Group
                            optionType="button"
                            buttonStyle="solid"
                            onChange={onChangeMenuType}
                        >
                            {getTypeOptions(t).map((item) => (
                                <Radio.Button
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.icon} {item.label}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </Item>
                    {/* 下面根据type动态渲染 */}
                    <Item
                        name="label"
                        label={t("menu:form.name.label")}
                        rules={[
                            {
                                required: true,
                                message: t("menu:form.name.required"),
                            },
                        ]}
                    >
                        <Input
                            allowClear
                            maxLength={8}
                            placeholder={t("menu:form.name.placeholder")}
                        />
                    </Item>
                    <Item
                        name="icon"
                        label={t("menu:form.icon.label")}
                        rules={[
                            {
                                required: true,
                                message: t("menu:form.icon.placeholder"),
                            },
                        ]}
                    >
                        <IconComponent
                            value={icon as string}
                            onChange={(value) => {
                                form.setFieldsValue({ icon: value });
                            }}
                            style={{ width: "100%" }}
                        />
                    </Item>

                    {["menu", "button"].includes(type) && (
                        <Item
                            name="parentId"
                            label={t("menu:form.parent.label")}
                            rules={[
                                {
                                    required: true,
                                    message: t("menu:form.parent.required"),
                                },
                            ]}
                        >
                            <TreeSelect
                                showSearch
                                allowClear
                                treeData={normalizedMenuTreeData}
                                treeDataSimpleMode={false}
                                treeDefaultExpandAll
                                treeNodeFilterProp="label"
                                placeholder={t("menu:form.parent.placeholder")}
                            />
                        </Item>
                    )}
                    {type === "button" && (
                        <Item
                            name="code"
                            label={t("menu:form.code.label")}
                            rules={[
                                {
                                    required: true,
                                    message: t("menu:form.code.required"),
                                },
                            ]}
                        >
                            <Input
                                allowClear
                                maxLength={30}
                                placeholder={t("menu:form.code.placeholder")}
                            />
                        </Item>
                    )}
                    {["catalog", "menu"].includes(type) && (
                        <Item
                            name="path"
                            label={t("menu:form.path.label")}
                            rules={[
                                {
                                    required: true,
                                    message: t("menu:form.path.required"),
                                },
                            ]}
                        >
                            <Input
                                allowClear
                                maxLength={30}
                                placeholder={t("menu:form.path.placeholder")}
                            />
                        </Item>
                    )}
                    {type === "menu" && (
                        <Item
                            name="component"
                            label={t("menu:form.component.label")}
                            rules={[
                                {
                                    required: true,
                                    message: t("menu:form.component.required"),
                                },
                            ]}
                        >
                            <Input
                                allowClear
                                maxLength={30}
                                placeholder={t(
                                    "menu:form.component.placeholder",
                                )}
                            />
                        </Item>
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default CreateMenu;
