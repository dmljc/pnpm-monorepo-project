import { Injectable, Inject, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";

@Injectable()
export class MinioService implements OnModuleInit {
    constructor(
        @Inject("MINIO_CLIENT")
        private readonly minioClient: Minio.Client,
        private readonly configService: ConfigService,
    ) {}

    private getPublicReadPolicy(bucketName: string) {
        return JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: {
                        AWS: ["*"],
                    },
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
            ],
        });
    }

    async onModuleInit() {
        const bucketName =
            this.configService.get<string>("MINIO_BUCKET") || "nestjs";
        const exists = await this.minioClient.bucketExists(bucketName);

        if (exists) {
            await this.minioClient.setBucketPolicy(
                bucketName,
                this.getPublicReadPolicy(bucketName),
            );
        }
    }

    async uploadFile(bucketName: string, file: Express.Multer.File) {
        const exists = await this.minioClient.bucketExists(bucketName);
        if (!exists) {
            await this.minioClient.makeBucket(bucketName);
        }

        // Keep the current frontend direct-URL usage working.
        await this.minioClient.setBucketPolicy(
            bucketName,
            this.getPublicReadPolicy(bucketName),
        );

        const fileName = `${Date.now()}-${file.originalname}`;
        await this.minioClient.putObject(bucketName, fileName, file.buffer);
        return fileName;
    }
}
