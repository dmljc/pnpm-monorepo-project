// service：实现业务逻辑的地方，比如操作数据库等
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm";
import { RegisterUserDto } from "./dto/register-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { User } from "./entities/user.entity";

// 假设 Like 是一个函数，用于创建包含通配符的查询条件
// 如果 Like 不是现成的函数，你可能需要自定义它
export function createLikeQuery(query) {
    return query?.length ? `%${query.trim()}%` : `%%`;
}
@Injectable()
export class UserService {
    @InjectRepository(User)
    private userRepository: Repository<User>;

    async register(registerUserDto: RegisterUserDto) {
        const existUser = await this.userRepository.findOneBy({
            username: registerUserDto.username,
        });

        if (existUser) {
            throw new HttpException("用户已注册", HttpStatus.OK);
        }
        return await this.userRepository.save(registerUserDto);
    }

    async login(loginUserDto: LoginUserDto) {
        const existUser = await this.userRepository.findOneBy({
            username: loginUserDto.username,
        });

        if (!existUser) {
            throw new HttpException("用户未注册", HttpStatus.FORBIDDEN);
        }

        if (loginUserDto.password !== existUser.password) {
            throw new HttpException("密码不正确", HttpStatus.OK);
        }
    }

    async list(queryData: QueryUserDto) {
        const { username, name, phone, email, id_card } = queryData;
        if (Object.keys(queryData).length < 3) {
            return await this.userRepository.find();
        }
        // 使用 Like 操作符进行模糊查询
        const query = {
            where: {
                username: Like(createLikeQuery(username)),
                name: Like(createLikeQuery(name)),
                phone: Like(createLikeQuery(phone)),
                email: Like(createLikeQuery(email)),
                id_card: Like(createLikeQuery(id_card)),
            },
        };
        return await this.userRepository.find(query);
    }

    async detail(id: number) {
        return await this.userRepository.findOneBy({ id });
    }

    async create(createUserDto: RegisterUserDto) {
        return await this.userRepository.save(createUserDto);
    }

    async update(updateUserDto: UpdateUserDto) {
        return await this.userRepository.update(
            updateUserDto.id,
            updateUserDto,
        );
    }

    async delete(id: number) {
        return await this.userRepository.delete(id);
    }
}
