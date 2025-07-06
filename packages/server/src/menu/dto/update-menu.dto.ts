import { IsNotEmpty } from "class-validator";

export class UpdateMenuDto {
    @IsNotEmpty({ message: "菜单id不能为空" })
    id: number;

    @IsNotEmpty({ message: "菜单类型不能为空" })
    type: string;

    @IsNotEmpty({ message: "菜单名称不能为空" })
    name: string;

    @IsNotEmpty({ message: "菜单路由不能为空" })
    url: string;
}
