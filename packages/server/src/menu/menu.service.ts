import { Injectable } from "@nestjs/common";
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
        const menu = new Menu();
        menu.type = createMenuDto.type;
        menu.name = createMenuDto.name;
        menu.url = createMenuDto.url;
        return await this.menuRepository.save(menu);
    }

    findAll() {
        return `This action returns all menu`;
    }

    findOne(id: number) {
        return `This action returns a #${id} menu`;
    }

    update(id: number, updateMenuDto: UpdateMenuDto) {
        console.log("updateMenuDto", updateMenuDto);
        return `This action updates a #${id} menu`;
    }

    remove(id: number) {
        return `This action removes a #${id} menu`;
    }
}
