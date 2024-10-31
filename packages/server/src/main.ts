import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { HttpExceptionFilter } from './common/http-exception.filter';
import { HttpResppnseInterceptor } from './common/http-response.interceptor';

async function bootstrap() {
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        // logger: false
        logger: ['log', 'warn', 'error'], // 日志的不同级别的区, 可控制是否打印
    });

    // 设置全局路由前缀
    app.setGlobalPrefix('api');
    app.useStaticAssets(join(__dirname, '../uploads'), {prefix: '/uploads'});

    // 自定义全局响应拦截器
    app.useGlobalInterceptors(new HttpResppnseInterceptor());

    // 自定义全局异常过滤器
    app.useGlobalFilters(new HttpExceptionFilter());

    // 我们还要对参数做一些校验，校验请求体的参数需要用到 ValidationPipe
    // 现在接收到的参数是普通对象，指定 transform: true 之后，就会转为 dto 的实例了：
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    app.enableCors(); // 启用cors 否则前端会因为跨域报错
    await app.listen(3000);
}
bootstrap();
