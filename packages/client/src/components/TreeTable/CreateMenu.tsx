import { FC, useEffect, useState } from "react";
import { Form, Input, Radio, message, Modal, TreeSelect } from "antd";
import { ModalProps, UpdateMenu } from "./interface";
import { ModalTypeEnum } from "@/utils";
import { create, update } from "./api";
import { typeOptions, typeMap } from "./constant";
import { IconComponent } from "@/components";
import { useMenuStore } from "@/store";

const { Item } = Form;

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
};

const CreateMenu: FC<ModalProps> = (props: ModalProps) => {
    const { modalType, open, record, handleClose } = props;
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
                        ? "新增成功"
                        : "修改成功",
                );
                menuStore.getMenuList();
                handleClose();
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
                form.setFieldsValue({
                    ...record,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, modalType, record]); // 添加record依赖，移除form依赖

    function onFinish(values: UpdateMenu): void {
        console.log(values);
    }

    return (
        <>
            {contextHolder}
            <Modal
                title={
                    modalType === ModalTypeEnum.CREATE ? "新增菜单" : "编辑菜单"
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
                    name="createMenu"
                    initialValues={{
                        type: "catalog",
                    }}
                    onFinish={onFinish}
                >
                    <Item
                        name="type"
                        label="菜单类型"
                        rules={[
                            {
                                required: true,
                                message: "请选择菜单类型",
                            },
                        ]}
                    >
                        <Radio.Group
                            optionType="button"
                            buttonStyle="solid"
                            onChange={onChangeMenuType}
                        >
                            {typeOptions.map((item) => (
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
                        label={`${typeMap[type as keyof typeof typeMap]}名称`}
                        rules={[
                            {
                                required: true,
                                message: "请输入菜单名称",
                            },
                        ]}
                    >
                        <Input
                            allowClear
                            maxLength={8}
                            placeholder="请输入菜单名称"
                        />
                    </Item>
                    <Item
                        name="icon"
                        label="菜单图标"
                        rules={[
                            {
                                required: true,
                                message: "请选择菜单图标",
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
                            label="上级菜单"
                            rules={[
                                {
                                    required: true,
                                    message: "请选择上级菜单",
                                },
                            ]}
                        >
                            <TreeSelect
                                showSearch
                                allowClear
                                treeData={menuStore.menuList}
                                fieldNames={{
                                    value: "id",
                                }}
                                treeDefaultExpandAll
                                treeNodeFilterProp="name"
                                placeholder="请选择上级菜单"
                            />
                        </Item>
                    )}
                    {type === "button" && (
                        <Item
                            name="code"
                            label="权限字符"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入权限字符",
                                },
                            ]}
                        >
                            <Input
                                allowClear
                                maxLength={30}
                                placeholder="请输入权限字符"
                            />
                        </Item>
                    )}
                    {["catalog", "menu"].includes(type) && (
                        <Item
                            name="path"
                            label="路由地址"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入路由地址",
                                },
                            ]}
                        >
                            <Input
                                allowClear
                                maxLength={30}
                                placeholder="请输入路由地址"
                            />
                        </Item>
                    )}
                    {type === "menu" && (
                        <Item
                            name="component"
                            label="页面组件"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入页面组件",
                                },
                            ]}
                        >
                            <Input
                                allowClear
                                maxLength={30}
                                placeholder="请输入页面组件"
                            />
                        </Item>
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default CreateMenu;
