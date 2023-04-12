import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profiles.controller';
import { ProfileService } from './profiles.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from '../auth/roles.guard';

describe('ProfileController', () => {
    let profileController: ProfileController;
    
    const mockProfile_1 = {
      "userId": new Date(),      
      "email": "hfghfhff@mail.ru",      
      "surname": "ASD",
      "firstName": "DSA",
      "phone": "79289351579",
      "birthDate": "2000-06-04"
    };

    const mockProfile_2 = {
      "userId": new Date(),      
      "email": "hfgh@yandex.ru",      
      "surname": "Some",
      "firstName": "Else",
      "phone": "79289351579",
      "birthDate": "1986-02-11"
    };

    const mockProfile_3 = {
      "userId": new Date(),      
      "email": "hfgh@gmail.ru",      
      "surname": "Phil",
      "firstName": "Dokins",
      "phone": "79289300579",
      "birthDate": "2000-06-05"
    };

    const mockProfile_4 = {
      "userId": 6,      
      "email": "hfgh@gmail.ru",      
      "surname": "Phil",
      "firstName": "Dokins",
      "phone": "79289300579",
      "birthDate": "2000-06-05"
    };

    const mockProfiles = [mockProfile_1, mockProfile_2, mockProfile_3, mockProfile_4];

    const mockProfileService = {
        async getAllProfiles() {
            return mockProfiles
        },

        async deleteProfile(userId: number) {            
            let rowsDeleted = 0;

            mockProfiles.filter(profile => {
              if (profile.userId == userId) {
                rowsDeleted++;
                return false
              }
            });
            
            return rowsDeleted
        }
    };

    const mockUserService = {

    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProfileController],
            providers: [
              {
                provide: ProfileService,
                useValue: mockProfileService
              },
              {
                provide: UsersService,
                useValue: mockUserService
              },
              {
                provide: RolesGuard,
                useValue: jest.fn().mockImplementation(() => true)
              },
              JwtService                       
            ]            
          }).compile();
            
          profileController = module.get<ProfileController>(ProfileController);         
    });

    it('Должен быть определен', () => {
        expect(profileController).toBeDefined();
    });

    describe('/all (GET)', () => {
      it('Должен возвращать все профили', () => {
        expect(profileController.getAll()).resolves.toEqual(mockProfiles);      
      });
    });  
    
    describe('/ (DELETE)', () => {
      it('Должен удалять профиль, если он существует причем только один', () => {
        expect(profileController.deleteAcc(6)).resolves.toBeLessThanOrEqual(1);
      });
    });    
})