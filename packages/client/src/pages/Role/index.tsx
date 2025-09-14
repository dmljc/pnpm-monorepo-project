import { FC, useEffect, useState, useCallback } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Form, message, Modal, Radio, RadioChangeEvent } from "antd";
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
            console.error("获取角色列表失败:", error);
            messageApi.error("获取角色列表失败");
        }
    };

    const handleDelete = async (item: any) => {
        try {
            const response = await del(item.id);
            if (response.success) {
                messageApi.success("删除成功");
                getRoleList();
            } else {
                messageApi.error(response.message || "删除失败");
            }
        } catch (error) {
            console.error("删除失败:", error);
            messageApi.error("删除失败，请稍后重试");
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
            title: "确认删除",
            content: `确定要删除角色"${item.name}"吗？此操作不可恢复。`,
            okText: "确认删除",
            cancelText: "取消",
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
                        <RButton value="permission">角色权限</RButton>
                        <RButton value="info">角色信息</RButton>
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
                            <Item label="名称" required>
                                {record?.name}
                            </Item>
                            <Item label="ID" required>
                                {record?.id}
                            </Item>
                            <Item label="图标" required>
                                <IconRenderer icon={record?.icon} />
                            </Item>
                            <Item label="图标名称" required>
                                {record?.icon}
                            </Item>
                            <Item label="编码" required>
                                {record?.code}
                            </Item>
                            <Item label="角色状态" required>
                                {record?.status === 1 ? "启用" : "禁用"}
                            </Item>
                            <Item label="菜单权限" required>
                                {record?.permission}
                            </Item>
                            <Item label="创建时间" required>
                                {formatTime(record?.createTime)}
                            </Item>
                            <Item label="更新时间" required>
                                {formatTime(record?.updateTime)}
                            </Item>
                            <Item label="备注">{record?.remark}</Item>
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
