import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UsersService } from '../users/users.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Profile } from './profiles.model';
import * as bcrypt from 'bcryptjs'; 
import { JwtService } from '@nestjs/jwt';
import { JwtSecretKey } from '../auth/jwt-constraints';
import { HttpException } from '@nestjs/common/exceptions';

@Injectable()
export class ProfileService {
    constructor(@InjectModel(Profile) private profileRepository: typeof Profile, // Добовляем репозиторий как поле класса
                private userService: UsersService, // Импорт Сервиса Пользоваетля для работы с его методами
                private jwtService: JwtService) {} // Импорт JWT Сервиса для работы с его методами

    // Создание профиля
    async createProfile(dtoProfile: CreateProfileDto) {
        const profile = await this.profileRepository.create(dtoProfile);
        return profile
    }   

    // Получение всех профилей
    async getAllProfiles() {
        const allProfiles = await this.profileRepository.findAll();
        return allProfiles
    }

    // Получение профиля по id
    async getById(userId: number) {
        const isAdmin = true; // Аргумент для функции в userService true, т.к. этим методом может пользоваться только админ
                              // Посколько isAdmin = true, пароль не вернется из getUserById()
        const profile = await this.profileRepository.findByPk(userId);
        const user = await this.userService.getUserById(userId, isAdmin);
        return {profile, user}
    }

    // Метод только для совего аккаунта
    async getYourAcc(headers: any) {
        const isAdmin = false;

        const authHeader = headers.authorization;
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1]; // Поулчение JWT токена из headers.authorization                   
             
        if (bearer !== "Bearer" || !token) {                
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
            
        const userHeader = this.jwtService.verify(token, {secret: JwtSecretKey.secret}); // Расшифровка

        const profile = await this.profileRepository.findByPk(userHeader.userId); // Получение profile по данным из JWT токена
        const user = await this.userService.getUserById(userHeader.userId, isAdmin); // Получение user по данным из JWT токена
        
        return {profile, user}
    }

    async updateProfile(headers, dto: CreateProfileDto) {        
        const authHeader = headers.authorization;
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1]; // Поулчение JWT токена из headers.authorization                     
             
        if (bearer !== "Bearer" || !token) {                
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
            
        const user = this.jwtService.verify(token, {secret: JwtSecretKey.secret}); // Расшифровка

        if (user.userId !== dto.userId) {
            throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN)
        }

        const hashPassword = await bcrypt.hash(dto.password, 5); // Хэширование пароля
        const updatedDto = {...dto, password: hashPassword, userId: user.userId}; // Добавляем / изменяем данные для вставки в таблицу
                                                                                  // Захэшированный пароль, id
        const updatedUser = await this.userService.updateUser(updatedDto);         
        const updatedProfile = await this.profileRepository.update({...updatedDto},{where: {userId: user.userId}, returning: true});

        return [updatedUser, updatedProfile]
    } 
    
    async updateByAdmin(dto: CreateProfileDto) {               
        const hashPassword = await bcrypt.hash(dto.password, 5); // Хэширование пароля
        const updatedDto = {...dto, password: hashPassword}; // Добавляем / изменяем данные для вставки в таблицу
                                                             // Захэшированный пароль, id
        const updatedProfile = await this.profileRepository.update({...updatedDto},{where: {userId: dto.userId}, returning: true});

        return updatedProfile
    }

    async deleteProfile(headers) {
        const authHeader = headers.authorization;
        const bearer = authHeader.split(' ')[0];
        const token = authHeader.split(' ')[1];                     
             
        if (bearer !== "Bearer" || !token) {                
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
            
        const user = this.jwtService.verify(token, {secret: JwtSecretKey.secret});

        const deletedProfile = await this.profileRepository.destroy({where: {userId: user.userId}});
        const deletedUser = await this.userService.deleteUser(user.userId);

        return [deletedProfile, deletedUser]
    }

    async deleteProfileByAdmin(userId) {        
        const deletedProfile = await this.profileRepository.destroy({where: {userId}});
        const deletedUser = await this.userService.deleteUser(userId);

        return [deletedProfile, deletedUser]
    }
}
