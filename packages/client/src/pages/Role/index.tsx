import { FC, useEffect, useState, useCallback } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, message, Modal, Radio, RadioChangeEvent } from "antd";
import { useTranslation } from "react-i18next";
import {
    TreeTable,
    TreeComponent,
    IconRenderer,
    AuthButton,
} from "@/components";
import CreateRoleModal from "./CreateRoleModal";
import type { UpdateRole } from "./interface.ts";
import { ModalTypeEnum, formatTime } from "@/utils";
import useStyles from "./style";
import { useMenuStore } from "@/store";
import { list, del } from "./api.ts";

const { Item } = Form;
const { Group, Button: RButton } = Radio;

const Role: FC = () => {
    const { t } = useTranslation();
    // ==================== 状态管理 ====================
    const { styles: ss } = useStyles();

    // 角色列表相关状态
    const [roleList, setRoleList] = useState<any[]>([]);
    const [record, setRecord] = useState<UpdateRole>();

    // 模态框相关状态
    const [open, setOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );

    // UI 相关状态
    const [messageApi, contextHolder] = message.useMessage();
    const [roleDesc, setRoleDesc] = useState<string>("permission");
    const [selectedMenuKeys, setSelectedMenuKeys] = useState<React.Key[]>([]);

    // ==================== 副作用钩子 ====================
    useEffect(() => {
        getRoleList();
    }, []);

    useEffect(() => {
        setRecord(roleList?.[0]);
    }, [roleList.length]);

    // 当选中角色变化时，更新菜单权限选中状态
    useEffect(() => {
        if (record?.permission && typeof record.permission === "string") {
            const permissionArray = record.permission
                .split(",")
                .map(Number)
                .filter((id) => id > 0); // 过滤掉无效的ID
            setSelectedMenuKeys(permissionArray);
        } else {
            setSelectedMenuKeys([]);
        }
    }, [record]);

    // ==================== API 调用函数 ====================
    const getRoleList = async (id?: number) => {
        try {
            const { data } = await list({
                current: 1,
                pageSize: 10,
            });

            setRoleList(data);

            if (!id) return;
            setRecord(data.find((item: UpdateRole) => item.id === id));
        } catch (error) {
            console.error("get roles failed:", error);
            messageApi.error(t("role:messages.getListFailed"));
        }
    };

    const handleDelete = async (item: any) => {
        try {
            const response = await del(item.id);
            if (response.success) {
                messageApi.success(t("role:messages.deleteSuccess"));
                getRoleList();
            } else {
                messageApi.error(
                    response.message || t("role:messages.deleteFailed"),
                );
            }
        } catch (error) {
            console.error("delete failed:", error);
            messageApi.error(t("role:messages.deleteFailed"));
        }
    };

    // ==================== UI 事件处理函数 ====================
    const handleCreateRole = () => {
        setRecord(undefined);
        setModalType(ModalTypeEnum.CREATE);
        setOpen(true);
    };

    const handleEditRole = (item: any) => {
        setRecord(item);
        setModalType(ModalTypeEnum.UPDATE);
        setOpen(true);
    };

    const handleDeleteConfirm = (item: any) => {
        Modal.confirm({
            title: t("role:modal.title.edit"),
            content: t("role:messages.deleteConfirm", { name: item.name }),
            okText: t("role:actions.delete"),
            cancelText: t("common:button.cancel", { defaultValue: "取消" }),
            okType: "danger",
            onOk: () => handleDelete(item),
        });
    };

    const handleItemAction = (action: string, item: any) => {
        switch (action) {
            case "edit":
                handleEditRole(item);
                break;
            case "delete":
                handleDeleteConfirm(item);
                break;
            default:
                break;
        }
    };

    const handleTabChange = (e: RadioChangeEvent) => {
        setRoleDesc(e.target.value);
    };

    const handleRoleSelect = (_selectedKeys: React.Key[], info: any) => {
        setRecord(info.selectedNodes?.[0]);
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    const handleModalSuccess = (id: number) => {
        setOpen(false);
        getRoleList(id);
        useMenuStore.getState().getMenuMeList();
    };

    // 处理TreeTable选中项变化（只读模式，不需要实际更新权限）
    const handleMenuSelectionChange = useCallback(
        (selectedRowKeys: React.Key[]) => {
            // 在角色列表页面，TreeTable是只读的，所以这里只是用于显示
            // 不需要实际更新角色的权限
            console.log("角色权限查看模式 - 选中的菜单项:", selectedRowKeys);
        },
        [],
    );

    return (
        <>
            <div className={ss.root}>
                <div className={ss.left}>
                    <TreeComponent
                        treeData={roleList}
                        onItemAction={handleItemAction}
                        onSelect={handleRoleSelect}
                    >
                        <AuthButton
                            code="role:create"
                            key="role:create"
                            type="primary"
                            onClick={handleCreateRole}
                        >
                            <PlusOutlined />
                        </AuthButton>
                    </TreeComponent>
                </div>
                <div className={ss.right}>
                    <Group
                        value={roleDesc}
                        onChange={handleTabChange}
                        style={{ marginBottom: 16 }}
                    >
                        <RButton value="permission">
                            {t("role:tabs.permission")}
                        </RButton>
                        <RButton value="info">{t("role:tabs.info")}</RButton>
                    </Group>

                    {roleDesc === "permission" && (
                        <TreeTable
                            disabledCheck={true}
                            selecteable={true}
                            selectedRowKeys={selectedMenuKeys}
                            onChange={handleMenuSelectionChange}
                        />
                    )}
                    {roleDesc === "info" && (
                        <Form
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 18 }}
                            layout="horizontal"
                        >
                            <Item label={t("role:info.name")} required>
                                {record?.name}
                            </Item>
                            <Item label={t("role:info.id")} required>
                                {record?.id}
                            </Item>
                            <Item label={t("role:info.icon")} required>
                                <IconRenderer icon={record?.icon} />
                            </Item>
                            <Item label={t("role:info.iconName")} required>
                                {record?.icon}
                            </Item>
                            <Item label={t("role:info.code")} required>
                                {record?.code}
                            </Item>
                            <Item label={t("role:info.status")} required>
                                {record?.status === 1
                                    ? t("role:status.enabled")
                                    : t("role:status.disabled")}
                            </Item>
                            <Item label={t("role:info.permission")} required>
                                {record?.permission}
                            </Item>
                            <Item label={t("role:info.createTime")} required>
                                {formatTime(record?.createTime)}
                            </Item>
                            <Item label={t("role:info.updateTime")} required>
                                {formatTime(record?.updateTime)}
                            </Item>
                            <Item label={t("role:info.remark")}>
                                {record?.remark}
                            </Item>
                        </Form>
                    )}
                </div>

                <CreateRoleModal
                    open={open}
                    modalType={modalType}
                    record={record as UpdateRole}
                    handleClose={handleModalClose}
                    handleOk={handleModalSuccess}
                />
            </div>
            {contextHolder}
        </>
    );
};

export default Role;
