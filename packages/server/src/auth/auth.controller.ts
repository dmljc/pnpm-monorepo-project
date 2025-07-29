import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    Inject,
    Request,
    UseGuards,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
// import { AuthService } from "./auth.service";
import { RequireLogin } from "../common/custom-decorator";
import { UserService } from "../user/user.service";

@Controller("auth")
export class AuthController {
    @Inject(JwtService)
    private jwtService: JwtService;

    constructor(private readonly userService: UserService) {}

    @RequireLogin(false)
    @UseGuards(AuthGuard("local")) // 使用 LocalStrategy
    @Post("login")
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const user = await this.userService.login(req.user);
        if (user.status === 0) {
            throw new UnauthorizedException("用户已被禁用");
        }

        const accessToken = this.jwtService.sign(
            {
                user: {
                    id: user.id,
                    username: user.username,
                    user,
                },
            },
            { expiresIn: "50s" },
        );
        res.setHeader("Authorization", accessToken);

        const refreshToken = this.jwtService.sign(
            {
                user: {
                    id: user.id,
                },
            },
            {
                expiresIn: "150s",
            },
        );

        return {
            accessToken,
            refreshToken,
            userInfo: user,
        };
    }

    // github 登录
    @Get("github/login")
    @UseGuards(AuthGuard("github"))
    async githubLogin() {
        // 这个路由会自动触发 Passport 的 302 重定向到 GitHub
    }

    @Get("github/callback")
    @UseGuards(AuthGuard("github"))
    async githubCallback() {
        return this.userService.findUserByGithubId();
        // return req.user;
    }

    // google 登录
    @Get("google/login")
    @UseGuards(AuthGuard("google"))
    async googleLogin() {}

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    googleCallback(@Req() req, @Res() res) {
        if (!req.user) throw new UnauthorizedException();

        // 返回 JSON 数据
        res.json(req.user);
    }
}
