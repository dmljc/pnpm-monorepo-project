import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";
import { LoginGuard } from "./common/login.guard";
@Module({
    imports: [
        // 配置ConfigModule 根据环境变量动态加载 .env.development 或 .env.production文件
        ConfigModule.forRoot({
            isGlobal: true, // 使配置在全局范围内可用
            // 指定要加载的环境文件
            envFilePath:
                process.env.NODE_ENV === "production"
                    ? ".env.production"
                    : ".env.development",
        }),
        // 使用TypeOrmModule并读取配置
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
        JwtModule.register({
            global: true,
            secret: "string",
            signOptions: {
                expiresIn: "10m", // d 天，h 小时，m 分钟， s 秒
            },
        }),
        UserModule,
        RoleModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: LoginGuard,
        },
    ],
})
export class AppModule {}
