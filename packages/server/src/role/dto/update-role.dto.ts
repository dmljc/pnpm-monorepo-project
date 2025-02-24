// 请求体一般会传递 json，比如 { username: 'xxx', password: 'xxx' }
// 我们会通过 dto （data transfer object）来接收。
// dto 是封装请求参数的。
import { IsNotEmpty, MaxLength } from "class-validator";

export class UpdateRoleDto {
    @IsNotEmpty({ message: "id不能为空" })
    id: number;

    @IsNotEmpty({ message: "角色名称不能为空" })
    name: string;

    @IsNotEmpty({ message: "角色编码不能为空" })
    code: string;

    @IsNotEmpty({ message: "角色状态不能为空" })
    status: number;

    @MaxLength(100)
    remark: string;
}
