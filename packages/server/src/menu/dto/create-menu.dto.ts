import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateMenuDto {
    @IsNotEmpty({ message: "菜单类型不能为空" })
    type: string;

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
