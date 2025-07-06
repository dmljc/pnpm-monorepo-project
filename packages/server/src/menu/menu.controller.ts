import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
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

    @Get("list")
    @RequireLogin()
    findAll() {
        return this.menuService.findAll();
    }

    @Get(":id")
    @RequireLogin()
    findOne(@Param("id") id: string) {
        return this.menuService.findOne(+id);
    }

    @Patch(":id")
    @RequireLogin()
    update(@Param("id") id: string, @Body() updateMenuDto: UpdateMenuDto) {
        return this.menuService.update(+id, updateMenuDto);
    }

    @Delete(":id")
    @RequireLogin()
    remove(@Param("id") id: string) {
        return this.menuService.remove(+id);
    }
}
