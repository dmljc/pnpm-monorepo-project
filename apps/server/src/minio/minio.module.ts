import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MinioService } from "./minio.service";
import { MinioController } from "./minio.controller";
import * as Minio from "minio";

@Global()
@Module({
    providers: [
        {
            provide: "MINIO_CLIENT",
            async useFactory(configService: ConfigService) {
                const client = new Minio.Client({
                    endPoint:
                        configService.get<string>("MINIO_ENDPOINT") ||
                        "localhost",
                    port: Number(
                        configService.get<string>("MINIO_PORT") || 9000,
                    ),
                    useSSL:
                        configService.get<string>("MINIO_USE_SSL") === "true",
                    accessKey:
                        configService.get<string>("MINIO_ACCESS_KEY") ||
                        "WPUA09FpnoAIiikgxTmV",
                    secretKey:
                        configService.get<string>("MINIO_SECRET_KEY") ||
                        "pBL8zSRU8XJRukjg82r5bdcGqf0mtXThGrM8fZhg",
                });
                return client;
            },
            inject: [ConfigService],
        },
        MinioService,
    ],
    exports: ["MINIO_CLIENT"], // MinioService
    controllers: [MinioController],
})
export class MinioModule {}
