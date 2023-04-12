import { forwardRef, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../roles/roles.model';
import { RolesModule } from '../roles/roles.module';
import { UserRole } from '../roles/users-roles.model';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard, JwtService, RolesGuard],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole]),  
    RolesModule,
    forwardRef(() => AuthModule) 
  ],
  exports: [UsersService]
})
export class UsersModule {}
