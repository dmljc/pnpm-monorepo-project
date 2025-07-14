import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateMenuDto {
    @IsNotEmpty({ message: "菜单id不能为空" })
    id: number;

    @IsNotEmpty({ message: "菜单类型不能为空" })
    type: string;

    @IsNotEmpty({ message: "菜单名称不能为空" })
    label: string;

    @IsOptional()
    path?: string;

    @IsOptional()
    parentId?: number;

    @IsOptional()
    icon?: string;

    @IsOptional()
    code?: string;

    @IsOptional()
    component?: string;

    @IsOptional()
    children?: UpdateMenuDto[];
}
