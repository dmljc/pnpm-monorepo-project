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
            await this.menuRepository.update(
                exist[0].id,
                createSystemConfigDto,
            );
            // 更新后查一次
            const updated = await this.menuRepository.findOneBy({
                id: exist[0].id,
            });
            return updated;
        } else {
            const systemConfig = this.menuRepository.create(
                createSystemConfigDto,
            );
            const saved = await this.menuRepository.save(systemConfig);
            return saved;
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
