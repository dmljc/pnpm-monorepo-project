export interface CreateUser {
    role: string;
    username: string;
    password: string;
    name: string;
    sex: number;
    phone: string;
    email: string;
    status: number;
    remark: string;
    avatar: string;
}

export interface UpdateUser extends CreateUser {
    id: number;
}
export interface ModalProps {
    open: boolean;
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
    email?: string;
    startTime?: Date;
    endTime?: Date;
}

export type GithubIssueItem = {
    id: number;
    role: string;
    username: string;
    password: string;
    name: string;
    sex: number;
    phone: string;
    email: string;
    status: number;
    remark: string;
    avatar: string;
    createTime: string;
    updateTime: string;
    dataSource: any[];
};
