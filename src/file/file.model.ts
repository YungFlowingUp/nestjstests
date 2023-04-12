import { Column, DataType, Model, Table } from "sequelize-typescript";

interface FilesCreationAttrs {
    fileName: string;
    filePath: string;
    essenceTable: string;
    essenceId: number;
}

// Создание отдельной таблицы для хранения информации о файлах (ссылка на сам файл, связанные таблицы, название)
@Table({tableName: 'files', updatedAt: false})
export class Files extends Model<Files, FilesCreationAttrs> {       
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true})    
    fileId: number;
    
    @Column({type: DataType.STRING, allowNull: false})
    fileName: string;

    @Column({type: DataType.STRING})
    filePath: string;

    @Column({type: DataType.STRING})
    essenceTable: string;

    @Column({type: DataType.INTEGER})
    essenceId: number;    
}