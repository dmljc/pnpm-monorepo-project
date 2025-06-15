import { ApiProperty } from "@nestjs/swagger";

export class UserDetailVo {
    @ApiProperty()
    id: number;

    @ApiProperty()
    username: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    sex: number;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    status: number;

    @ApiProperty()
    remark: string;

    @ApiProperty()
    avatar: string;

    @ApiProperty()
    role: string;
}
