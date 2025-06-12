// 请求体一般会传递 json，比如 { username: 'xxx', password: 'xxx' }
// 我们会通过 dto （data transfer object）来接收。
// dto 是封装请求参数的。
import { IsNotEmpty, MaxLength, IsOptional } from "class-validator";

export class UpdateRoleDto {
    @IsNotEmpty({
        message: "role.idNotEmpty",
    })
    id: number;

    @IsNotEmpty({
        message: "role.nameNotEmpty",
    })
    name: string;

    @IsNotEmpty({
        message: "role.codeNotEmpty",
    })
    code: string;

    @IsNotEmpty({
        message: "role.statusNotEmpty",
    })
    status: number;

    @IsOptional()
    @MaxLength(100)
    remark?: string;
}
