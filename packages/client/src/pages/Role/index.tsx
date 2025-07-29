import { FC, useEffect, useState } from "react";
import useStyles from "./style";
import TreeComponent from "@/components/TreeComponent";
import { PlusOutlined, SmileOutlined } from "@ant-design/icons";
import CreateRoleModal from "./CreateRoleModal";
import { ModalTypeEnum } from "@/utils";
import type { UpdateRole } from "./interface.ts";
import { list, del } from "./api.ts";
import { Button, message, Modal } from "antd";
import TreeTable from "@/components/TreeTable";

const Role: FC = () => {
    const { styles: ss } = useStyles();
    const [treeData, setTreeData] = useState<any[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<ModalTypeEnum>(
        ModalTypeEnum.CREATE,
    );
    const [record, setRecord] = useState<UpdateRole>();
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        getTreeData();
    }, []);

    const getTreeData = async () => {
        try {
            const resp = await list({
                current: 1,
                pageSize: 10,
            });

            const data = resp.data.map((item: any) => ({
                icon: <SmileOutlined />,
                ...item,
            }));

            setTreeData(data);
        } catch (error) {
            console.error("获取角色列表失败:", error);
            messageApi.error("获取角色列表失败");
        }
    };

    // 处理树节点操作
    const handleItemAction = (action: string, item: any) => {
        console.log("Action:", action, "Item:", item);

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
                        getTreeData();
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

    return (
        <>
            {contextHolder}
            <div className={ss.root}>
                <div className={ss.left}>
                    <TreeComponent
                        treeData={treeData}
                        onItemAction={handleItemAction}
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
                    <TreeTable showRowSelection={true} editable={true} />
                </div>

                <CreateRoleModal
                    open={open}
                    modalType={modalType}
                    record={record!}
                    handleClose={() => {
                        setOpen(false);
                    }}
                    handleOk={() => {
                        setOpen(false);
                        getTreeData(); // 刷新数据
                    }}
                />
            </div>
        </>
    );
};

export default Role;
