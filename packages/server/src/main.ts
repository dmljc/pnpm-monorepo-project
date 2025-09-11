import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import * as os from "os";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { HttpResppnseInterceptor } from "./common/http.response.interceptor";
import { I18nValidationPipe } from "nestjs-i18n";
import { CustomI18nValidationFilter } from "./common/custom-i18n-filter";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ["log", "warn", "error"],
    });

    app.setGlobalPrefix("api");
    app.useStaticAssets("public");

    app.useGlobalInterceptors(new HttpResppnseInterceptor());
    app.useGlobalPipes(new I18nValidationPipe());
    app.useGlobalFilters(new CustomI18nValidationFilter());

    const config = new DocumentBuilder()
        .setTitle("NestJS 全栈项目接口文档")
        .setDescription("这是我的第一个 Nestjs 全栈项目，希望你能喜欢")
        .setVersion("1.0")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("doc", app, document);

    app.enableCors({
        origin: true, // 或指定域名如 ['http://localhost:3000']
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "x-requested-with",
            "Accept-Language",
            "x-custom-lang",
        ],
        credentials: true,
    });

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    const port = process.env.PORT || 3000;

    await app.listen(port, () => {
        const networkInterfaces = os.networkInterfaces();
        const ipv4 = Object.values(networkInterfaces)
            .flat()
            .find((ni) => ni?.family === "IPv4" && !ni.internal)?.address;

        console.log(`
  NestJS Server Started
  Local:   \x1b[36mhttp://localhost:${port}\x1b[0m
  Network: \x1b[36mhttp://${ipv4}:${port}\x1b[0m
         `);
    });
}
bootstrap();
