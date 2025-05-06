import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
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
// import { PermissionGuard } from "./common/permission.guard";
// import { JwtAuthGuard } from "./auth/jwt.auth.guard";
import { MinioModule } from "./minio/minio.module";
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
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: configService.get("DB_TYPE") as any,
                host: configService.get<string>("DB_HOST"),
                port: configService.get<number>("DB_PORT"),
                username: configService.get<string>("DB_USERNAME"),
                password: configService.get<string>("DB_PASSWORD"),
                database: configService.get<string>("DB_DATABASE"),
                synchronize: configService.get<boolean>("DB_SYNCHRONIZE"),
                logging: configService.get<boolean>("DB_LOGGING"),
                entities: [join(__dirname, "**/*.entity{.ts,.js}")],
                poolSize: configService.get<number>("DB_POOL_SIZE"),
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

        // 功能模块
        UserModule,
        RoleModule,
        AuthModule,
        RedisModule,
        EmailModule,
        MinioModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        RedisService,
        {
            provide: APP_GUARD,
            useClass: LoginGuard,
        },
        // 取消注释以启用JWT认证守卫
        // {
        //     provide: APP_GUARD,
        //     useClass: JwtAuthGuard,
        // },
    ],
})
export class AppModule {}
