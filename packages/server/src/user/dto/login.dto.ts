import { IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
    @IsNotEmpty({ message: "账号不能为空" })
    username: string;

    @IsNotEmpty({ message: "密码不能为空" })
    @MinLength(6, { message: "密码最少6位" })
    password: string;
}
