import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { UserRole } from "./users-roles.model";

interface RoleCreationAttrs {
    roleName: string;
    description: string;    
}

@Table({tableName: 'role', createdAt: false, updatedAt: false})
export class Role extends Model<Role, RoleCreationAttrs> {    
    @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true})    
    roleId: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    roleName: string;

    @Column({type: DataType.STRING})
    description: string;  
    
    @BelongsToMany(() => User, () => UserRole) // Связь n : n
    users: User[];
}