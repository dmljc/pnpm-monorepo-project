import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { SystemConfigService } from "./system.config.service";
import { CreateSystemConfigDto } from "./dto/create-system.config.dto";
import { RequireLogin } from "src/common/custom-decorator";

@Controller("system/config")
export class SystemConfigController {
    constructor(private readonly systemConfigService: SystemConfigService) {}

    @RequireLogin()
    @Post("create")
    create(@Body() createSystemConfigDto: CreateSystemConfigDto) {
        return this.systemConfigService.create(createSystemConfigDto);
    }

    @RequireLogin(false)
    @Get("")
    detail() {
        return this.systemConfigService.detail();
    }

    @RequireLogin()
    @Delete("delete/:id")
    remove(@Param("id") id: string) {
        return this.systemConfigService.remove(+id);
    }
}
