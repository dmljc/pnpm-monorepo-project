import type { FormInstance } from "antd";

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
    menuData: CreateMenu[];
    open: boolean;
    modalType: string;
    record: UpdateMenu;
    handleClose: () => void;
    handleOk: () => void;
    form?: FormInstance;
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
