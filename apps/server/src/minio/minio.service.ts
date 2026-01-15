import { Injectable, Inject } from "@nestjs/common";
import * as Minio from "minio";

@Injectable()
export class MinioService {
    constructor(
        @Inject("MINIO_CLIENT")
        private readonly minioClient: Minio.Client,
    ) {}

    async uploadFile(bucketName: string, file: Express.Multer.File) {
        const exists = await this.minioClient.bucketExists(bucketName);
        if (!exists) {
            await this.minioClient.makeBucket(bucketName);
        }
        const fileName = `${Date.now()}-${file.originalname}`;
        await this.minioClient.putObject(bucketName, fileName, file.buffer);
        return fileName;
    }
}
