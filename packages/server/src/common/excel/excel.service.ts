import { Injectable } from "@nestjs/common";
import { Workbook } from "exceljs";

type ExcelRowData = (string | number)[];

@Injectable()
export class ExcelService {
    async importExcel(file: Express.Multer.File): Promise<ExcelRowData[]> {
        const workbook = new Workbook();
        await workbook.xlsx.load(file.buffer as any);
        const worksheet = workbook.getWorksheet(1);
        const data = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 1) {
                // 确保 row.values 是数组类型后再调用 slice 方法
                if (Array.isArray(row.values)) {
                    const rowData = row.values.slice(1) as ExcelRowData;
                    const headerMapping: Record<string, string> = {
                        ID: "id",
                        姓名: "name",
                        账号: "username",
                        密码: "password",
                        角色: "role",
                        手机号: "phone",
                        邮箱: "email",
                        状态: "status",
                        备注: "remark",
                        创建时间: "createTime",
                        更新时间: "updateTime",
                        头像: "avatar",
                    };

                    const rowDataObj = rowData.reduce((acc, value, index) => {
                        const header = worksheet.getCell(1, index + 1)
                            .value as string;
                        return {
                            ...acc,
                            [headerMapping[header] || header]: value,
                        };
                    }, {});
                    data.push(rowDataObj);
                }
            }
        });

        return data;
    }

    async exportExcel(): Promise<Buffer> {
        // 创建Excel工作簿实例
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("导出数据");

        // 添加表头
        worksheet.addRow([
            "ID",
            "姓名",
            "性别",
            "账号",
            "密码",
            "角色",
            "手机号",
            "邮箱",
            "状态",
            "备注",
            "创建时间",
            "更新时间",
            "头像",
        ]);

        // 添加示例数据（至少一行）
        worksheet.addRow([
            1,
            "张三",
            1,
            "zhangsan",
            "123456",
            "admin",
            "13800138000",
            "zhangsan@example.com",
            1,
            "备注信息",
            new Date().toLocaleString("zh-CN"), // 修改为ISO格式
            new Date().toLocaleString("zh-CN"), // 修改为ISO格式
            "https://img0.baidu.com/it/u=3170389506,3533872302&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        ]);

        // 设置列宽
        worksheet.columns.forEach((column) => {
            if (column.values) {
                const contentWidth = column.values.reduce<number>(
                    (max, value) => {
                        return Math.max(max, value?.toString().length ?? 0);
                    },
                    10,
                );
                column.width = Math.min(contentWidth, 200); // 取内容宽度和200中的较小值
            }
        });

        // 确保返回正确的Buffer
        return (await workbook.xlsx.writeBuffer()) as any;
    }
}
