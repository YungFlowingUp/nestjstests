import { Module, forwardRef } from '@nestjs/common';
import { FileService } from './file.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Files } from './file.model';
import { FileController } from './file.controller';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [FileService, JwtService, RolesGuard],
  imports: [
    SequelizeModule.forFeature([Files]),
    forwardRef(() => AuthModule)     
  ],
  exports: [FileService],
  controllers: [FileController]
})
export class FileModule {}
