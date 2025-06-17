// service：实现业务逻辑的地方，比如操作数据库等
import { Injectable, HttpException, Body, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like } from "typeorm"; //Between
// import * as crypto from "crypto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginDto } from "./dto/login.dto";
import { QueryDto } from "./dto/query-user.dto";
import { User } from "./entities/user.entity";
import { RedisService } from "../redis/redis.service";

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

    @Inject("REDIS_CLIENT")
    private redisService: RedisService;

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

        const users = await this.userRepository.find({
            where: {
                username: Like(createLikeQuery(username)),
                name: Like(createLikeQuery(name)),
                phone: Like(createLikeQuery(phone)),
            },
            relations: ["roles"],
            order: {
                updateTime: "DESC", // 默认按更新时间倒序
            },
        });

        // 只返回前端需要的字段，避免 roles 字段污染 status
        return users.map((user) => ({
            id: user.id,
            role: user.role,
            avatar: user.avatar,
            username: user.username,
            name: user.name,
            password: user.password,
            phone: user.phone,
            email: user.email,
            status: user.status,
            remark: user.remark,
            createTime: user.createTime,
            updateTime: user.updateTime,
            roles: user.roles,
        }));
    }

    async findUserById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
        });
    }

    async findUserByUserName(username: string) {
        return await this.userRepository.findOne({
            where: { username },
        });
    }

    async findUserByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email },
            relations: ["roles"],
        });
    }

    async findUserByGithubId(id: string) {
        console.log("----id----", id);
        return await this.userRepository.findOne({
            // where: { id },
        });
    }

    async info(id: number) {
        return this.userRepository.findOne({
            where: { id },
            relations: ["roles"], // 关联角色信息
        });
    }

    async create(createUserDtos: CreateUserDto | CreateUserDto[]) {
        if (Array.isArray(createUserDtos)) {
            // 批量创建时检查每个用户是否已存在
            const usersToSave = [];
            for (const dto of createUserDtos) {
                const existingUser = await this.userRepository.findOne({
                    where: { username: dto.username },
                });
                if (!existingUser) {
                    usersToSave.push(dto);
                }
            }
            return await this.userRepository.save(usersToSave);
        } else {
            // 单个创建时检查用户是否已存在
            const existingUser = await this.userRepository.findOne({
                where: { username: createUserDtos.username },
            });
            if (existingUser) {
                throw new HttpException("用户已存在", 400);
            }
            return await this.userRepository.save(createUserDtos);
        }
    }

    async update(updateUserDto: UpdateUserDto) {
        return await this.userRepository.save(updateUserDto);
    }

    async delete(id: number) {
        return await this.userRepository.delete(id);
    }

    async freeze(id: number, status: number) {
        return await this.userRepository.update(id, {
            status,
        });
    }
}
