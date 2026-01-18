import React, { memo } from "react";
import { Form, Input, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface SearchFormProps {
    onSearch: (values: any) => void;
    onReset: () => void;
}

const SearchForm: React.FC<SearchFormProps> = memo(({ onSearch, onReset }) => {
    const { t } = useTranslation();
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
            <Form.Item
                name="username"
                label={t("user:search.form.username.label")}
            >
                <Input
                    placeholder={t("user:search.form.username.placeholder")}
                    allowClear
                    onPressEnter={handleSearch}
                    style={{ width: 160 }}
                />
            </Form.Item>
            <Form.Item name="name" label={t("user:search.form.name.label")}>
                <Input
                    placeholder={t("user:search.form.name.placeholder")}
                    allowClear
                    onPressEnter={handleSearch}
                    style={{ width: 160 }}
                />
            </Form.Item>
            <Form.Item name="phone" label={t("user:search.form.phone.label")}>
                <Input
                    placeholder={t("user:search.form.phone.placeholder")}
                    allowClear
                    onPressEnter={handleSearch}
                    style={{ width: 160 }}
                />
            </Form.Item>
            <Form.Item name="email" label={t("user:search.form.email.label")}>
                <Input
                    placeholder={t("user:search.form.email.placeholder")}
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
                        {t("user:search.form.buttons.search")}
                    </Button>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                        {t("user:search.form.buttons.reset")}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
});

export default SearchForm;
