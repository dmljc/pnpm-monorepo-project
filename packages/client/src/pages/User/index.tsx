import { FC, useState, useRef } from "react";
import request from "umi-request";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import CreateModal from "./CreateModal.tsx";
import { UpdateUser } from "./interface.ts";
import { del } from "./api.ts";

type GithubIssueItem = {
    id: number;
    username: string;
    password: string;
    name: string;
    sex: number;
    phone: string;
    email: string;
    id_card: string;
    remark: string;
};

const User: FC = () => {
    const actionRef = useRef<ActionType>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>("create");
    const [record, setRecord] = useState<UpdateUser>();
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ProColumns<GithubIssueItem>[] = [
        {
            title: "账号",
            dataIndex: "username",
            fixed: "left",
            width: 120,
        },
        {
            title: "密码",
            dataIndex: "password",
            search: false,
            width: 120,
        },
        {
            title: "姓名",
            dataIndex: "name",
            width: 120,
        },
        {
            title: "性别",
            dataIndex: "sex",
            search: false,
            filters: true,
            width: 100,
            onFilter: true,
            valueType: "select",
            valueEnum: {
                1: { text: "男" },
                2: { text: "女" },
            },
        },
        {
            title: "手机号",
            dataIndex: "phone",
        },
        {
            title: "邮箱",
            dataIndex: "email",
        },
        {
            title: "身份证号",
            dataIndex: "id_card",
        },
        {
            title: "备注",
            dataIndex: "remark",
            search: false,
            width: 200,
            ellipsis: true,
        },
        {
            title: "操作",
            valueType: "option",
            key: "option",
            width: 100,
            render: (text, _record, _, action) => [
                <a
                    key="edit"
                    onClick={() => {
                        setModalType("update");
                        setRecord(_record);
                        setModalOpen(true);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={async () => {
                        const resp = await del(_record.id);
                        if (resp) {
                            action?.reload();
                            messageApi.success("删除成功");
                        }
                    }}
                >
                    删除
                </a>,
            ],
        },
    ];

    return (
        <>
            {contextHolder}
            <ProTable<GithubIssueItem>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params) => {
                    console.log(params);
                    return request<{
                        data: GithubIssueItem[];
                    }>("http://localhost:3000/api/user/list", {
                        params,
                    });
                }}
                editable={{
                    type: "multiple",
                }}
                columnsState={{
                    persistenceKey: "pro-table-singe-demos",
                    persistenceType: "localStorage",
                    defaultValue: {
                        option: { fixed: "right", disable: true },
                    },
                    onChange(value) {
                        console.log("value: ", value);
                    },
                }}
                rowKey="id"
                search={{
                    labelWidth: "auto",
                }}
                options={{
                    setting: {
                        listsHeight: 400,
                    },
                }}
                form={{
                    // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        if (type === "get") {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                pagination={{
                    pageSize: 10,
                    onChange: (page) => console.log(page),
                }}
                dateFormatter="string"
                headerTitle="高级表格"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setModalType("create");
                            setModalOpen(true);
                        }}
                        type="primary"
                    >
                        新增
                    </Button>,
                ]}
            />

            <CreateModal
                isOpen={modalOpen}
                modalType={modalType}
                record={record!}
                handleClose={() => {
                    setModalOpen(false);
                    actionRef.current?.reload();
                }}
            />
        </>
    );
};

export default User;
