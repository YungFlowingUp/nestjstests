import * as crypto from 'crypto';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { JwtSecretKey } from '../src/auth/jwt-constraints';

describe('Auth', () => {
    const authURL = `http://localhost:5000/auth`;

    const jwt = new JwtService(); 
    const randomString = ((size: number) => crypto.randomBytes(Math.floor(size/2)).toString('hex'))

    const registerValues1 = {
        email: randomString(10) + '@mail.ru',
        password: randomString(4),
        surname: randomString(6),
        firstName: randomString(6),        
        phone: '79' + Date.now().toString().slice(-9),
        birthDate: '2010-05-07'
    };

    const registerValues2 = {
        email: 'admin@mail.ru',
        password: randomString(4),
        surname: randomString(6),
        firstName: randomString(6),        
        phone: '79' + Date.now().toString().slice(-9),
        birthDate: '2010-05-07'
    };

    const loginValues = {
        email: 'admin@mail.ru',
        password: 'admin'
    }

    describe('/auth/register (POST)', () => {
        it('Auth должен создать нового пользователя и профиль, вернув токен', () => {
            return request(authURL)
                .post('/register')
                .set('Accept', 'application/json')
                .send(registerValues1)
                .expect((response: request.Response) => {                                        
                    const {token} = response.body;

                    expect(jwt.verify(token, {secret: JwtSecretKey.secret})).toBeTruthy();
                });
        });

        it('Auth не должен создать нового пользователя, так как email уже занят', () => {
            return request(authURL)
                .post('/register')
                .set('Accept', 'application/json')
                .send(registerValues2)
                .expect(HttpStatus.BAD_REQUEST);
        });
    });

    describe('/auth/login (POST)', () => {
        it('Auth должен авторизировать пользователя и выдать токен', () => {
            return request(authURL)
            .post('/login')
            .set('Accept', 'application/json')
            .send(loginValues)
            .expect((response: request.Response) => {
                const {token} = response.body;

                expect(jwt.verify(token, {secret: JwtSecretKey.secret})).toBeTruthy();
            });
        });        
    })
})