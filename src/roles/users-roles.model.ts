import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { Role } from "./roles.model";

@Table({tableName: 'user_role', createdAt: false, updatedAt: false})
export class UserRole extends Model<UserRole> { 
    @ForeignKey(() => User)   
    @Column({type: DataType.INTEGER, primaryKey: true})    
    userId: number;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER, primaryKey: true})
    roleId: number;    
}