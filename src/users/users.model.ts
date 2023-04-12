import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Role } from "../roles/roles.model";
import { UserRole } from "../roles/users-roles.model";

// Интерфейс для заполения таблицы
interface UserCreationAttrs {
    email: string;
    password: string;
}

// Создание таблицы
@Table({tableName: 'user'})
export class User extends Model<User, UserCreationAttrs> {       
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true}) // Первичный ключ, автоинкрементируемый    
    userId: number;
    
    @Column({type: DataType.STRING, unique: true, allowNull: false}) // Уникальное и ненулевое поле
    email: string;

    @Column({type: DataType.STRING, allowNull: false}) // Ненулевое поле
    password: string;
    
    @BelongsToMany(() => Role, () => UserRole) // Связь n : n
    roles: Role[]; // Массив, хранящий в себе роли данного пользователя
}