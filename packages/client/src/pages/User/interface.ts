export interface CreateUser {
    role: number;
    username: string;
    password: string;
    name: string;
    sex: number;
    phone: string;
    status: number;
    remark: string;
}

export interface UpdateUser extends CreateUser {
    id: number;
}
export interface ModalProps {
    isOpen: boolean;
    modalType: string;
    record: UpdateUser;
    handleClose: () => void;
    handleOk: () => void;
}

export interface ListParams {
    current: number;
    pageSize: number;
    username?: string;
    name?: string;
    phone?: string;
    startTime?: Date;
    endTime?: Date;
}
