import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: "login", // 支持用户名或邮箱
            passwordField: "code", // 支持密码或验证码
        });
    }

    async validate(login: string, code: string) {
        try {
            // 判断是邮箱登录还是用户名密码登录
            if (login.includes("@")) {
                // 邮箱验证码登录
                return await this.authService.validateEmailLogin(login, code);
            } else {
                // 用户名密码登录
                return await this.authService.validateUser(login, code);
            }
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}
