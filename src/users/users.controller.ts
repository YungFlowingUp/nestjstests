import { Body, Controller, Post, UseGuards, UsePipes} from '@nestjs/common';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AddRoleToUserDto } from './dto/add-role-to-user.dto';
import { UsersService } from './users.service';
import { ValidationPipe } from '../pipes/validation.pipe';

@Controller('user') // Декоратор, который определяет класс контроллером
export class UsersController {
    constructor(private userService: UsersService) {} // Определяем поле класса как сервис, чтобы использовать его методы

    @Roles('admin') // Декоратор для объявления допустимых ролей для этого метода
    @UseGuards(RolesGuard) // Проверка роли
    @UsePipes(ValidationPipe) // Валидация данных
    @Post('/role') // Эндпоинт => /user/role
    async addRole(@Body() addRoleDto: AddRoleToUserDto) {
        return this.userService.addRoleToUser(addRoleDto)
    }
}
