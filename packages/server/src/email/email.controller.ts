import {
    Controller,
    Get,
    Query,
    BadRequestException,
    Inject,
} from "@nestjs/common";
import { EmailService } from "./email.service";
import { isEmail } from "class-validator";
import { RedisService } from "../redis/redis.service";

@Controller("email")
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Inject("REDIS_CLIENT")
    private redisService: RedisService;

    @Get("captcha")
    async sendEmailCaptcha(@Query("address") address: string) {
        // 验证邮箱地址
        if (!isEmail(address)) {
            throw new BadRequestException("无效的邮箱地址");
        }
        const captcha = Math.random().toString().slice(2, 8);

        await this.redisService.set(`captcha_${address}`, captcha, 60 * 5);

        await this.emailService.sendMail({
            to: address,
            subject: "登录验证码",
            html: `<span>登录验证码是: <b>${captcha}</b></span>`,
        });
        return captcha;
    }
}
