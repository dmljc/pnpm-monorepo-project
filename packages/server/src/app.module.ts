import { Module } from "@nestjs/common";
import {
    TypeOrmModule,
    TypeOrmModuleAsyncOptions,
    TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";
import { join } from "path";

// 控制器和服务
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

// 模块导入
import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";
import { AuthModule } from "./auth/auth.module";
import { RedisModule } from "./redis/redis.module";
import { EmailModule } from "./email/email.module";

// 服务和守卫
import { RedisService } from "./redis/redis.service";
import { LoginGuard } from "./common/login.guard";
import { RequestLogInterceptor } from "./common/request.log.interceptor";
// import { PermissionGuard } from "./common/permission.guard";
// import { JwtAuthGuard } from "./auth/jwt.auth.guard";
import { MinioModule } from "./minio/minio.module";
import { ExcelModule } from "./common/excel/excel.module";
import { ServerModule } from "./common/server/server.module";

import {
    AcceptLanguageResolver,
    HeaderResolver,
    I18nModule,
    // logger,
    QueryResolver,
} from "nestjs-i18n";

import {
    WINSTON_MODULE_NEST_PROVIDER,
    WinstonLogger,
    WinstonModule,
    utilities,
} from "nest-winston";
import * as winston from "winston";
import { CustomTypeOrmLogger } from "./common/custom.typeorm.logger";
import { MenuModule } from "./menu/menu.module";
import { SystemConfigModule } from "./system.config/system.config.module";
import "winston-daily-rotate-file";

@Module({
    imports: [
        // 全局配置模块，根据环境变量动态加载配置文件
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
        }),

        // 数据库连接配置
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (
                configService: ConfigService,
                logger: WinstonLogger,
            ): Promise<TypeOrmModuleOptions | TypeOrmModuleAsyncOptions> => ({
                type: configService.get("DB_TYPE") as any,
                host: configService.get<string>("DB_HOST"),
                port: configService.get<number>("DB_PORT"),
                username: configService.get<string>("DB_USERNAME"),
                password: configService.get<string>("DB_PASSWORD"),
                database: configService.get<string>("DB_DATABASE"),
                synchronize: configService.get<boolean>("DB_SYNCHRONIZE"),
                logging: configService.get<boolean>("DB_LOGGING"),
                logger: new CustomTypeOrmLogger(logger),
                entities: [join(__dirname, "**/*.entity{.ts,.js}")],
                poolSize: configService.get<number>("DB_POOL_SIZE"),
            }),
            inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
        }),

        WinstonModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                level: "debug",
                transports: [
                    new winston.transports.DailyRotateFile({
                        level: configService.get("WINSTON_LOG_LEVEL"),
                        dirname: configService.get("WINSTON_LOG_DIRNAME"),
                        filename: configService.get("WINSTON_LOG_FILENAME"),
                        datePattern: configService.get(
                            "WINSTON_LOG_DATE_PATTERN",
                        ),
                        maxSize: configService.get("WINSTON_LOG_MAX_SIZE"),
                    }),
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            utilities.format.nestLike(),
                        ),
                    }),
                ],
            }),
        }),

        // JWT认证模块配置
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: {
                    expiresIn: configService.get<string>("JWT_EXPIRES_IN"),
                },
            }),
        }),

        // HTTP模块配置
        HttpModule.register({
            timeout: 5000,
        }),

        // 多语言配置模块
        I18nModule.forRoot({
            fallbackLanguage: "en",
            loaderOptions: {
                path: join(__dirname, "/i18n/"),
                watch: true,
            },
            throwOnMissingKey: true,
            resolvers: [
                // "x-custom-lang" 是我们自定义的语言头放在最上面
                new HeaderResolver(["x-custom-lang"]),
                new QueryResolver(["lang"]), // 简化参数
                AcceptLanguageResolver,
            ],
        }),

        // 功能模块
        UserModule,
        RoleModule,
        AuthModule,
        RedisModule,
        EmailModule,
        MinioModule,
        ExcelModule,
        ServerModule,
        MenuModule,
        ConfigModule,
        SystemConfigModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        RedisService,
        {
            provide: APP_GUARD,
            useClass: LoginGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: RequestLogInterceptor,
        },
        // 取消注释以启用JWT认证守卫
        // {
        //     provide: APP_GUARD,
        //     useClass: JwtAuthGuard,
        // },
    ],
})
export class AppModule {}
