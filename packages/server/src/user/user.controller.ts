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
} from "@nestjs/common";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { QueryDto } from "./dto/query-user.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Inject(JwtService)
    private jwtService: JwtService;

    // handler：控制器里处理路由的方法
    // @Post("register")
    // register(@Body() CreateUserDto: CreateUserDto) {
    //     return this.userService.register(CreateUserDto);
    // }
    @Post("login")
    async login(
        @Body() user: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const foundUser = await this.userService.login(user);

        if (foundUser) {
            const token = await this.jwtService.signAsync({
                user: {
                    id: foundUser.id,
                    username: foundUser.username,
                },
            });
            res.setHeader("Authorization", token);

            return {
                token,
            };
        } else {
            return "login fail";
        }
    }

    @Get("list")
    async list(@Query() queryData: QueryDto) {
        return this.userService.list(queryData);
    }

    @Get(":id")
    async detail(@Param("id") id: number) {
        return this.userService.detail(+id);
    }

    @Post("create")
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Put("update")
    async update(@Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(updateUserDto);
    }

    @Delete("delete/:id")
    async delete(@Param("id") id: string) {
        return this.userService.delete(+id);
    }
}
