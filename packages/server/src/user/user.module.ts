// module：模块，包含 controller、service 等，比如用户模块、书籍模块
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])], //  关联实体
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule { }
