import {
    Controller,
    Inject,
    Logger,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { RequireLogin } from "../common/custom-decorator";
import { FileInterceptor } from "@nestjs/platform-express";

import { MinioService } from "./minio.service";
import * as Minio from "minio";

@Controller("minio")
@RequireLogin(false)
export class MinioController {
    private readonly logger = new Logger(MinioController.name);

    constructor(
        @Inject("MINIO_CLIENT")
        private readonly minioClient: Minio.Client,

        @Inject(MinioService)
        private readonly minioService: MinioService,
    ) {}

    @Post("upload")
    @UseInterceptors(FileInterceptor("file"))
    async upload(@UploadedFile() file: Express.Multer.File) {
        const bucketName = "nestjs"; // 替换为你的存储桶名称
        const fileName = await this.minioService.uploadFile(bucketName, file);
        return {
            url: `http://localhost:9000/${bucketName}/${fileName}`,
            fileName,
        };
    }
}
