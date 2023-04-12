import { Body, Controller, Get, Post, Put, UseGuards, Headers, Delete, Param, UsePipes } from '@nestjs/common';
import { Roles } from '../auth/roles-auth.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profiles.service';
import { ValidationPipe } from '../pipes/validation.pipe';

@Controller('profile')
@UsePipes(ValidationPipe) // Валидация всех методов контроллера
export class ProfileController {
    constructor(private profileService: ProfileService) {}

    @Roles('admin')
    @UseGuards(RolesGuard)    
    @Put('/admin')
    async updateByAdmin(@Body() dtoProfile: CreateProfileDto) {
        return this.profileService.updateByAdmin(dtoProfile)
    }

    @Put()
    async update(@Headers() headers, @Body() dtoProfile: CreateProfileDto) {
        return this.profileService.updateProfile(headers, dtoProfile)
    }

    @Delete()
    async deleteAcc(@Headers() headers) { // Получение данных из headers (jwt токена)
        return this.profileService.deleteProfile(headers)
    }

    @Roles('admin')
    @UseGuards(RolesGuard)
    @Delete(':userId')
    async deleteAccByAdmin(@Param('userId') userId: number) {        
        return this.profileService.deleteProfileByAdmin(userId)
    }

    @Roles('admin')
    @UseGuards(RolesGuard)
    @Get('/all')
    async getAll() {
        return this.profileService.getAllProfiles()
    }

    @Get()
    async getYourAcc(@Headers() headers) {       
        return this.profileService.getYourAcc(headers)
    }

    @Roles('admin')
    @UseGuards(RolesGuard)
    @Get(':userId')
    async getByIdAdmin(@Param('userId') userId: number) {        
        return this.profileService.getById(userId)
    }
}
