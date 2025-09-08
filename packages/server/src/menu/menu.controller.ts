import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Request,
    HttpException,
} from "@nestjs/common";
import { RequireLogin } from "../common/custom-decorator";
import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";

@Controller("menu")
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    @Post("create")
    @RequireLogin()
    async create(@Body() createMenuDto: CreateMenuDto) {
        return this.menuService.create(createMenuDto);
    }

    @Get("list/auth")
    @RequireLogin()
    async findAll(@Request() req) {
        if (!req?.user?.id) {
            throw new HttpException("Unauthorized", 401);
        }
        return await this.menuService.findCurrentUserMenuTree(req.user.id);
    }

    // 返回全量菜单树（仅用于管理端配置等场景）
    @Get("list")
    @RequireLogin()
    async findAllFull() {
        return await this.menuService.findAllAsTree();
    }

    // 返回当前登录用户的菜单树（基于角色的 permission 字段解析）
    @Get("my-tree")
    @RequireLogin()
    async findMyTree(@Request() req) {
        if (!req?.user?.id) {
            throw new HttpException("Unauthorized", 401);
        }
        return this.menuService.findCurrentUserMenuTree(req.user.id);
    }

    @Get(":id")
    @RequireLogin()
    findOne(@Param("id") id: number) {
        return this.menuService.findOne(+id);
    }

    @Put("update")
    @RequireLogin()
    update(@Body() updateMenuDto: UpdateMenuDto) {
        return this.menuService.update(updateMenuDto);
    }

    @Delete("delete/:id")
    @RequireLogin()
    remove(@Param("id") id: number) {
        return this.menuService.remove(+id);
    }
}
