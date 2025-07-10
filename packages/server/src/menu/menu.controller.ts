import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
} from "@nestjs/common";
import { RequireLogin } from "../common/custom-decorator";
import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { Menu } from "./entities/menu.entity";

function serializeMenu(menu: Menu): any {
    return {
        id: menu.id,
        name: menu.name,
        type: menu.type,
        url: menu.url,
        icon: menu.icon,
        code: menu.code,
        component: menu.component,
        parentId: menu.parent ? menu.parent.id : (menu.parentId ?? null),
        children: menu.children ? menu.children.map(serializeMenu) : [],
    };
}

@Controller("menu")
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    @Post("create")
    @RequireLogin()
    async create(@Body() createMenuDto: CreateMenuDto) {
        return this.menuService.create(createMenuDto);
    }

    @Get("list")
    @RequireLogin()
    async findAll() {
        const tree = await this.menuService.findAll();
        return tree.map(serializeMenu);
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
