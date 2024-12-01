export interface CreateUser {
    username: string;
    password: string;
    name: string;
    sex: number;
    phone: string;
    email: string;
    idCard: string;
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
}

export interface ListParams {
    username?: string;
    name?: string;
    phone?: string;
    email?: string;
    idCard?: string;
}
