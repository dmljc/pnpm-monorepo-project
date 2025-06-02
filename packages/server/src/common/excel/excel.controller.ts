import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    Res,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ExcelService } from "./excel.service";
import { Response } from "express";

@Controller("excel")
export class ExcelController {
    constructor(private readonly excelService: ExcelService) {}

    @Post("import")
    @UseInterceptors(FileInterceptor("file"))
    async importExcel(@UploadedFile() file: Express.Multer.File) {
        return this.excelService.importExcel(file);
    }

    @Post("export")
    async exportExcel(@Res() res: Response) {
        try {
            const buffer = await this.excelService.exportExcel();
            res.set({
                "Content-Type":
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": "attachment; filename=export.xlsx",
                "Content-Length": buffer.length,
            });
            res.end(buffer);
        } catch (error) {
            console.error("导出Excel文件时出错:", error);
            throw new HttpException(
                "导出失败",
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
