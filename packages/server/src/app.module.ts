import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { LoginGuard } from "./common/login.guard";
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql", // 数据库类型
            host: "127.0.0.1", // 数据库主机
            port: 3306, // 数据库端口
            username: "root", // 数据库用户名
            password: "zfc125521", // 数据库密码
            database: "nest_db", // 数据库名
            synchronize: true, // 是否自动将实体类同步到数据库
            logging: false,
            // logging: ['error', 'warn', 'log', 'info', 'query'], // 设置日志级别
            entities: [__dirname + "/**/*.entity{.ts,.js}"], // 实体文件的位置
            poolSize: 10, // 是一个常见的数据库连接池配置项，用于设置连接池中最大的连接数。
        }),
        JwtModule.register({
            global: true,
            secret: "string",
            signOptions: {
                expiresIn: "10m", // d 天，h 小时，m 分钟， s 秒
            },
        }),
        UserModule,
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
