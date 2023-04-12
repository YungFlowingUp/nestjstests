import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Files } from "../file/file.model";

interface TextBlockCreationAttrs {
    uniqueName: string;
    title: string;
    text: string;    
    group: string;
    fileId: number;    
}

@Table({tableName: 'text_block'})
export class TextBlock extends Model<TextBlock, TextBlockCreationAttrs> {       
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true})    
    textBlockId: number;
    
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    uniqueName: string;

    @Column({type: DataType.STRING, allowNull: false})
    title: string;

    @Column({type: DataType.STRING})
    text: string;  
        
    @Column({type: DataType.STRING})
    group: string;

    @ForeignKey(() => Files) // Внешний ключ
    @Column({type: DataType.INTEGER})
    fileId: number;
}