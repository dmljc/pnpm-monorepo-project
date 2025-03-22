import {
    Controller,
    Get,
    Query,
    Post,
    Put,
    Body,
    Param,
    Delete,
    Res,
    Inject,
    Request,
    UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { QueryDto } from "./dto/query-user.dto";
import { LoginDto } from "./dto/login.dto";
import { RequireLogin } from "../common/custom-decorator";

@Controller("user")
export class UserController {
    @Inject(JwtService)
    private jwtService: JwtService;
    constructor(private readonly userService: UserService) {}

    @RequireLogin(false)
    @Post("login")
    async login(
        @Body() loginUser: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.userService.login(loginUser);

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

    @Get("refresh")
    async refresh(@Query("refresh_token") refreshToken: string) {
        try {
            const data = this.jwtService.verify(refreshToken);

            const user = await this.userService.findUserById(data.id);

            const access_token = this.jwtService.sign(
                {
                    id: user.id,
                    username: user.username,
                    user,
                },
                {
                    expiresIn: "30s",
                },
            );

            const refresh_token = this.jwtService.sign(
                {
                    id: user.id,
                },
                {
                    expiresIn: "10m",
                },
            );

            return {
                access_token,
                refresh_token,
            };
        } catch {
            throw new UnauthorizedException("token 已失效，请重新登录");
        }
    }

    @Get("list")
    @RequireLogin()
    async list(@Query() queryData: QueryDto) {
        return this.userService.list(queryData);
    }

    @Get("info")
    @RequireLogin()
    async info(@Request() req) {
        return this.userService.info(req.user.id);
    }

    @Post("create")
    @RequireLogin()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Put("update")
    @RequireLogin()
    async update(@Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(updateUserDto);
    }

    @Delete("delete/:id")
    @RequireLogin()
    async delete(@Param("id") id: string) {
        return this.userService.delete(+id);
    }
}
