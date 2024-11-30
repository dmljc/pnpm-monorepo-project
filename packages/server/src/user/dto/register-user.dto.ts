// 请求体一般会传递 json，比如 { username: 'xxx', password: 'xxx' }
// 我们会通过 dto （data transfer object）来接收。
// dto 是封装请求参数的。
import { IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class RegisterUserDto {
    @IsNotEmpty({ message: "账号不能为空" })
    username: string;

    @IsNotEmpty({ message: "密码不能为空" })
    @MinLength(6, { message: "密码最少6位" })
    password: string;

    @IsNotEmpty({ message: "姓名不能为空" })
    name: string;

    @IsNotEmpty({ message: "性别不能为空" })
    sex: number;

    @IsNotEmpty({ message: "手机号不能为空" })
    phone: string;

    @IsNotEmpty({ message: "邮箱不能为空" })
    email: string;

    @IsNotEmpty({ message: "身份证号不能为空" })
    id_card: string;

    @MaxLength(100)
    remark: string;
}
