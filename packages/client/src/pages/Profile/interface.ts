import type { CreateRole } from "../Role/interface";
export interface UserInfo {
    role: number;
    username: string;
    password: string;
    name: string;
    phone: string;
    status: number;
    remark: string;
    roles: CreateRole[];
}
