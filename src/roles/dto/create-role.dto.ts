import { IsOptional, IsString } from "class-validator";

export class CreateRoleDto {
    @IsString({message: 'Должно быть строкой'})
    readonly roleName: string;

    @IsOptional()
    @IsString({message: 'Должно быть строкой'})
    readonly description: string;
}