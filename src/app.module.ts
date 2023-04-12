import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./users/users.model";
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profiles/profiles.module';
import { RolesModule } from './roles/roles.module';
import { Role } from "./roles/roles.model";
import { Profile } from "./profiles/profiles.model";
import { UserRole } from "./roles/users-roles.model";
import { AuthModule } from './auth/auth.module';
import { TextBlockModule } from './text-block/text-block.module';
import { FileModule } from './file/file.module';
import { TextBlock } from "./text-block/text-block.model";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from 'path';
import { Files } from "./file/file.model";

// Главный модуль
@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({            
            envFilePath: '.env'
        }), // Раздача статики 
        ServeStaticModule.forRoot({                         
            rootPath: path.resolve(__dirname, 'static'),
        }), // Связь с базой данных
        SequelizeModule.forRoot({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASS,
        database: process.env.POSTGRES_DB,
        models: [User, Profile, Role, UserRole, TextBlock, Files],
        autoLoadModels: true
      }),
        UsersModule,
        ProfileModule,
        RolesModule,
        AuthModule,
        TextBlockModule,
        FileModule,        
    ]
})
export class AppModule {}