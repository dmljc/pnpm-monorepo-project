import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateMenuDto {
    // 新增 @IsNotEmpty 验证非空
    @IsString({ message: "菜单类型必须是字符串" })
    @IsNotEmpty({ message: "菜单类型不能为空" })
    type: string;

    // 新增 @IsNotEmpty 验证非空
    @IsString({ message: "菜单名称必须是字符串" })
    @IsNotEmpty({ message: "菜单名称不能为空" })
    name: string;

    @IsOptional()
    url?: string;

    @IsOptional()
    parentId?: string;

    @IsOptional()
    icon?: string;

    @IsOptional()
    code?: string;

    @IsOptional()
    component?: string;

    @IsOptional()
    children?: CreateMenuDto[];
}
