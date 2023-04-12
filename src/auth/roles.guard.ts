import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { JwtSecretKey } from "./jwt-constraints";
import { ROLES_KEY } from "./roles-auth.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor (private jwtService: JwtService,
                 private reflector: Reflector) {}

    // Проверка роли для доступа
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [ // Получение ролей из декоратора
                context.getHandler(),
                context.getClass()
            ])

            if (!requiredRoles) {
                return true
            }

            const req = context.switchToHttp().getRequest(); // Получение контекста запроса
            const authHeader = req.headers.authorization; // Получение поля authorization из header
            const bearer = authHeader.split(' ')[0]; // Получение bearer из headers
            const token = authHeader.split(' ')[1]; // Получение токена из headers                    
             
            if (bearer !== "Bearer" || !token) {                
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }            
            
            const user = this.jwtService.verify(token, {secret: JwtSecretKey.secret}); // Расшифровка токена                     
            req.user = user;         
               
            return user.roles.some(role => requiredRoles.includes(role.roleName)) // Проверка ролей
        } catch (e) {
            throw new HttpException('Нет права доступа', HttpStatus.FORBIDDEN)
        }
    }
}