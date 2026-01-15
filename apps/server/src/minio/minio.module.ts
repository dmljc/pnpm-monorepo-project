import { Global, Module } from "@nestjs/common";
import { MinioService } from "./minio.service";
import { MinioController } from "./minio.controller";
import * as Minio from "minio";

@Global()
@Module({
    providers: [
        {
            provide: "MINIO_CLIENT",
            async useFactory() {
                const client = new Minio.Client({
                    endPoint: "localhost",
                    port: 9000,
                    useSSL: false,
                    accessKey: "WPUA09FpnoAIiikgxTmV",
                    secretKey: "pBL8zSRU8XJRukjg82r5bdcGqf0mtXThGrM8fZhg",
                });
                return client;
            },
        },
        MinioService,
    ],
    exports: ["MINIO_CLIENT"], // MinioService
    controllers: [MinioController],
})
export class MinioModule {}
