import { FC, useState, useRef } from "react";
import { Button, message, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { ModalTypeEnum } from "@/utils";
import CreateModal from "./CreateModal.tsx";
import { UpdateUser } from "./interface.ts";
import { list, del } from "./api.ts";

type GithubIssueItem = {
    id: number;
    role: string;
    username: string;
    password: string;
    name: string;
    sex: number;
    phone: string;
    email: string;
    status: number;
    remark: string;
    avatar: string;
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
            title: "头像",
            dataIndex: "avatar",
            width: 120,
            fixed: "left",
            // @ts-expect-error 目前无法确定 `OSSUpload` 组件在接收 `value` 参数时的类型检查细节，直接传入字符串类型的 `text` 可能会触发类型错误，因此暂时使用此指令绕过类型检查。
            render: (text: string | undefined) =>
                text !== undefined && typeof text === "string" ? (
                    <div
                        style={{
                            position: "relative",
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            overflow: "hidden",
                        }}
                    >
                        <Image
                            width={60}
                            height={60}
                            style={{
                                borderRadius: "100%",
                                objectFit: "cover",
                                border: "1px solid #ccc",
                                padding: "4px",
                                cursor: "pointer",
                                transition: "transform 0.3s ease",
                            }}
                            src={text}
                        />
                    </div>
                ) : null,
        },
        {
            title: "账号",
            dataIndex: "username",
            width: 120,
            fixed: "left",
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
            title: "邮箱",
            dataIndex: "email",
            width: 180,
        },
        {
            title: "角色",
            dataIndex: "role",
            hideInSearch: true,
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
            hideInSearch: true,
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
            width: 200,
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

                    // 兼容性处理，在 refresh 接口调用之后刷新页面
                    if (!resp.success) {
                        actionRef.current?.reload();
                    }

                    return {
                        data: Array.isArray(resp.data) ? resp.data : [],
                        success: resp.success || true,
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
                    // onChange(value) {
                    //     console.log("value: ", value);
                    // },
                }}
                rowKey="id"
                search={{
                    labelWidth: "auto",
                }}
                scroll={{
                    x: 1400,
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

export default User;
