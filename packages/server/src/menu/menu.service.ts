import { HttpException, Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { TreeRepository, Repository } from "typeorm";
import { Menu } from "./entities/menu.entity";

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
        // 注入 TreeRepository（关键！）
        private readonly treeRepository: TreeRepository<Menu>,
    ) {}

    async create(createMenuDto: CreateMenuDto) {
        const existingMenu = await this.menuRepository.findOne({
            where: { name: createMenuDto.name },
        });
        if (existingMenu) {
            throw new HttpException("目录/菜单名称已存在", 400);
        }
        return await this.menuRepository.insert(createMenuDto);
    }

    // 查询树形菜单（关键修改点）
    async findAllAsTree(): Promise<Menu[]> {
        // 使用 TreeRepository 的 findTrees() 方法，直接返回嵌套树形结构
        return this.treeRepository.findTrees();
    }

    async findOne(id: number) {
        return await this.menuRepository.findOneBy({ id });
    }

    async update(updateMenuDto: UpdateMenuDto) {
        return await this.menuRepository.update(
            updateMenuDto.id,
            updateMenuDto,
        );
    }

    async remove(id: number) {
        return await this.menuRepository.delete(id);
    }
}
