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
        private menuRepository: Repository<Menu>,
    ) {}

    async create(createMenuDto: CreateMenuDto) {
        const existingMenu = await this.menuRepository.findOne({
            where: { name: createMenuDto.name },
        });
        if (existingMenu) {
            throw new HttpException("菜单已存在", 400);
        }
        return await this.menuRepository.insert(createMenuDto);
    }

    async findAll() {
        return await this.menuRepository.find();
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
