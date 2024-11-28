import { FC, useState, useRef } from "react";
import request from "umi-request";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import CreateModal from "./CreateModal.tsx";
import { UpdateBook } from "./interface.ts";
import { del } from "./api.ts";

export const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export const waitTime = async (time: number = 100) => {
    await waitTimePromise(time);
};

type GithubIssueItem = {
    id: number;
    name: string;
    word: string;
    description: string;
    avatar?: string;
};

const User: FC = () => {
    const actionRef = useRef<ActionType>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>("create");
    const [record, setRecord] = useState<UpdateBook>();
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ProColumns<GithubIssueItem>[] = [
        {
            title: "姓名",
            dataIndex: "name",
        },
        {
            title: "字名",
            search: false,
            dataIndex: "word",
        },
        {
            title: "描述",
            search: false,
            dataIndex: "description",
        },
        {
            title: "操作",
            valueType: "option",
            key: "option",
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
                            messageApi.success("操作成功");
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
                request={async (params, sort, filter) => {
                    console.log(params, sort, filter);
                    return request<{
                        data: GithubIssueItem[];
                    }>("http://192.168.1.4:3000/api/book/list", {
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
                        新建
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
