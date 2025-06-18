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

    // constructor(private authService: AuthService) {}
    constructor(private readonly userService: UserService) {}

    @RequireLogin(false)
    @UseGuards(AuthGuard("local")) // 使用 LocalStrategy
    @Post("login")
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const user = await this.userService.login(req.user);
        if (user.status === 0) {
            throw new UnauthorizedException("用户已被禁用");
        }

        const access_token = this.jwtService.sign(
            {
                user: {
                    id: user.id,
                    username: user.username,
                    user,
                },
            },
            { expiresIn: "50m" },
        );
        res.setHeader("Authorization", access_token);

        const refresh_token = this.jwtService.sign(
            {
                user: {
                    id: user.id,
                },
            },
            {
                expiresIn: "150m",
            },
        );

        return {
            access_token,
            refresh_token,
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
    async githubCallback(@Req() req) {
        console.log("---callback--req.user----", req.user);
        return this.userService.findUserByGithubId(req.user.id);
        // return req.user;
    }

    // google 登录
    @Get("google/login")
    @UseGuards(AuthGuard("google"))
    async googleLogin() {}

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    googleCallback(@Req() req, @Res() res) {
        console.log("--googleCallback----", req.user);
        if (!req.user) throw new UnauthorizedException();

        // 返回 JSON 数据
        res.json(req.user);
    }
}
