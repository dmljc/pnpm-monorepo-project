import { Controller, Get, Inject } from "@nestjs/common";
import { RedisClientType } from "redis";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Inject("REDIS_CLIENT")
    private readonly redisClient: RedisClientType;

    @Get("redis")
    async getHello() {
        const keys = await this.redisClient.keys("*");

        console.log("keys===>", keys);
        return this.appService.getHello();
    }
}
