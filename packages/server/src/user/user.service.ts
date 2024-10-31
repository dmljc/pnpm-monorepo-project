// service：实现业务逻辑的地方，比如操作数据库等
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    @InjectRepository(User)
    private userRepository: Repository<User>;

    async register(registerUserDto: RegisterUserDto) {
        const existUser = await this.userRepository.findOneBy({
            username: registerUserDto.username,
        });

        if (existUser) {
            throw new HttpException('用户已注册', HttpStatus.OK);
        }
        return await this.userRepository.save(registerUserDto);
    }

    async login (loginUserDto: LoginUserDto) {
        const existUser = await this.userRepository.findOneBy({
            username: loginUserDto.username,
        });

        if (!existUser) {
            throw new HttpException('用户未注册', HttpStatus.FORBIDDEN);
        }

        if (loginUserDto.password !== existUser.password) {
            throw new HttpException('密码不正确', HttpStatus.OK);
        }

    }
}
