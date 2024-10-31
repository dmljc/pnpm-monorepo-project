import { IsNotEmpty } from "class-validator";

export class UpdateBookDto {
    @IsNotEmpty({ message: 'id不能为空' })
    id: number;

    @IsNotEmpty({ message: '名称不能为空' })
    name: string;

    @IsNotEmpty({ message: '字不能为空' })
    word: string;

    @IsNotEmpty({ message: '简介不能为空' })
    description: string;

    @IsNotEmpty({ message: '头像不能为空' })
    avatar: string;
}


