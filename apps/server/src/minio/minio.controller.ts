import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RequireLogin } from "../common/custom-decorator";
import { FileInterceptor } from "@nestjs/platform-express";

import { MinioService } from "./minio.service";

@Controller("minio")
@RequireLogin(false)
export class MinioController {
    constructor(
        private readonly minioService: MinioService,
        private readonly configService: ConfigService,
    ) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    async upload(@UploadedFile() file: Express.Multer.File) {
        const bucketName =
            this.configService.get<string>("MINIO_BUCKET") || "nestjs";
        const fileName = await this.minioService.uploadFile(bucketName, file);
        const minioPublicUrl = (
            this.configService.get<string>("MINIO_PUBLIC_URL") ||
            "http://localhost:9000"
        ).replace(/\/$/, "");

        return {
            url: `${minioPublicUrl}/${bucketName}/${fileName}`,
            fileName,
        };
    }
}
