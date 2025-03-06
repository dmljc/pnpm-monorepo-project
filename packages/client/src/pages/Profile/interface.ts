import type { CreateRole } from "../../api/role/interfaces";
export interface UserInfo {
    role: number;
    username: string;
    password: string;
    name: string;
    sex: number;
    phone: string;
    status: number;
    remark: string;
    roles: CreateRole[];
}
