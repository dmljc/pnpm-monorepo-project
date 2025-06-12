// service：实现业务逻辑的地方，比如操作数据库等
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, In } from "typeorm";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { QueryDto } from "./dto/query-role.dto";
import { Role } from "./entities/role.entity";

// 假设 Like 是一个函数，用于创建包含通配符的查询条件
// 如果 Like 不是现成的函数，你可能需要自定义它
export function createLikeQuery(query) {
    return query ? `%${query.trim()}%` : `%%`;
}

@Injectable()
export class RoleService {
    @InjectRepository(Role)
    private roleRepository: Repository<Role>;

    async list(queryData: QueryDto) {
        const { name, code } = queryData;

        if (Object.keys(queryData).length < 3) {
            return await this.roleRepository.find();
        }
        // 使用 Like 操作符进行模糊查询
        return await this.roleRepository.find({
            where: {
                name: Like(createLikeQuery(name)),
                code: Like(createLikeQuery(code)),
            },
        });
    }

    async findRolesByIds(roleIds: number[]) {
        return this.roleRepository.find({
            where: {
                id: In(roleIds),
            },
            relations: {
                permissions: true,
            },
        });
    }

    async detail(id: number) {
        return await this.roleRepository.findOneBy({ id });
    }

    // async create(createRoleDto: CreateRoleDto) {
    //     return await this.roleRepository.save(createRoleDto);
    // }
    // ... existing code ...
    async create(createRoleDto: CreateRoleDto) {
        const role = new Role();
        role.name = createRoleDto.name; // 确保name被显式赋值
        role.code = createRoleDto.code;
        role.status = createRoleDto.status;
        role.remark = createRoleDto.remark;
        // ... 其他字段赋值 ...
        return await this.roleRepository.save(role);
    }

    async update(updateRoleDto: UpdateRoleDto) {
        return await this.roleRepository.update(
            updateRoleDto.id,
            updateRoleDto,
        );
    }

    async delete(id: number) {
        return await this.roleRepository.delete(id);
    }
}
