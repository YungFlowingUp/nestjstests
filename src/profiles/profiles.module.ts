import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/users.model';
import { UsersService } from '../users/users.service';
import { ProfileController } from './profiles.controller';
import { ProfileService } from './profiles.service';
import { Profile } from './profiles.model';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, UsersService, RolesGuard, JwtService, JwtAuthGuard],
  imports: [
    SequelizeModule.forFeature([Profile, User]),
    RolesModule,
    forwardRef(()=> AuthModule)     
  ],
  exports: [ProfileService]
})
export class ProfileModule {}
