import type { TableProps } from "antd";

export interface TreeTableColumn {
    title: string;
    dataIndex: string;
    key: string;
    width?: string;
    render?: (value: any, record: any) => React.ReactNode;
}

export interface TreeTableProps<T = any> {
    // 是否显示行选择
    showRowSelection?: boolean;
    // 是否可编辑
    editable?: boolean;
    // 新增按钮点击事件
    onAdd?: () => void;
    // 编辑按钮点击事件
    onEdit?: (record: T) => void;
    // 删除按钮点击事件
    onDelete?: (record: T) => void;
}

export type TableRowSelection<T extends object = object> =
    TableProps<T>["rowSelection"];

export interface CreateMenu {
    label: string;
    type: string;
    icon?: string;
    path?: string;
    code?: string;
    component?: string;
    children?: CreateMenu[];
    parentId?: string;
}

export interface UpdateMenu extends CreateMenu {
    id: number;
}

export interface ModalProps {
    open: boolean;
    modalType: string;
    record: UpdateMenu;
    handleClose: () => void;
    handleOk: () => void;
}

export interface DataType {
    id: number;
    label: string;
    type: string;
    parentId?: string;
    icon?: string;
    path?: string;
    code?: string;
    component?: string;
    children?: DataType[];
}
