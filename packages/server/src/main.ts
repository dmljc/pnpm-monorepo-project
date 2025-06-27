import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
// import { ValidationPipe } from "@nestjs/common";
import * as os from "os";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
// import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
// import { HttpExceptionFilter } from "./common/http.exception.filter"; // 确保路径正确
import { HttpResppnseInterceptor } from "./common/http.response.interceptor";
import { I18nValidationPipe } from "nestjs-i18n";
import { CustomI18nValidationFilter } from "./common/custom-i18n-filter";

async function bootstrap() {
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        // logger: false
        logger: ["log", "warn", "error"], // 日志的不同级别的区, 可控制是否打印
    });

    // 设置全局路由前缀
    app.setGlobalPrefix("api");
    // app.useStaticAssets(join(__dirname, "../uploads"), { prefix: "/uploads" });
    app.useStaticAssets("public");

    // 自定义全局响应拦截器
    app.useGlobalInterceptors(new HttpResppnseInterceptor());

    // 我们还要对参数做一些校验，校验请求体的参数需要用到 ValidationPipe
    // 现在接收到的参数是普通对象，指定 transform: true 之后，就会转为 dto 的实例了：
    // app.useGlobalPipes(new ValidationPipe({ transform: true }));
    // app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new I18nValidationPipe());
    // app.useGlobalFilters(
    //     new I18nValidationExceptionFilter({
    //         detailedErrors: false,
    //     }),
    // );
    app.useGlobalFilters(new CustomI18nValidationFilter());

    const config = new DocumentBuilder()
        .setTitle("NestJS 全栈项目接口文档")
        .setDescription("这是我的第一个 Nestjs 全栈项目，希望你能喜欢")
        .setVersion("1.0")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("doc", app, document);

    // 设置全局登录守卫
    // app.useGlobalGuards(new LoginGuard());
    // app.userGlobalXxx 的方式不能注入 provide
    // 可以通过在 AppModule 添加 token 为 APP_XXX 的 provider
    // 的方式来声明全局 Guard、Pipe、Intercepter 等：

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
        credentials: true, // 允许携带凭证（如 cookies）
    }); // 启用cors 否则前端会因为跨域报错

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    const port = process.env.PORT || 3000;

    await app.listen(port, () => {
        const networkInterfaces = os.networkInterfaces();
        const ipv4 = Object.values(networkInterfaces)
            .flat()
            .find((ni) => ni.family === "IPv4" && !ni.internal)?.address;

        // Vite 风格输出
        console.log(`
 Nestjs 
\x1b[37m Local:\x1b[0m   \x1b[36mhttp://localhost:${port}\x1b[0m
\x1b[37m Network:\x1b[0m \x1b[36mhttp://${ipv4}:${port}\x1b[0m
    `);
    });
}
bootstrap();
