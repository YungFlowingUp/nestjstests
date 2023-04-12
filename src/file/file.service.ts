import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { Files } from './file.model';
import { Op } from 'sequelize';

@Injectable()
export class FileService implements OnModuleInit {
    constructor(@InjectModel(Files) private fileRepresitory: typeof Files) {}

    // Метод вызывается при запуске сервера через час удаляет все лишнее файлы из бд. Работает с интервалом в 1 час
    async onModuleInit() {
        setInterval(() => this.checkFiles(),
        3.6e6);
    } 

    async createFile(file, essenceId: number, essenceTable): Promise<number> { 
        try {           
            const fileParser = file.originalname.split('.'); //////////////////////////////
            const fileType = fileParser[fileParser.length-1]; // Парсинг фалйа
            const fileName = uuid.v4() + '.' + fileType; /////////////////////////////////

            const filePath = path.resolve(__dirname, '..', 'static'); // Создание пути для сохранения файла
            if(!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true}); // Создание папки для хранения файлов
            }            
            fs.writeFileSync(path.join(filePath, fileName), file.buffer); // Запись данных из файла

            const dto = {
                fileName,
                filePath,
                essenceTable,
                essenceId
            };
            
            const createdFile = await this.fileRepresitory.create(dto); // Добавления сведений о файле в бд           
            
            return createdFile.fileId
        } catch (e) {
            throw new HttpException('Произошла ошибка при загрузке файла', HttpStatus.REQUEST_TIMEOUT)
        }
    }

    // При изменении блоков имеющих ссылку на файл
    async updateFile(fileId: number) {
        const prevFile = await this.fileRepresitory.update(
                                {essenceTable: null, essenceId: null}, // Установка полей essenceTable и essenceId 
                                {where: {fileId}});                    // в null-значения
        return Boolean(prevFile)                                                                                      
    }

    // Проверка неиспользуемых файлов в бд
    async checkFiles() {
        try {
            const start = Date.now();
            const deletedFiles = await this.fileRepresitory.destroy({where: 
                                                {[Op.or]: [ // Оператор OR
                                                    {essenceTable: null}, {essenceId: null}
                                                ]}
                                            });
            const end = (Date.now() - start) / 1000;
            console.log(`Удаление неиспользуемых файлов [${deletedFiles}] заняло ${end} секунд`);
            return deletedFiles
        } catch (e) {
            console.log(e);            
        }
        
    }
}
