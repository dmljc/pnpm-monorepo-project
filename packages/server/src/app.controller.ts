import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
// import { MINIO_CLIENT } from "./minio/minio.module";
// import * as Minio from "minio";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    // @Inject(MINIO_CLIENT)
    // private minioClient: Minio.Client;

    // @Get("test")
    // async test() {
    //     try {
    //         await this.minioClient.fPutObject(
    //             "nestjs",
    //             "ok.jpeg",
    //             "./package.json",
    //         );
    //         return "http://localhost:9000/nestjs/ok.jpeg";
    //     } catch (e) {
    //         console.log(e);
    //         return "上传失败";
    //     }
    // }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }
}
