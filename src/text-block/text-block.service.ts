import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileService } from '../file/file.service';
import { CreateTextBlockDto } from './dto/create-text-block.dto';
import { FilterQuery } from './params/filter-query';
import { TextBlock } from './text-block.model';

@Injectable()
export class TextBlockService {   
    constructor(@InjectModel(TextBlock) private textBlockRepository: typeof TextBlock, // Добовляем репозиторий как поле класса
                private fileService: FileService) {} // Импорт Сервиса Пользоваетля для работы с его методами

    async createTextBlock(dto: CreateTextBlockDto, file) {
        const textBlock = await this.textBlockRepository.create({...dto}); // Если файла нет

        if (file) { // Если файл пришел в запросе
            const tableName = this.textBlockRepository.getTableName(); // Получение названия таблицы, где будет использоваться этот файл
            const fileId = await this.fileService.createFile(file, textBlock.textBlockId, tableName); // Вызов метода файл сервиса, создающего файл
                                                                                                      // И возвращающего его id
            await this.textBlockRepository.update({fileId}, {where: {textBlockId: textBlock.textBlockId}}); // Добавление файла в текстовый блок           
            textBlock.fileId = fileId; // Для красивого вывода

            return textBlock
        }        
        return textBlock        
    }    

    async getTextBlocks(query?: FilterQuery) {
        // Условия есть ли query параметры и какие          
        if (!query.group && !query.uniqueName) { 
            const textBlocks = await this.textBlockRepository.findAll();
            return textBlocks
        }
        if (!query.uniqueName) {
            const textBlocks = await this.textBlockRepository.findAll({where: {group: query.group}}); // Фильтрация по группе
            return textBlocks
        }
        if (!query.group) {
            const textBlock = await this.textBlockRepository.findOne({where: {uniqueName: query.uniqueName}});
            return textBlock
        }
        const textBlock = await this.textBlockRepository.findOne({where: {uniqueName: query.uniqueName, 
                                                                          group: query.group}});
        return textBlock
    }

    async updateTextBlock(textBlockId: string, dto: CreateTextBlockDto, file) {
        if (!textBlockId) {
            throw new HttpException('Вы не ввели id текстового блока', HttpStatus.BAD_REQUEST)
        }
        
        const isUniqueNameAlreadyExists = await this.textBlockRepository.findOne(       // Проверка есть ли уже запись с таким uniqueName  
                                                {where: {uniqueName: dto.uniqueName}});   
        if (isUniqueNameAlreadyExists) {            
            throw new HttpException('Блок с таким именем уже существует', HttpStatus.NOT_ACCEPTABLE)
        }

        if (file) {
            const prevFileId = await this.getTextBlockFileId(textBlockId); // id Предыдущего файла в этом текством блоке
            await this.fileService.updateFile(prevFileId); // Убираем связь с этим блоком у файла, что использовался в этом текстовом блоке до

            const tableName = this.textBlockRepository.getTableName(); // Получение названия таблицы, где будет использоваться этот файл            
            const fileId = await this.fileService.createFile(file, Number(textBlockId), tableName); // Вызов метода файл сервиса, создающего файл
                                                                                                    // И возвращающего его id 
            const updatedTextBlockWImage = await this.textBlockRepository.update({...dto, fileId: fileId}, 
                {where: {textBlockId}, returning: true});

            return updatedTextBlockWImage
        }    

        const updatedTextBlock = await this.textBlockRepository.update({...dto}, 
                {where: {textBlockId}, returning: true});
        
        return updatedTextBlock
    }

    async deleteTextBlockFile(textBlockId: string) {
        if (!textBlockId) {
            throw new HttpException('Вы не ввели id текстового блока', HttpStatus.BAD_REQUEST)
        }

        const prevFileId = await this.getTextBlockFileId(textBlockId);
        await this.fileService.updateFile(prevFileId);

        const updatedTextBlock = await this.textBlockRepository.update({fileId: null}, 
                                       {where: {textBlockId}, returning: true});
        return updatedTextBlock
    } 

    async deleteTextBlock(textBlockId: string) {
        if (!textBlockId) {
            throw new HttpException('Вы не ввели id текстового блока', HttpStatus.BAD_REQUEST)
        }

        const prevFileId = await this.getTextBlockFileId(textBlockId); // id Предыдущего файла в этом текством блоке
        await this.fileService.updateFile(prevFileId); // Убираем связь с этим блоком у файла, что использовался в этом текстовом блоке до

        const deletedTextBlock = await this.textBlockRepository.destroy({where: {textBlockId}});
        return deletedTextBlock
    }

    private async getTextBlockFileId (textBlockId: string): Promise<number> {
        const textBlockFileId = await this.textBlockRepository.findOne({where: {textBlockId}});
        return textBlockFileId.fileId
    }
}
