import { FC, useEffect, useState } from "react";
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
                        ? "新增成功"
                        : "修改成功",
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
        if (modalType === ModalTypeEnum.UPDATE) {
            form.setFieldsValue({ ...record });
            // 将权限字符串转换为数组
            if (record.permission && typeof record.permission === 'string') {
                const permissionArray = record.permission.split(",").map(Number);
                setSelectedMenuKeys(permissionArray);
            }
        } else {
            form.resetFields();
            setSelectedMenuKeys([]);
        }
    }, [open, modalType, record, form]);

    const onChangeStatus = (e: any) => {
        console.log(e.target.value);
    };

    const onChangeMenu = (selectedRowKeys: React.Key[]) => {
        console.log(
            `props-onChangeMenu-selectedRowKeys---》: ${selectedRowKeys}`,
        );
        setSelectedMenuKeys(selectedRowKeys);
        // 将选中的键转换为字符串并设置为表单值
        form.setFieldValue("permission", selectedRowKeys.join(","));
    };

    return (
        <>
            {contextHolder}
            <Drawer
                title={
                    modalType === ModalTypeEnum.CREATE ? "新增角色" : "修改角色"
                }
                open={open}
                width="70%"
                onClose={handleClose}
                placement="right"
                extra={
                    <Space>
                        <Button onClick={handleClose}>取消</Button>
                        <Button
                            type="primary"
                            onClick={onOk}
                            disabled={confirmLoading}
                        >
                            {confirmLoading ? "提交中..." : "确定"}
                        </Button>
                    </Space>
                }
            >
                <Form
                    form={form}
                    name="createRole"
                    {...layout}
                    initialValues={{
                        status: 1,
                    }}
                >
                    <Row>
                        <Col span={12}>
                            <Item
                                label="名称"
                                name="name"
                                rules={[
                                    { required: true, message: "请输入名称" },
                                ]}
                            >
                                <Input
                                    showCount
                                    allowClear
                                    maxLength={10}
                                    placeholder="请输入名称"
                                />
                            </Item>
                        </Col>

                        <Col span={12}>
                            <Item
                                label="图标"
                                name="icon"
                                rules={[
                                    { required: true, message: "请选择图标" },
                                ]}
                            >
                                <IconComponent />
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Item
                                label="编码"
                                name="code"
                                rules={[
                                    { required: true, message: "请输入编码" },
                                ]}
                            >
                                <Input
                                    showCount
                                    allowClear
                                    maxLength={10}
                                    placeholder="请输入编码"
                                />
                            </Item>
                        </Col>
                        <Col span={12}>
                            <Item
                                label="状态"
                                name="status"
                                rules={[
                                    { required: true, message: "请选择状态" },
                                ]}
                            >
                                <Radio.Group onChange={onChangeStatus}>
                                    <Radio value={1}>启用</Radio>
                                    <Radio value={0}>停用</Radio>
                                </Radio.Group>
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Item
                                label="备注"
                                name="remark"
                                rules={[
                                    { required: false, message: "请输入备注" },
                                ]}
                            >
                                <TextArea
                                    showCount
                                    allowClear
                                    maxLength={100}
                                    autoSize={{ minRows: 4, maxRows: 6 }}
                                    placeholder="请输入备注"
                                />
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Item
                                labelCol={{ span: 2 }}
                                wrapperCol={{ span: 22 }}
                                label="菜单权限"
                                name="permission"
                                rules={[
                                    {
                                        required: true,
                                        message: "请选择菜单权限",
                                    },
                                ]}
                            >
                                <TreeTable
                                    checkable={true}
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
