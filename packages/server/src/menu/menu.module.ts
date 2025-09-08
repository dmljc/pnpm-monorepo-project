import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { Menu } from "./entities/menu.entity";
import { User } from "../user/entities/user.entity";
import { Role } from "../role/entities/role.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Menu, User, Role])],
    controllers: [MenuController],
    providers: [MenuService],
    exports: [MenuService],
})
export class MenuModule {}
