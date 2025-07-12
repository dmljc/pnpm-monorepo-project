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
        return await this.menuService.findAll();
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
