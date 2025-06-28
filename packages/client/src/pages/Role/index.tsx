import { FC, useState, useRef } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { ModalTypeEnum } from "@/utils";
import CreateModal from "./CreateModal.tsx";
import { UpdateRole } from "./interface.ts";
import { list, del } from "./api.ts";

type GithubIssueItem = {
    id: number;
    name: string;
    code: string;
    status: number;
    remark: string;
    createTime: string;
    updateTime: string;
};

const Role: FC = () => {
    const actionRef = useRef<ActionType>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateRole>();
    const [messageApi, contextHolder] = message.useMessage();

    const columns: ProColumns<GithubIssueItem>[] = [
        {
            title: "角色姓名",
            dataIndex: "name",
        },
        {
            title: "角色编码",
            dataIndex: "code",
        },
        {
            title: "角色状态",
            dataIndex: "status",
            search: false,
            filters: true,
            onFilter: true,
            width: 100,
            valueType: "select",
            valueEnum: {
                0: { text: "停用" },
                1: { text: "启用" },
            },
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
            title: "更新时间",
            dataIndex: "updateTime",
            valueType: "dateTime",
            sorter: true,
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
                    修改
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
                    // 兼容 resp.data 可能为对象或数组
                    const dataList = Array.isArray(resp.data)
                        ? resp.data
                        : resp.data?.data || [];
                    const total = resp.data?.total ?? dataList.length;
                    return {
                        data: dataList,
                        success: resp.success !== false,
                        total,
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
                    // onChange(value) {
                    //     console.log("value: ", value);
                    // },
                }}
                key="role"
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
                    // onChange: (page) => console.log(page),
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
                        新增
                    </Button>,
                ]}
            />

            {modalOpen && (
                <CreateModal
                    open={modalOpen}
                    modalType={modalType}
                    record={record!}
                    handleClose={() => {
                        setModalOpen(false);
                    }}
                    handleOk={() => {
                        setModalOpen(false);
                        actionRef.current?.reload();
                    }}
                />
            )}
        </>
    );
};

export default Role;
