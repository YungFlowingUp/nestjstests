import { Injectable, Logger, OnModuleInit, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepresitory: typeof Role) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepresitory.create(dto);
        return role
    }

    async getRoleByName(roleName: string) {
        const role = await this.roleRepresitory.findOne({where: {roleName}});
        return role
    }

    // Создание роли Администратор и Пользователь, вызывается единожды при запуске сервера
    async craeteAdminAndUser() {
        await this.createRole({roleName: 'admin', description: 'Администратор'});                
        await this.createRole({roleName: 'user', description: 'Пользователь'});
        
        const logger = new Logger();
        logger.debug(`Созданы две роли 'admin' | 'user'`);
    }
}