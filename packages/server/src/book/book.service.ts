import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Book } from './entities/book.entity';

// 假设 Like 是一个函数，用于创建包含通配符的查询条件  
// 如果 Like 不是现成的函数，你可能需要自定义它  
export function createLikeQuery(name) {
    return `%${name.trim()}%`;
}

@Injectable()
export class BookService {
    @InjectRepository(Book)
    private bookRepository: Repository<Book>;

    async list(name?: string) {
        // 如果 name 为空字符串（或未定义、null等，根据实际需求调整），则不进行模糊查询  
        if (!name || name.trim() === '') {
            return await this.bookRepository.find();
        }

        // 使用 Like 操作符进行模糊查询  
        const query = {
            where: {
                name: Like(createLikeQuery(name))
            },
        };
        return await this.bookRepository.find(query);
    }

    async detail(id: number) {
        return await this.bookRepository.findOneBy({ id });
    }

    async create(createBookDto: CreateBookDto) {
        return await this.bookRepository.save(createBookDto);
    }

    async update(updateBookDto: UpdateBookDto) {
        await this.bookRepository.update(updateBookDto.id, updateBookDto)
        return null;
    }

    async delete(id: number) {
        return await this.bookRepository.delete(id);
    }
}
