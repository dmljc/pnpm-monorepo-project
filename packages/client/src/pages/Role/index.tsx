import { FC, useEffect, useState } from "react";
import { PlusOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, Radio, RadioChangeEvent } from "antd";
import { TreeTable, TreeComponent, IconRenderer } from "@/components/index.tsx";
import CreateRoleModal from "./CreateRoleModal";
import type { UpdateRole } from "./interface.ts";
import { ModalTypeEnum, formatTime } from "@/utils";
import { formatStringToNumberArray } from "./utils";
import { list, del } from "./api.ts";
import useStyles from "./style";

const { Item } = Form;
const { Group, Button: RButton } = Radio;

const Role: FC = () => {
    const { styles: ss } = useStyles();
    const [roleList, setRoleList] = useState<any[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateRole>();
    const [messageApi, contextHolder] = message.useMessage();
    const [roleDesc, setRoleDesc] = useState<string>("permission");

    useEffect(() => {
        getRoleList();
    }, []);

    useEffect(() => {
        setRecord(roleList?.[0]);
    }, [roleList.length]);

    const getRoleList = async (id?: number) => {
        try {
            const resp = await list({
                current: 1,
                pageSize: 10,
            });

            const data = resp.data.map((item: any) => ({
                icon: <SmileOutlined />,
                ...item,
            }));

            setRoleList(data);
            if (id) {
                setRecord(data.find((item: UpdateRole) => item.id === id));
            }
        } catch (error) {
            console.error("获取角色列表失败:", error);
            messageApi.error("获取角色列表失败");
        }
    };

    // 处理树节点操作
    const handleItemAction = (action: string, item: any) => {
        switch (action) {
            case "edit":
                setRecord(item);
                setModalType(ModalTypeEnum.UPDATE);
                setOpen(true);
                break;
            case "delete":
                handleDelete(item);
                break;
            default:
                break;
        }
    };

    // 删除角色
    const handleDelete = (item: any) => {
        Modal.confirm({
            title: "确认删除",
            content: `确定要删除角色"${item.name}"吗？此操作不可恢复。`,
            okText: "确认删除",
            cancelText: "取消",
            okType: "danger",
            onOk: async () => {
                try {
                    const response = await del(item.id);
                    if (response.success) {
                        messageApi.success("删除成功");
                        // 重新获取数据
                        getRoleList();
                    } else {
                        messageApi.error(response.message || "删除失败");
                    }
                } catch (error) {
                    console.error("删除失败:", error);
                    messageApi.error("删除失败，请稍后重试");
                }
            },
        });
    };

    const onChange = (e: RadioChangeEvent) => {
        setRoleDesc(e.target.value);
    };

    const handleSelect = (_selectedKeys: React.Key[], info: any) => {
        setRecord(info.selectedNodes?.[0]);
    };

    return (
        <>
            <div className={ss.root}>
                <div className={ss.left}>
                    <TreeComponent
                        treeData={roleList}
                        onItemAction={handleItemAction}
                        onSelect={handleSelect}
                    >
                        <Button
                            type="primary"
                            onClick={() => {
                                setRecord(undefined);
                                setModalType(ModalTypeEnum.CREATE);
                                setOpen(true);
                            }}
                        >
                            <PlusOutlined />
                        </Button>
                    </TreeComponent>
                </div>
                <div className={ss.right}>
                    <Group
                        value={roleDesc}
                        onChange={onChange}
                        style={{ marginBottom: 16 }}
                    >
                        <RButton value="permission">角色权限</RButton>
                        <RButton value="info">角色信息</RButton>
                    </Group>

                    {roleDesc === "permission" && (
                        <TreeTable
                            checkboxDisabled={true}
                            selectedRowKeys={formatStringToNumberArray(
                                record?.permission,
                            )}
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
                    handleClose={() => {
                        setOpen(false);
                    }}
                    handleOk={(id: number) => {
                        setOpen(false);
                        getRoleList(id); // 刷新数据
                    }}
                />
            </div>
            {contextHolder}
        </>
    );
};

export default Role;
