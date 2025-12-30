import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, message, Modal, Radio, RadioChangeEvent } from "antd";
import { useTranslation } from "react-i18next";
import {
    TreeComponent,
    IconRenderer,
    AuthButton,
} from "@/components";
import { TreeTable } from "@/pages/Menu";
import CreateRoleModal from "./CreateRoleModal";
import type { UpdateRole } from "./interface.ts";
import { ModalTypeEnum, formatTime } from "@/utils";
import useStyles from "./style";
import { useMenuStore } from "@/store/menuStore";
import { list, del } from "./api.ts";
import { formatStringToNumberArray } from "./utils";

const { Item } = Form;
const { Group, Button: RButton } = Radio;

const Role = () => {
    const { t } = useTranslation();
    // ==================== 状态管理 ====================
    const { styles: ss } = useStyles();

    // 角色列表相关状态
    const [roleList, setRoleList] = useState<UpdateRole[]>([]);
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

    // ==================== API 调用函数 ====================
    const getRoleList = async (id?: number) => {
        const { data } = await list({
            current: 1,
            pageSize: 10,
        });

        setRoleList(data);
        if (id) {
            const foundRecord = data.find((item: UpdateRole) => item.id === id);
            if (foundRecord) {
                setRecord(foundRecord);
            }
        }
    };

    // ==================== 副作用钩子 ====================
    useEffect(() => {
        getRoleList();
    }, []);

    useEffect(() => {
        if (roleList?.[0]) {
            setRecord(roleList[0]);
        }
    }, [roleList]);

    // 当选中角色变化时，更新菜单权限选中状态
    useEffect(() => {
        const permissionArray = formatStringToNumberArray(record?.permission);
        setSelectedMenuKeys(permissionArray);
    }, [record]);

    const handleDelete = async (item: UpdateRole) => {
        const response = await del(item.id);
        if (response.success) {
            messageApi.success(t("role:messages.deleteSuccess"));
            await getRoleList();
        }
    };

    // ==================== UI 事件处理函数 ====================
    const handleCreateRole = () => {
        setRecord(undefined);
        setModalType(ModalTypeEnum.CREATE);
        setOpen(true);
    };

    const handleEditRole = (item: UpdateRole) => {
        setRecord(item);
        setModalType(ModalTypeEnum.UPDATE);
        setOpen(true);
    };

    const handleDeleteConfirm = (item: UpdateRole) => {
        Modal.confirm({
            title: t("role:modal.title.edit"),
            content: t("role:messages.deleteConfirm", { name: item.name }),
            okText: t("role:actions.delete"),
            cancelText: t("common:button.cancel", { defaultValue: "取消" }),
            okType: "danger",
            onOk: () => handleDelete(item),
        });
    };

    const handleItemAction = (action: string, item: UpdateRole) => {
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
        const selectedNode = info.selectedNodes?.[0];
        if (selectedNode) {
            setRecord(selectedNode);
        }
    };

    const handleModalClose = () => {
        setOpen(false);
    };

    const handleModalSuccess = (id: number) => {
        setOpen(false);
        getRoleList(id);
        useMenuStore.getState().getMenuMeList();
    };

    return (
        <>
            <div className={ss.root}>
                <div className={ss.left}>
                    <TreeComponent
                        treeData={roleList as any}
                        onItemAction={handleItemAction as any}
                        onSelect={handleRoleSelect as any}
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
                                {record?.createTime
                                    ? formatTime(record.createTime)
                                    : "-"}
                            </Item>
                            <Item label={t("role:info.updateTime")} required>
                                {record?.updateTime
                                    ? formatTime(record.updateTime)
                                    : "-"}
                            </Item>
                            <Item label={t("role:info.remark")}>
                                {record?.remark || "-"}
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
