import { Injectable, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateProfileDto } from '../profiles/dto/create-profile.dto';
import { ProfileService } from '../profiles/profiles.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';  
import { User } from '../users/users.model';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtSecretKey } from './jwt-constraints';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {  
    constructor(private userService: UsersService, // Импорт Сервиса Пользоваетля для работы с его методами
                private profileService: ProfileService, // Импорт Сервиса Профиля
                private jwtService: JwtService, // Импорт JWT Сервиса для работы с его методами
                private roleService: RolesService) {} // Импорт Сервиса Ролей

    async register(dto: CreateProfileDto, userRole: string = "user") {       
        const preUser = await this.userService.getUserByEmail(dto.email);
        if (preUser) {
            throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(dto.password, 5); // Хэширование пароля
        const user = await this.userService.createUser({...dto, password: hashPassword}, userRole); // Создание пользователя
        await this.profileService.createProfile({...dto, userId: (await user).userId}); // Создание профиля с таким же id, что и user        
        return this.generateToken(user) 
    }

    async login(dto: CreateUserDto) {
        const user = await this.validateUser(dto);
        return this.generateToken(user)
    }
    
    // Генерация JWT токена
    private async generateToken(user: User) {
        const payload = {userId: user.userId, email: user.email, roles: user.roles} // Данные в входящие в JWT токен
        return {
            token: this.jwtService.sign(payload, {secret: JwtSecretKey.secret}) // Создание JWT токена доступа
        }
    }
   
    // Валидация пользователя
    private async validateUser(dto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(dto.email);
        const matchPasswords = await bcrypt.compare(dto.password, user.password); // Сравнение входящего пароля с хэшированным в бд 
        if (user && matchPasswords) {
            return user
        }
        throw new HttpException('Пользователь не найден или пароли не совпадают', HttpStatus.BAD_REQUEST)
    }

    // Создание основых ролей и администратора
    // Выполняется после запуска сервера
    async initializeRolesAndAdmin() {
        await this.roleService.craeteAdminAndUser();

        const admin = await this.register({
            userId: 1,
            email: "admin@mail.ru",
            password: "admin",
            surname: "ADMIN",
            firstName: "ADMIN",
            phone: "79111111111",
            birthDate: '2000-01-01'
        }, "admin");

        const logger = new Logger();
        logger.debug(`Создан администратор: userId: 1, email: "admin@mail.ru", password: "admin". TOKEN: ${admin.token}`);
    }
}
