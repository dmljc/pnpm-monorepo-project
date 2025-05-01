import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class AuthService {
    @Inject()
    private userService: UserService;

    @Inject("REDIS_CLIENT")
    private redisService: RedisService;

    async validateUser(username: string, pass: string) {
        const user = await this.userService.findUserByUserName(username);

        if (!user) {
            throw new UnauthorizedException("用户不存在");
        }
        if (user.password !== pass) {
            throw new UnauthorizedException("密码错误");
        }

        const { ...result } = user;
        return result || {};
    }

    async validateEmailLogin(email: string, code: string) {
        // 1. 验证邮箱格式
        if (!this.isValidEmail(email)) {
            throw new UnauthorizedException("无效的邮箱格式");
        }

        // 2. 从redis获取验证码（假设已注入redisService）
        const storedCode = await this.redisService.get(`captcha_${email}`);
        if (!storedCode || storedCode !== code) {
            throw new UnauthorizedException("验证码错误或已过期");
        }

        // 3. 查找用户
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException("邮箱未注册");
        }

        return user || {};
    }

    private isValidEmail(email: string): boolean {
        // 简单的邮箱格式验证
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}
