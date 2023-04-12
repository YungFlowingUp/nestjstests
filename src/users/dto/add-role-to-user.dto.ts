import { IsNumber, IsString } from "class-validator";

// Схема
export class AddRoleToUserDto {
    @IsString({message: 'Роль должна быть строкой'})
    readonly roleName: string;
    
    @IsNumber({}, {message: 'Id пользователя должно быть числом'})
    readonly userId: number;
}