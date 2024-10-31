import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql', // 数据库类型  
            host: '127.0.0.1',// 数据库主机  
            port: 3306,// 数据库端口  
            username: 'root',// 数据库用户名  
            password: 'zfc125521',// 数据库密码  
            database: 'nest_db',// 数据库名  
            synchronize: true, // 是否自动将实体类同步到数据库
            logging: false,
            // logging: ['error', 'warn', 'log', 'info', 'query'], // 设置日志级别
            entities: [__dirname + '/**/*.entity{.ts,.js}'], // 实体文件的位置  
            poolSize: 10, // 是一个常见的数据库连接池配置项，用于设置连接池中最大的连接数。
        }),
        UserModule,
        BookModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
