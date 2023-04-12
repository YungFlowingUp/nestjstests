import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ProfileModule } from '../profiles/profiles.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtSecretKey } from './jwt-constraints';
import { RolesGuard } from './roles.guard';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '../roles/roles.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard, JwtService, RolesService],
  imports: [ // Импортируемые модули и сущности 
      forwardRef(() => UsersModule), 
      forwardRef(()=> ProfileModule),
      SequelizeModule.forFeature([Role]),
      forwardRef(()=> RolesModule),
      JwtModule.register({                
        secret: JwtSecretKey.secret, // Секретный ключ для де-/шифрования JWT токена
        signOptions: {
          expiresIn: '24h' // Указание время действия JWT токена
        }
      })
  ]
})
export class AuthModule {}
