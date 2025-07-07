export interface CreateMenu {
    name: string;
    type: string;
    icon?: string;
    url?: string;
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
}

export interface ListParams {
    current: number;
    pageSize: number;
    name?: string;
    startTime?: Date;
    endTime?: Date;
}
