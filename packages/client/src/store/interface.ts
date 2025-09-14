/**
 * 用户信息接口
 */
export interface User {
    /** 用户角色 */
    role: string;
    /** 用户名/账号 */
    username: string;
    /** 密码 */
    password: string;
    /** 真实姓名 */
    name: string;
    /** 手机号 */
    phone: string;
    /** 邮箱地址 */
    email: string;
    /** 用户状态：1-启用，0-禁用 */
    status: number;
    /** 备注信息 */
    remark: string;
    /** 头像地址 */
    avatar: string;
}
