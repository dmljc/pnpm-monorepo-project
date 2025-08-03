import { IsNotEmpty, MaxLength, IsOptional } from "class-validator";
export class CreateRoleDto {
    @IsNotEmpty({
        message: "role.nameNotEmpty",
    })
    name: string;

    @IsNotEmpty({
        message: "role.iconNotEmpty",
    })
    icon: string;

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

    @IsOptional()
    permission?: number[];
}
