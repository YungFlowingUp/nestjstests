import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { JwtSecretKey } from "./jwt-constraints";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor (private jwtService: JwtService) {}
    
    // Проверка есть ли JWT токен
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest(); // Получение контекста запроса 
        try {
            const authHeader = req.headers.authorization; // Получение поля authorization из header
            const bearer = authHeader.split(' ')[0]; // Получение bearer из headers
            const token = authHeader.split(' ')[1]; // Получение токена из headers                     
             
            if (bearer !== "Bearer" || !token) {                
                throw new UnauthorizedException({message: 'Пользователь не авторизован'})
            }            
            
            const user = this.jwtService.verify(token, {secret: JwtSecretKey.secret}); // Расшифровка токена            
            req.user = user;            
            return true
        } catch (e) {                       
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }
    }
}