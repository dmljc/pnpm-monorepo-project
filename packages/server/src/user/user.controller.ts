import {
    Controller,
    Get,
    Query,
    Post,
    Put,
    Body,
    Param,
    Delete,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    // handler：控制器里处理路由的方法
    @Post("register")
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.userService.register(registerUserDto);
    }
    @Post("login")
    login(@Body() loginUserDto: LoginUserDto) {
        return this.userService.login(loginUserDto);
    }

    @Get("list")
    async list(@Query() queryData: QueryUserDto) {
        return this.userService.list(queryData);
    }

    @Get(":id")
    async detail(@Param("id") id: number) {
        return this.userService.detail(+id);
    }

    @Post("create")
    async create(@Body() createUserDto: RegisterUserDto) {
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
