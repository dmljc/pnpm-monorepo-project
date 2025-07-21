import { IsNotEmpty, MaxLength, IsUrl } from "class-validator";

export class CreateSystemConfigDto {
    @IsNotEmpty({ message: "系统图标不能为空" })
    @IsUrl({}, { message: "系统图标必须是有效的URL" })
    logo: string;

    @IsNotEmpty({ message: "系统名称不能为空" })
    @MaxLength(20, { message: "系统名称长度不能超过20个字符" })
    name: string;

    @IsNotEmpty({ message: "系统描述不能为空" })
    @MaxLength(30, { message: "系统描述长度不能超过30个字符" })
    description: string;

    @IsNotEmpty({ message: "版权说明不能为空" })
    @MaxLength(60, { message: "版权说明长度不能超过60个字符" })
    copyright: string;

    @IsNotEmpty({ message: "ICP备案号不能为空" })
    @MaxLength(30, { message: "ICP备案号长度不能超过30个字符" })
    icp: string;
}
