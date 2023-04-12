import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateTextBlockDto } from './dto/create-text-block.dto';
import { FilterQuery } from './params/filter-query';
import { TextBlockService } from './text-block.service';

@Controller('text-block')
export class TextBlockController {
    constructor(private textBlockService: TextBlockService) {}

    @Roles('admin')
    @UseGuards(RolesGuard)
    @Post() // Эндпонит для добавления текствого блока
    @UseInterceptors(FileInterceptor('fileId')) // Декоратор, позволяющий загружать файлы
    async create(@Body() dto: CreateTextBlockDto, // Декоратор, позволяющий брать данные из тела 
                 @UploadedFile() file) { // Декоратор помечает загруженный файл
        return this.textBlockService.createTextBlock(dto, file)
    }

    @Get() // Эндпоинт для получения всех текстовых блоков
    async get(@Query() query: FilterQuery) { // Декоратор, позволяет брать [query] данные из строки запроса
        return this.textBlockService.getTextBlocks(query)
    }
    
    @Roles('admin')
    @UseGuards(RolesGuard)    
    @Put(':textBlockId') // Эндпоинт для изменения текстового блока
    @UseInterceptors(FileInterceptor('fileId'))
    async update(@Param('textBlockId') textBlockId: string, // Декоратор, позволяет брать [params] параметры из строки запроса
                 @Body() dto: CreateTextBlockDto,
                 @UploadedFile() file) {        
        return this.textBlockService.updateTextBlock(textBlockId, dto, file)
    }

    @Roles('admin')
    @UseGuards(RolesGuard)    
    @Patch('/file/:textBlockId') // Эндпоинт для удаления картинки из текстового блока
    async deleteFile(@Param('textBlockId') textBlockId: string) {
        return this.textBlockService.deleteTextBlockFile(textBlockId)
    }

    @Roles('admin')
    @UseGuards(RolesGuard)
    @Delete(':textBlockId') // Эндпоинт длу удаления текствого блока целиком
    async delete(@Param('textBlockId') textBlockId: string) {
        return this.textBlockService.deleteTextBlock(textBlockId)
    }
}
