import React, { memo } from "react";
import { Form, Input, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

interface SearchFormProps {
    onSearch: (values: any) => void;
    onReset: () => void;
}

const SearchForm: React.FC<SearchFormProps> = memo(({ onSearch, onReset }) => {
    const [form] = Form.useForm();

    const handleSearch = () => {
        const values = form.getFieldsValue();
        onSearch(values);
    };

    const handleReset = () => {
        form.resetFields();
        onReset();
    };

    return (
        <Form form={form} layout="inline">
            <Form.Item name="username" label="账号">
                <Input
                    placeholder="请输入"
                    allowClear
                    onPressEnter={handleSearch}
                    style={{ width: 160 }}
                />
            </Form.Item>
            <Form.Item name="name" label="姓名">
                <Input
                    placeholder="请输入"
                    allowClear
                    onPressEnter={handleSearch}
                    style={{ width: 160 }}
                />
            </Form.Item>
            <Form.Item name="phone" label="手机号">
                <Input
                    placeholder="请输入"
                    allowClear
                    onPressEnter={handleSearch}
                    style={{ width: 160 }}
                />
            </Form.Item>
            <Form.Item name="email" label="邮箱">
                <Input
                    placeholder="请输入"
                    allowClear
                    onPressEnter={handleSearch}
                    style={{ width: 160 }}
                />
            </Form.Item>
            <Form.Item>
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearch}
                    >
                        查询
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                        重置
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
});

export default SearchForm;
