// module：模块，包含 controller、service 等，比如用户模块、书籍模块
import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Role])], //  关联实体
    controllers: [RoleController],
    providers: [RoleService],
    exports: [RoleService],
})
export class RoleModule {}
