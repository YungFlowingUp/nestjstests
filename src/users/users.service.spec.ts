import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { RolesService } from '../roles/roles.service';
import { User } from './users.model';

describe('UserService', () => {
    let userService: UsersService;
    let userModel: typeof User;

    const user1 = {
      userId: 3, 
      email: "some1@mail.ru",
      password: "gfdasg"
    };

    const user2 = {
      userId: 4, 
      email: "some2@mail.ru",
      password: "gfdsdasg"
    };

    const user3 = {
      userId: 5, 
      email: "some3@mail.ru",
      password: "gfdadssg"
    };

    const users = [user1, user2, user3];

    const mockUpdate = {
      ...user3,
      surname: "Dasdasd",
      firstName: "Dasdasdsd",
      phone: "79851435287",
      birthDate: "2007-05-08"
    };

    const roleToUser = {
      roleName: "admin",
      userId: 100
    };

    const mockUserModel = {
      findAll: jest.fn().mockResolvedValue(users),
      findOne: jest.fn().mockResolvedValue(user2),
      update: jest.fn().mockResolvedValue([1, {
        ...user3, password: "123456asd"
      }]),
      findByPk: jest.fn().mockResolvedValue(null) 
    };

    const mockRolesService = {
      async getRoleByName() {
        return {
          roleId: 1,
          roleName: "admin",
          description: "admin"
        }
      }
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
              {
                provide: RolesService,
                useValue: mockRolesService
              },
              {
                provide: getModelToken(User),
                useValue: mockUserModel
              }                                  
            ]            
        }).compile();
            
        userService = module.get<UsersService>(UsersService);   
        userModel = module.get<typeof User>(getModelToken(User));                  
    });

    describe('getAllUsers()', () => {
      it('Должен вернуть всех пользователей', async () => {     
        expect(await userService.getAllUsers()).toEqual(users);
      });
    });    

    describe('getUserByEmail()', () => {
      it('Должен вернуть только одного пользователя', async () => {  
        const findSpy = jest.spyOn(userModel, 'findOne');         
        expect(await userService.getUserByEmail("some2@mail.ru")).toEqual(users[1]);
        expect(findSpy).toBeCalledWith({where: {email: "some2@mail.ru"}, include: {all: true}});
      });
    });    

    describe('updateUser()', () => {
      it('Должен обновить данные пользователя, вернув новые', async () => { 
        const findSpy = jest.spyOn(userModel, 'update');    
        expect(await userService.updateUser(mockUpdate)).toEqual([1, {
          ...user3, password: "123456asd"
        }]);
        expect(findSpy).toBeCalledWith(mockUpdate, {returning: true, where: {userId: mockUpdate.userId}});
      });
    });    

    describe('addRoleToUser()', () => {
      it('Должен вернуть ошибку, так как такого пользователя не существует', async () => {  
        expect(async() => await userService.addRoleToUser(roleToUser)).rejects.toThrow();        
      });
    });      
})