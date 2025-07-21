import { ApiProperty } from "@nestjs/swagger";

export class SystemConfigVo {
    @ApiProperty({ description: "配置ID" })
    id: number;

    @ApiProperty({ description: "系统图标URL" })
    logo: string;

    @ApiProperty({ description: "系统名称" })
    name: string;

    @ApiProperty({ description: "系统描述" })
    description: string;

    @ApiProperty({ description: "版权说明" })
    copyright: string;

    @ApiProperty({ description: "ICP备案号" })
    icp: string;

    @ApiProperty({ description: "创建时间" })
    createdAt: Date;

    @ApiProperty({ description: "更新时间" })
    updatedAt: Date;
}
