import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProfileDto } from '../profiles/dto/create-profile.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleToUserDto } from './dto/add-role-to-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable() // Декоратор, который определяет класс провайдером | сервисом
export class UsersService {
    constructor(@InjectModel(User) private userRepository: typeof User, // Добовляем репозиторий как поле класса
                private roleService: RolesService) {} // Импорт Сервиса Ролей для работы с его методами 

    // Создание user'a
    async createUser(dto: CreateUserDto, defaultRole: string = "user") {
        const user = await this.userRepository.create(dto); // Создаем пользователя
        const role = await this.roleService.getRoleByName(defaultRole); // Получаем роль по названию
        await user.$set("roles", [role.roleId]); // Кладем в массив ролей роль пользователя 
        user.roles = [role]; // Обновляем значение переменной user, для вывода вместе с данными о роли 
        return user    
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}}); // {include: {all: true} - Получение всех зависимостей 
        return users                                                             // внутри пользователя
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user
    }

    async getUserById(userId, isAdmin: boolean) {
        const user = await this.userRepository.findByPk(userId, {include: {all: true}});
        if (isAdmin) {
            delete user.password; // Убираем пароль, так как этот метод может использовать только админ, а он не имеет доступ к паролю
        }
        return user
    }

    // Добавить роль пользователю
    async addRoleToUser(addRoleDto: AddRoleToUserDto) {
        const user = await this.userRepository.findByPk(addRoleDto.userId, {include: {all: true}});        
        const role = await this.roleService.getRoleByName(addRoleDto.roleName);        
        if (user && role) { 
            await user.$add('roles', role.roleId); // Добавление в массив с ролями новой роли        
            return addRoleDto
        }
        throw new HttpException('Такого пользователя или роли не существует', HttpStatus.NOT_FOUND)
    }

    async updateUser(dto: CreateProfileDto) {            
        const updatedUser = await this.userRepository.update({...dto}, {where: {userId: dto.userId}, returning: true})
        return updatedUser
    }

    async deleteUser(userId: number) {
        const deletedUser = await this.userRepository.destroy({where: {userId}})
        return deletedUser
    }
}
