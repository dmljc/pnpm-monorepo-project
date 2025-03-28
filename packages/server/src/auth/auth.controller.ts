import {
    Controller,
    Post,
    Request,
    UseGuards,
    Inject,
    Res,
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
        if (user) {
            const access_token = this.jwtService.sign(
                {
                    user: {
                        id: user.id,
                        username: user.username,
                        user,
                    },
                },
                { expiresIn: "30s" },
            );
            res.setHeader("Authorization", access_token);

            const refresh_token = this.jwtService.sign(
                {
                    user: {
                        id: user.id,
                    },
                },
                {
                    expiresIn: "10m",
                },
            );

            return {
                access_token,
                refresh_token,
            };
        } else {
            return "login fail";
        }
    }
}
