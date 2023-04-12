import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";

interface ProfileCreationAttrs {
    surname: string;
    firstName: string;
    phone: string;
    birthDate: string;
}

@Table({tableName: 'profile'})
export class Profile extends Model<Profile, ProfileCreationAttrs> {
    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, primaryKey: true})    
    userId: number;
    
    @Column({type: DataType.STRING})
    surname: string;

    @Column({type: DataType.STRING, allowNull: false})
    firstName: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    phone: string;

    @Column({type: DataType.DATEONLY})
    birthDate: string;    
}