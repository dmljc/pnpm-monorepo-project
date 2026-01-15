// React 相关
import {
    FC,
    useState,
    useEffect,
    useCallback,
    useTransition,
    useMemo,
} from "react";

// 第三方库
import { message, Image, Upload, Table, Space, Typography } from "antd";
import {
    PlusOutlined,
    DownloadOutlined,
    UploadOutlined,
    EditOutlined,
    DeleteOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ColumnHeightOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

// 内部组件
import { AuthButton } from "@/components";
import CreateUserModal from "./CreateModal.tsx";
import SearchForm from "./SearchForm.tsx";

// 类型定义
import type { CreateUser, UpdateUser, GithubIssueItem } from "./interface.ts";

// 工具/常量
import { ModalTypeEnum } from "@/utils";

// API 调用
import { list, del, importExcel, exportExcel, create, freeze } from "./api.ts";

const { Title } = Typography;

const User: FC = () => {
    const { t, i18n } = useTranslation();

    // 稳定化翻译函数
    const tText = useCallback(
        (key: string, options?: any) => String(i18n.t(key, options)),
        [i18n, i18n.resolvedLanguage],
    );

    // ==================== 状态管理 ====================
    // 数据相关状态
    const [dataSource, setDataSource] = useState<GithubIssueItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchParams, setSearchParams] = useState<any>({});
    const [sorter, setSorter] = useState<{ field?: string; order?: string }>(
        {},
    );

    // 模态框相关状态
    const [open, setOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateUser>();

    // UI 相关状态
    const [messageApi, contextHolder] = message.useMessage();
    const [importLoading, setImportLoading] = useState(false);

    // React 19: 使用 useTransition 优化并发渲染
    const [isPending, startTransition] = useTransition();

    // ==================== API 调用函数 ====================
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                current,
                pageSize,
                ...searchParams,
                ...sorter,
            };
            const resp = await list(params);

            const dataList = Array.isArray(resp.data)
                ? resp.data
                : resp.data?.data || [];
            const totalCount = resp.data?.total ?? dataList.length;

            setDataSource(dataList);
            setTotal(totalCount);
        } catch (error) {
            console.error("fetch data failed", error);
        } finally {
            setLoading(false);
        }
    }, [current, pageSize, searchParams, sorter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addUser = async (params: CreateUser) => {
        const resp = await create(params);
        if (resp.success === true) {
            fetchData();
            messageApi.success(t("user:messages.createSuccess"));
        }
    };

    const handleDelete = async (record: GithubIssueItem) => {
        const resp = await del(record.id);
        if (resp) {
            fetchData();
            messageApi.success(t("user:messages.deleteSuccess"));
        }
    };

    const handleFreeze = async (record: GithubIssueItem) => {
        const newStatus = record.status === 1 ? 0 : 1;
        const resp = await freeze(record.id, newStatus);
        if (resp) {
            fetchData();
            const enabled = record.status === 0;
            messageApi.success(
                enabled
                    ? t("user:messages.enableSuccess")
                    : t("user:messages.disableSuccess"),
            );
        }
    };

    // ==================== 文件操作函数 ====================
    const handleImport = async (file: File) => {
        setImportLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await importExcel(formData);
            if (!response) return;

            const readerPromise = new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error("读取文件失败"));
                reader.readAsText(response);
            });

            const resultText = await readerPromise;
            const result = JSON.parse(resultText);

            if (!result.success) {
                messageApi.error(t("user:messages.importFailed"));
                return;
            }
            await addUser(result.data);
        } catch (error) {
            console.error("import failed", error);
            messageApi.error(t("user:messages.importFailed"));
        } finally {
            setImportLoading(false);
        }
    };

    const handleExport = async () => {
        const response = await exportExcel();
        startTransition(() => {
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
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
            messageApi.success(t("user:messages.exportSuccess"));
        });
    };

    // ==================== UI 事件处理函数 ====================
    const handleCreateUser = () => {
        setModalType(ModalTypeEnum.CREATE);
        setOpen(true);
    };

    const handleEditUser = (record: GithubIssueItem) => {
        setModalType(ModalTypeEnum.UPDATE);
        setRecord(record as any);
        setOpen(true);
    };

    const handleModalClose = () => setOpen(false);

    const handleModalSuccess = () => {
        setOpen(false);
        fetchData();
    };

    const handleSearch = (values: any) => {
        setSearchParams(values);
        setCurrent(1);
    };

    const handleReset = () => {
        setSearchParams({});
        setCurrent(1);
        setSorter({});
    };

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _filters: any,
        sorter: any,
    ) => {
        setCurrent(pagination.current || 1);
        setPageSize(pagination.pageSize || 10);
        if (sorter.field) {
            setSorter({
                field: sorter.field,
                order: sorter.order === "ascend" ? "asc" : "desc",
            });
        } else {
            setSorter({});
        }
    };

    // ==================== 表格列配置 ====================
    const columns: ColumnsType<GithubIssueItem> = useMemo(
        () => [
            {
                title: "账号",
                dataIndex: "username",
                width: 100,
                fixed: "left",
                render: (text) => <a style={{ color: "#1890ff" }}>{text}</a>,
            },
            {
                title: "头像",
                dataIndex: "avatar",
                width: 80,
                align: "center",
                render: (text: string) => (
                    <Image
                        width={50}
                        height={50}
                        style={{
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                        src={text}
                        preview={false}
                    />
                ),
            },

            {
                title: "密码",
                dataIndex: "password",
                width: 120,
            },
            {
                title: "姓名",
                dataIndex: "name",
                width: 100,
            },
            {
                title: "角色",
                dataIndex: "role",
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
                width: 200,
            },
            {
                title: "状态",
                dataIndex: "status",
                width: 80,
                filters: [
                    { text: "启用", value: 1 },
                    { text: "停用", value: 0 },
                ],
                render: (status: number) => (
                    <span>
                        <span
                            style={{
                                display: "inline-block",
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                backgroundColor:
                                    status === 1 ? "#52c41a" : "#d9d9d9",
                                marginRight: 8,
                            }}
                        />
                        {status === 1 ? "启用" : "停用"}
                    </span>
                ),
            },
            {
                title: "创建时间",
                dataIndex: "createTime",
                width: 180,
                sorter: true,
                render: (text) =>
                    text ? dayjs(text).format("YYYY-MM-DD HH:mm:ss") : "-",
            },
            {
                title: "操作",
                key: "action",
                width: 200,
                fixed: "right",
                render: (_, record) => (
                    <Space
                        size={0}
                        separator={
                            <span style={{ color: "#d9d9d9", margin: "0 4px" }}>
                                |
                            </span>
                        }
                    >
                        <AuthButton
                            code="user:update"
                            type="link"
                            size="small"
                            style={{ padding: "0 4px" }}
                            icon={<EditOutlined />}
                            onClick={() => handleEditUser(record)}
                        >
                            编辑
                        </AuthButton>
                        <AuthButton
                            code="user:disabled"
                            type="link"
                            size="small"
                            style={{ padding: "0 4px" }}
                            icon={
                                record.status === 1 ? (
                                    <CloseCircleOutlined />
                                ) : (
                                    <CheckCircleOutlined />
                                )
                            }
                            onClick={() => handleFreeze(record)}
                        >
                            {record.status === 1 ? "停用" : "启用"}
                        </AuthButton>
                        <AuthButton
                            code="user:delete"
                            type="link"
                            size="small"
                            danger
                            style={{ padding: "0 4px" }}
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                        >
                            删除
                        </AuthButton>
                    </Space>
                ),
            },
        ],
        [tText],
    );

    return (
        <>
            {contextHolder}

            {/* 搜索表单区域 */}
            <div
                style={{
                    padding: "16px 24px",
                    marginBottom: 16,
                    background: "#fff",
                    borderRadius: 8,
                    border: "1px solid #f0f0f0",
                }}
            >
                <SearchForm onSearch={handleSearch} onReset={handleReset} />
            </div>

            {/* 工具栏和表格区域 */}
            <div
                style={{
                    padding: "16px 24px",
                    background: "#fff",
                    borderRadius: 8,
                    border: "1px solid #f0f0f0",
                }}
            >
                <div
                    style={{
                        marginBottom: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                        用户管理
                    </Title>
                    <Space size="middle">
                        <AuthButton
                            code="user:create"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreateUser}
                        >
                            新增
                        </AuthButton>
                        <AuthButton
                            code="user:export"
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                            loading={isPending}
                        >
                            导出Excel
                        </AuthButton>
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
                                icon={<UploadOutlined />}
                                loading={importLoading}
                            >
                                导入Excel
                            </AuthButton>
                        </Upload>
                        <SyncOutlined
                            style={{ fontSize: 16, cursor: "pointer" }}
                            onClick={fetchData}
                        />
                        <ColumnHeightOutlined
                            style={{ fontSize: 16, cursor: "pointer" }}
                        />
                        <SettingOutlined
                            style={{ fontSize: 16, cursor: "pointer" }}
                        />
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current,
                        pageSize,
                        total,
                        showSizeChanger: false,
                        showQuickJumper: false,
                        showTotal: (total, range) =>
                            `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
                        size: "middle" as const,
                    }}
                    scroll={{ x: 1400 }}
                    onChange={handleTableChange}
                    size="middle"
                    bordered={false}
                />
            </div>

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
