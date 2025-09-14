// React 相关
import { FC, useState, useRef } from "react";

// 第三方库
import { message, Image, Upload } from "antd";
import {
    PlusOutlined,
    DownloadOutlined,
    UploadOutlined,
    EditOutlined,
    DeleteOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import dayjs from "dayjs";

// 内部组件
import { AuthButton } from "@/components";
import CreateUserModal from "./CreateModal.tsx";

// 类型定义
import type { CreateUser, UpdateUser, GithubIssueItem } from "./interface.ts";

// 工具/常量
import { ModalTypeEnum } from "@/utils";

// API 调用
import { list, del, importExcel, exportExcel, create, freeze } from "./api.ts";

// ==================== 表格列配置 ====================
const createColumns = (
    handleEditUser: (record: UpdateUser) => void,
    handleDelete: (record: UpdateUser) => void,
    handleFreeze: (record: UpdateUser) => void,
): ProColumns<GithubIssueItem>[] => [
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
        title: "角色",
        dataIndex: "role",
        hideInSearch: true,
        width: 100,
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
        title: "状态",
        dataIndex: "status",
        search: false,
        filters: true,
        onFilter: true,
        width: 100,
        valueType: "select",
        valueEnum: {
            1: { text: "启用", status: "Success" },
            0: { text: "停用", status: "Error" },
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
        width: 200,
        render: (_text, _record) => [
            <AuthButton
                code="user:update"
                key="user:update"
                color="primary"
                variant="link"
                className="btn-p0"
                icon={<EditOutlined />}
                onClick={() => handleEditUser(_record)}
            >
                编辑
            </AuthButton>,
            <AuthButton
                code="user:disabled"
                key="user:disabled"
                color="primary"
                variant="link"
                className="btn-p0"
                icon={
                    _record.status === 1 ? (
                        <CloseCircleOutlined />
                    ) : (
                        <CheckCircleOutlined />
                    )
                }
                // disabled={_record.role === "root"}
                onClick={() => handleFreeze(_record)}
            >
                {_record.status === 1 ? "停用" : "启用"}
            </AuthButton>,
            <AuthButton
                code="user:delete"
                key="user:delete"
                color="danger"
                variant="link"
                className="btn-p0"
                icon={<DeleteOutlined />}
                // disabled={_record.role === "root"}
                onClick={() => handleDelete(_record)}
            >
                删除
            </AuthButton>,
        ],
    },
];

const User: FC = () => {
    // ==================== 状态管理 ====================
    // 表格相关状态
    const actionRef = useRef<ActionType>(null);

    // 模态框相关状态
    const [open, setOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateUser>();

    // UI 相关状态
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    // ==================== API 调用函数 ====================
    const addUser = async (params: CreateUser) => {
        const resp = await create(params);
        if (resp.success === true) {
            actionRef.current?.reload();
            messageApi.success("批量新增成功");
        }
    };

    const handleDelete = async (record: UpdateUser) => {
        const resp = await del(record.id);
        if (resp) {
            actionRef.current?.reload();
            messageApi.success("删除成功");
        }
    };

    const handleFreeze = async (record: UpdateUser) => {
        const resp = await freeze(record.id, record.status === 1 ? 0 : 1);
        if (resp) {
            actionRef.current?.reload();
            messageApi.success("修改成功");
        }
    };

    // ==================== 文件操作函数 ====================
    const handleImport = async (file: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await importExcel(formData);
            if (!response) return;
            const reader = new FileReader();
            reader.onload = () => {
                const result = JSON.parse(reader.result as string);
                if (!result.success) {
                    messageApi.error("导入失败");
                    return;
                }
                addUser(result.data);
            };
            reader.onerror = () => {
                console.log("导入失败了");
            };
            reader.readAsText(response);
        } catch (error) {
            console.error("导入失败", error);
            messageApi.error("导入失败");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await exportExcel();
            // 直接使用response作为Blob数据，因为它已经是二进制文件流
            const blob = new Blob([response], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const formatted = dayjs().format("YYYY/MM/DD HH:mm:ss");
            link.setAttribute("download", `user_template_${formatted}.xlsx`);
            document.body.appendChild(link);
            link.click();

            // 清理
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            messageApi.success("导出成功");
        } catch (error) {
            console.error("导出失败", error);
            messageApi.error(
                "导出失败: " +
                    (error instanceof Error ? error.message : String(error)),
            );
        }
    };

    // ==================== UI 事件处理函数 ====================
    const handleCreateUser = () => {
        setModalType(ModalTypeEnum.CREATE);
        setOpen(true);
    };

    const handleEditUser = (record: UpdateUser) => {
        setModalType(ModalTypeEnum.UPDATE);
        setRecord(record);
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    const handleModalSuccess = () => {
        setOpen(false);
        actionRef.current?.reload();
    };

    // ==================== 表格配置 ====================
    const columns = createColumns(handleEditUser, handleDelete, handleFreeze);

    return (
        <>
            {contextHolder}
            <ProTable<any>
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
                }}
                key="user"
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
                    name: "userList",
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
                }}
                dateFormatter="string"
                headerTitle="高级表格"
                toolBarRender={() => [
                    <AuthButton
                        code="user:create"
                        key="user:create"
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateUser}
                    >
                        新增
                    </AuthButton>,
                    <AuthButton
                        code="user:export"
                        key="user:export"
                        icon={<DownloadOutlined />}
                        onClick={handleExport}
                    >
                        导出Excel
                    </AuthButton>,
                    <Upload
                        name="file"
                        accept=".xlsx,.xls"
                        beforeUpload={(file) => {
                            handleImport(file);
                            return false;
                        }}
                        showUploadList={false}
                    >
                        <AuthButton
                            code="user:import"
                            key="user:import"
                            icon={<UploadOutlined />}
                            loading={loading}
                        >
                            导入Excel
                        </AuthButton>
                    </Upload>,
                ]}
            />

            <CreateUserModal
                open={open}
                modalType={modalType}
                record={record!}
                handleClose={handleModalClose}
                handleOk={handleModalSuccess}
            />
        </>
    );
};

export default User;
