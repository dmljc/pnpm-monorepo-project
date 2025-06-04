import { Controller, Get } from "@nestjs/common";
import { ServerService } from "./server.service";

@Controller("server")
export class ServerController {
    constructor(private readonly serverService: ServerService) {}

    @Get("info")
    async info() {
        return {
            cpu: this.serverService.getCpuInfo(),
            mem: this.serverService.getMemInfo(),
            dist: await this.serverService.getDiskStatus(),
            sys: this.serverService.getSysInfo(),
        };
    }
}
