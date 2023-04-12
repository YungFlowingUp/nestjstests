import { IsEmail, IsString, Length } from "class-validator";

// Схема для ввода данных в таблицу
export class CreateUserDto {
    @IsEmail({}, {message: 'Некорректный email'}) // Валидация данных
    readonly email: string;
    
    @IsString({message: 'Пароль должен быть строкой'}) // Валидация данных
    @Length(4, 16, {message: 'Пароль должен содержать от 4 до 16 символов'}) // Валидация данных
    readonly password: string;
}