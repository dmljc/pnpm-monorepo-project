// 请求体一般会传递 json，比如 { username: 'xxx', password: 'xxx' }
// 我们会通过 dto （data transfer object）来接收。
// dto 是封装请求参数的。
import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty({ message: "角色名称不能为空" })
    name: string;

    @IsNotEmpty({ message: "角色编码不能为空" })
    code: string;

    @MaxLength(100)
    remark: string;
}
