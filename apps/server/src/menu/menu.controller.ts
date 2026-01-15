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

    // 返回当前登录用户的菜单树（基于角色的 permission 字段解析）
    @Get("me/list")
    @RequireLogin()
    async getMyMenuTree(@Request() req) {
        if (!req?.user?.id) {
            throw new HttpException("Unauthorized", 401);
        }
        return await this.menuService.findCurrentUserMenuTree(req.user.id);
    }

    // 返回全量菜单树（仅用于管理端配置等场景）
    @Get("list")
    @RequireLogin()
    async getAllMenuTree() {
        return await this.menuService.findAllAsTree();
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
