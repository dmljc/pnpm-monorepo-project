import {
    Controller,
    Get,
    Query,
    Post,
    Put,
    Body,
    Param,
    Delete,
} from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { QueryDto } from "./dto/query-role.dto";
import { RequireLogin } from "../common/custom-decorator";

@Controller("role")
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get("list")
    @RequireLogin()
    async list(@Query() queryData: QueryDto) {
        return this.roleService.list(queryData);
    }

    @Get(":id")
    @RequireLogin()
    async detail(@Param("id") id: number) {
        return this.roleService.detail(+id);
    }

    @Post("create")
    @RequireLogin()
    async create(@Body() CreateRoleDto: CreateRoleDto) {
        return this.roleService.create(CreateRoleDto);
    }

    @Put("update")
    @RequireLogin()
    async update(@Body() UpdateRoleDto: UpdateRoleDto) {
        return this.roleService.update(UpdateRoleDto);
    }

    @Delete("delete/:id")
    @RequireLogin()
    async delete(@Param("id") id: number) {
        return this.roleService.delete(+id);
    }
}
