// service：实现业务逻辑的地方，比如操作数据库等
import { Injectable, HttpException, Body } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm"; //Between
// import * as crypto from "crypto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginDto } from "./dto/login.dto";
import { QueryDto } from "./dto/query-user.dto";
import { User } from "./entities/user.entity";

// 假设 Like 是一个函数，用于创建包含通配符的查询条件
// 如果 Like 不是现成的函数，你可能需要自定义它
export function createLikeQuery(query) {
    return query ? `%${query.trim()}%` : `%%`;
}

// function md5(str) {
//     const hash = crypto.createHash("md5");
//     hash.update(str);
//     return hash.digest("hex");
// }

@Injectable()
export class UserService {
    @InjectRepository(User)
    private userRepository: Repository<User>;

    // async register(CreateUserDto: CreateUserDto) {
    //     const existUser = await this.userRepository.findOneBy({
    //         username: CreateUserDto.username,
    //     });

    //     if (existUser) {
    //         throw new HttpException("用户已注册", HttpStatus.OK);
    //     }
    //     return await this.userRepository.save(CreateUserDto);
    // }

    // 因为注入 response 对象之后，默认不会把返回值作为 body 了，需要设置 passthrough 为 true 才可以。
    async login(@Body() user: LoginDto) {
        const foundUser = await this.userRepository.findOne({
            where: { username: user.username },
            relations: ["roles"], // 关键：加载关联角色
        });

        if (!foundUser) {
            throw new HttpException("用户不存在", 200);
        }
        // if (foundUser.password !== md5(user.password)) {
        //     throw new HttpException("密码错误", 200);
        // }

        return foundUser;
    }

    async list(queryData: QueryDto) {
        const { username, name, phone } = queryData;
        // startTime, endTime

        // 使用 Like 操作符进行模糊查询
        return await this.userRepository.find({
            where: {
                username: Like(createLikeQuery(username)),
                name: Like(createLikeQuery(name)),
                phone: Like(createLikeQuery(phone)),
                // createTime: Between(startTime, endTime),
            },
            relations: ["roles"],
        });
    }

    async findUserById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
        });
    }

    async info(id: number) {
        return this.userRepository.findOne({
            where: { id },
            relations: ["roles"], // 关联角色信息
        });
    }

    async create(createUserDto: CreateUserDto) {
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
