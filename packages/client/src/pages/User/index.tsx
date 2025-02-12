import { FC, useState, useRef } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { ModalTypeEnum } from "@/utils";
import CreateModal from "./CreateModal.tsx";
import { UpdateUser } from "./interface.ts";
import { list, del } from "./api.ts";

type GithubIssueItem = {
    id: number;
    username: string;
    password: string;
    name: string;
    sex: number;
    phone: string;
    remark: string;
    createTime: string;
    updateTime: string;
};

const User: FC = () => {
    const actionRef = useRef<ActionType>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateUser>();
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ProColumns<GithubIssueItem>[] = [
        {
            title: "账号",
            dataIndex: "username",
            width: 120,
            render: (text) => <a>{text}</a>,
        },
        {
            title: "密码",
            dataIndex: "password",
            search: false,
            width: 110,
        },
        {
            title: "姓名",
            dataIndex: "name",
            width: 110,
        },
        {
            title: "性别",
            dataIndex: "sex",
            search: false,
            filters: true,
            onFilter: true,
            width: 100,
            valueType: "select",
            valueEnum: {
                1: { text: "男" },
                2: { text: "女" },
            },
        },
        {
            title: "手机号",
            dataIndex: "phone",
            width: 130,
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            valueType: "dateTime",
            sorter: true,
            hideInSearch: true,
            width: 180,
        },
        {
            title: "创建时间",
            dataIndex: "createTime",
            valueType: "dateRange",
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        startTime: value[0],
                        endTime: value[1],
                    };
                },
            },
        },
        {
            title: "更新时间",
            dataIndex: "updateTime",
            valueType: "dateTime",
            hideInSearch: true,
            width: 180,
        },
        {
            title: "备注",
            dataIndex: "remark",
            search: false,
            ellipsis: true,
            copyable: true,
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
                        setModalType(ModalTypeEnum.UPDATE);
                        setRecord(_record);
                        setModalOpen(true);
                    }}
                >
                    更新
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
                request={async (params, sort, filter) => {
                    const resp = await list({
                        current: params.current ?? 1,
                        pageSize: params.pageSize ?? 10,
                        ...params,
                        ...sort,
                        ...filter,
                    });

                    return {
                        data: resp.data,
                        success: resp.success,
                        total: resp.data.length,
                    };
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
                                createTime: [values.startTime, values.endTime],
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
                            setModalType(ModalTypeEnum.CREATE);
                            setModalOpen(true);
                        }}
                        type="primary"
                    >
                        创建
                    </Button>,
                ]}
            />

            {modalOpen && (
                <CreateModal
                    isOpen={modalOpen}
                    modalType={modalType}
                    record={record!}
                    handleClose={() => {
                        setModalOpen(false);
                        actionRef.current?.reload();
                    }}
                />
            )}
        </>
    );
};

export default User;
