import { FC } from "react";
import {
    Drawer,
    Button,
    Radio,
    Form,
    Input,
    Row,
    Col,
    Space,
    TreeSelect,
} from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";

const { Item } = Form;

const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};

interface Props {
    open: boolean;
    menuData: any;
    onClose: () => void;
}

const typeOptions = [
    { label: "目录", value: "catalog" },
    { label: "菜单", value: "menu" },
    { label: "按钮", value: "button" }, // 更换为BorderOutlined
];

const CreateMenu: FC<Props> = (props) => {
    const { open, menuData, onClose } = props;
    const [form] = Form.useForm();

    // 监听type字段
    const type = Form.useWatch
        ? // eslint-disable-next-line react-hooks/rules-of-hooks
          Form.useWatch("type", form)
        : form.getFieldValue("type");

    const onFinish = (values: any) => {
        console.log(values);
    };

    const onSubmit = () => {
        form.submit();
    };

    const onCloseDrawer = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Drawer
            title="新增菜单"
            open={open}
            width={820}
            onClose={onClose}
            maskClosable={false}
            footer={[
                <Space key="space">
                    <Button
                        key="submit"
                        onClick={onSubmit}
                        type="primary"
                        icon={<SaveOutlined />}
                    >
                        提 交
                    </Button>
                    <Button
                        key="cancel"
                        icon={<CloseOutlined />}
                        onClick={onCloseDrawer}
                    >
                        取 消
                    </Button>
                </Space>,
            ]}
        >
            <Form
                {...layout}
                form={form}
                name="create-menu"
                initialValues={{
                    type: "catalog",
                }}
                onFinish={onFinish}
            >
                <Row>
                    <Col span={12}>
                        <Item
                            name="type"
                            label="菜单类型"
                            rules={[
                                { required: true, message: "请选择菜单类型" },
                            ]}
                        >
                            <Radio.Group
                                optionType="button"
                                buttonStyle="solid"
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
                    </Col>
                </Row>
                {/* 下面根据type动态渲染 */}
                <Row>
                    <Col span={12}>
                        <Item
                            name="name"
                            label="菜单名称"
                            rules={[
                                { required: true, message: "请输入菜单名称" },
                            ]}
                        >
                            <Input placeholder="请输入菜单名称" />
                        </Item>
                    </Col>
                    {type === "button" && (
                        <Col span={12}>
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
                                <Input placeholder="请输入权限字符" />
                            </Item>
                        </Col>
                    )}
                    {type === "menu" && (
                        <Col span={12}>
                            <Item
                                name="parent"
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
                                    treeData={menuData}
                                    fieldNames={{
                                        label: "name",
                                        value: "key",
                                    }}
                                    treeDefaultExpandAll
                                    treeNodeFilterProp="name"
                                    placeholder="请选择上级菜单"
                                />
                            </Item>
                        </Col>
                    )}
                </Row>
                <Row>
                    <Col span={12}>
                        <Item
                            name="url"
                            label="路由地址"
                            rules={[
                                { required: true, message: "请输入路由地址" },
                            ]}
                        >
                            <Input placeholder="请输入路由地址" />
                        </Item>
                    </Col>
                    {type === "menu" && (
                        <Col span={12}>
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
                                <Input placeholder="请输入页面组件" />
                            </Item>
                        </Col>
                    )}
                </Row>
            </Form>
        </Drawer>
    );
};

export default CreateMenu;
