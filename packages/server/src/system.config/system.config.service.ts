import { Injectable } from "@nestjs/common";
import { CreateSystemConfigDto } from "./dto/create-system.config.dto";
import { SystemConfig } from "./entities/system.config.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SystemConfigService {
    constructor(
        @InjectRepository(SystemConfig)
        private readonly menuRepository: Repository<SystemConfig>,
    ) {}

    async create(createSystemConfigDto: CreateSystemConfigDto) {
        const exist = await this.menuRepository.find();
        if (exist.length > 0) {
            return await this.menuRepository.update(
                exist[0].id,
                createSystemConfigDto,
            );
        } else {
            const systemConfig = this.menuRepository.create(
                createSystemConfigDto,
            );
            await this.menuRepository.save(systemConfig);
            return systemConfig;
        }
    }

    async detail() {
        const exist = await this.menuRepository.find();
        if (exist.length > 0) {
            return exist[0];
        }
        return null;
    }

    async remove(id: number) {
        return await this.menuRepository.delete(id);
    }
}
