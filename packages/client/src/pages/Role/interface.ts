export interface CreateRole {
    name: string;
    code: string;
    status: number;
    remark: string;
}

export interface UpdateRole extends CreateRole {
    id: number;
}

export interface ModalProps {
    isOpen: boolean;
    modalType: string;
    record: UpdateRole;
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
