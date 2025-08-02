export interface CreateRole {
    name: string;
    icon: string;
    code: string;
    status: number;
    remark: string;
}

export interface UpdateRole extends CreateRole {
    id: number;
    createTime?: string;
    updateTime?: string;
}

export interface ModalProps {
    open: boolean;
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

export type GithubIssueItem = {
    id: number;
    name: string;
    code: string;
    status: number;
    remark: string;
    createTime: string;
    updateTime: string;
};
