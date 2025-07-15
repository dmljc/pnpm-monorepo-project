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
    HttpStatus,
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
import { ApiBody, ApiOperation, ApiTags, ApiResponse } from "@nestjs/swagger";
import { UserDetailVo } from "./vo/user.info.vo";

@ApiTags("用户模块")
@Controller("user")
export class UserController {
    @Inject(JwtService)
    private jwtService: JwtService;
    constructor(private readonly userService: UserService) {}

    // 用户名密码登录
    @ApiOperation({ summary: "登录接口" })
    @ApiBody({
        type: LoginDto,
        examples: {
            登录成功: {
                value: {
                    username: "zfcstring",
                    password: "999999",
                },
            },
        },
    })
    @RequireLogin(false)
    @Post("login")
    async login(
        @Body() loginUser: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = await this.userService.login(loginUser);

        if (user) {
            const accessToken = this.jwtService.sign(
                {
                    user: {
                        id: user.id,
                        username: user.username,
                        user,
                    },
                },
                { expiresIn: "5m" },
            );
            res.setHeader("Authorization", accessToken);

            const refreshToken = this.jwtService.sign(
                {
                    user: {
                        id: user.id,
                    },
                },
                {
                    expiresIn: "15m",
                },
            );

            return {
                accessToken,
                refreshToken,
            };
        } else {
            return "login fail";
        }
    }

    @Get("refresh")
    async refresh(@Query("refreshToken") refreshToken: string) {
        try {
            const data = this.jwtService.verify(refreshToken);

            const user = await this.userService.findUserById(data.id);

            const accessToken = this.jwtService.sign(
                {
                    id: user.id,
                },
                { expiresIn: "5m" },
            );

            const refreshTokenNew = this.jwtService.sign(
                {
                    id: user.id,
                },
                { expiresIn: "7d" },
            );

            return {
                accessToken,
                refreshToken: refreshTokenNew,
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

    @ApiResponse({
        status: HttpStatus.OK,
        description: "success",
        type: UserDetailVo,
    })
    @Get("info")
    @RequireLogin()
    async info(@Request() req) {
        const user = await this.userService.info(req.user.id);
        const vo = new UserDetailVo();

        vo.id = user.id;
        vo.username = user.username;
        vo.name = user.name;
        vo.phone = user.phone;
        vo.email = user.email;
        vo.status = user.status;
        vo.remark = user.remark;
        vo.avatar = user.avatar;
        vo.role = user.role;
        return vo;
    }

    @Post("create")
    @RequireLogin()
    async create(@Body() createUserDtos: CreateUserDto[]) {
        return this.userService.create(createUserDtos);
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

    @Get("freeze")
    @RequireLogin()
    async freeze(@Query("id") id: number, @Query("status") status: number) {
        return this.userService.freeze(+id, status);
    }
}
