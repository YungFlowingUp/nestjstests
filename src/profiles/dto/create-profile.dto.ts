import { IsISO8601, IsMobilePhone, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "../../users/dto/create-user.dto";

export class CreateProfileDto extends CreateUserDto {
    readonly userId: number;

    @IsOptional()
    @IsString()    
    readonly surname: string;

    @IsString()  
    readonly firstName: string; 
    
    @IsMobilePhone('ru-RU', {}, {message: 'Неправильный номер телефона'})
    readonly phone: string;

    @IsOptional()
    @IsISO8601({}, {message: 'Неправильный формат даты. Необходимый формат - [YEAR-MM-DD],[2000-01-20]'})
    readonly birthDate: string;
}