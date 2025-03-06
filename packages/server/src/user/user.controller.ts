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
        @Body() user: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const foundUser = await this.userService.login(user);

        if (foundUser) {
            const token = await this.jwtService.sign({
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
    @RequireLogin()
    async list(@Query() queryData: QueryDto) {
        return this.userService.list(queryData);
    }

    @Get("info")
    @RequireLogin()
    async info(@Request() req) {
        return this.userService.info(req.user.sub);
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
