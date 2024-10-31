// controller：控制器，用于处理路由，解析请求参数
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // handler：控制器里处理路由的方法
    @Post('register')
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.userService.register(registerUserDto);
    }
    @Post('login')
    login(@Body() loginUserDto: LoginUserDto) {
        return this.userService.login(loginUserDto);
    }
}
