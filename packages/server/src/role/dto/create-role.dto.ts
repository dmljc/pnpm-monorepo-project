// 请求体一般会传递 json，比如 { username: 'xxx', password: 'xxx' }
// 我们会通过 dto （data transfer object）来接收。
// dto 是封装请求参数的。
import { IsNotEmpty, MaxLength, IsOptional } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";

export class CreateRoleDto {
    @IsNotEmpty({
        message: i18nValidationMessage("validate.usernameNotEmpty"),
    })
    name: string;

    // message: i18nValidationMessage("validate.usernameNotEmpty"),
    @IsNotEmpty({ message: "validate.passwordNotEmpty" })
    code: string;

    @IsNotEmpty({ message: "角色状态不能为空" })
    status: number;

    @IsOptional()
    @MaxLength(100)
    remark: string;
}
