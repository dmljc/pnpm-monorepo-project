import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "redis";
import { RedisService } from "./redis.service";

@Global()
@Module({
    providers: [
        RedisService,
        {
            provide: "REDIS_CLIENT",
            async useFactory(configService: ConfigService) {
                const client = createClient({
                    socket: {
                        host:
                            configService.get<string>("REDIS_HOST") ||
                            "localhost",
                        port: Number(
                            configService.get<string>("REDIS_PORT") || 6379,
                        ),
                    },
                    password: configService.get<string>("REDIS_PASSWORD"),
                });
                await client.connect();
                return client;
            },
            inject: [ConfigService],
        },
    ],
    // exports: [RedisService],
    exports: ["REDIS_CLIENT"],
})
export class RedisModule {}
