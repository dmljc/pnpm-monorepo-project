import { HttpException, Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Menu } from "./entities/menu.entity";

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
    ) {}

    async create(createMenuDto: CreateMenuDto) {
        const existingMenu = await this.menuRepository.findOne({
            where: { label: createMenuDto.label },
        });
        // 仅类型为目录和菜单时候才需要判断
        if (existingMenu && ["catalog", "menu"].includes(createMenuDto.type)) {
            throw new HttpException("目录/菜单名称已存在", 400);
        }

        let parent = null;
        if (createMenuDto.parentId) {
            parent = await this.menuRepository.findOne({
                where: { id: createMenuDto.parentId },
            });
        }

        const menu = this.menuRepository.create({
            ...createMenuDto,
            parent: parent || null,
        });

        return await this.menuRepository.save(menu);
    }

    // 查询树形菜单
    async findAllAsTree(): Promise<Menu[]> {
        // 通过 manager 获取 TreeRepository 实例
        const treeRepo = this.menuRepository.manager.getTreeRepository(Menu);
        return treeRepo.findTrees();
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
