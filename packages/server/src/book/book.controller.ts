import {
    Controller,
    UseInterceptors,
    // FileInterceptor,
    BadRequestException,
    UploadedFile,
    Get,
    Query,
    Post,
    Put,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { storage } from '../utils';

const path = require('path');

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            dest: 'uploads',
            storage: storage,
            limits: {
                fileSize: 1024 * 1024 * 3,
            },
            fileFilter(req, file, callback) {
                const extname = path.extname(file.originalname);
                if (['.png', '.jpg', '.gif'].includes(extname)) {
                    callback(null, true);
                } else {
                    callback(new BadRequestException('只能上传图片'), false);
                }
            },
        }),
    )
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        // console.log('file', file);
        // return file.path;
        return 'uploads/' + file.filename;
    }

    @Get('list')
    async list(@Query('name') name: string) {
        return this.bookService.list(name);
    }

    @Get(':id')
    async detail(@Param('id') id: number) {
      return this.bookService.detail(+id);
    }

    @Post('create')
    async create(@Body() createBookDto: CreateBookDto) {
        return this.bookService.create(createBookDto);
    }

    @Put('update')
    async update(@Body() updateBookDto: UpdateBookDto) {
      return this.bookService.update(updateBookDto);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
      return this.bookService.delete(+id);
    }
}
