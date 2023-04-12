import * as request from 'supertest';
import * as crypto from 'crypto';
import { HttpStatus } from '@nestjs/common';

describe('TextBlock', () => {
    const fileURL = `http://localhost:5000/role`;

    const randomString = ((size: number) => crypto.randomBytes(Math.floor(size/2)).toString('hex'))

    const craeteUserRole = {
        roleName: "user",
        description: randomString(10)
    };

    const craeteAdminRole = {
        roleName: "admin",
        description: randomString(10)
    };
    
    const craeteAnyOtherRole = {
        roleName: randomString(8),
        description: randomString(10)
    };

    describe('/role (POST)', () => {
        it('Должен создать роль и вернуть ее', () => {
            return request(fileURL)
                .post('')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbWFpbC5ydSIsInJvbGVzIjpbeyJyb2xlSWQiOjEsInJvbGVOYW1lIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiVXNlclJvbGUiOnsidXNlcklkIjoxLCJyb2xlSWQiOjF9fV0sImlhdCI6MTY4MDgxMjM3M30.Lxsv1l1_mfUjE1155alL3htsYRjcWCBDehhR1h02UKE')
                .send(craeteAnyOtherRole)                                            
                .expect((response: request.Response) => {
                    const craetedRole = response.body;
                    
                    expect(typeof craetedRole.roleId).toBe('number'),
                    expect(typeof craetedRole.roleName).toBe('string'),
                    expect(typeof craetedRole.description).toBe('string')
                });
        });

        it('Должен вернуть ошибку, так как роль [user] уже существует', () => {
            return request(fileURL)
                .post('')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbWFpbC5ydSIsInJvbGVzIjpbeyJyb2xlSWQiOjEsInJvbGVOYW1lIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiVXNlclJvbGUiOnsidXNlcklkIjoxLCJyb2xlSWQiOjF9fV0sImlhdCI6MTY4MDgxMjM3M30.Lxsv1l1_mfUjE1155alL3htsYRjcWCBDehhR1h02UKE')
                .send(craeteUserRole)                                            
                .expect(HttpStatus.INTERNAL_SERVER_ERROR);
        });

        it('Должен вернуть ошибку, так как роль [admin] уже существует', () => {
            return request(fileURL)
                .post('')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbWFpbC5ydSIsInJvbGVzIjpbeyJyb2xlSWQiOjEsInJvbGVOYW1lIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiVXNlclJvbGUiOnsidXNlcklkIjoxLCJyb2xlSWQiOjF9fV0sImlhdCI6MTY4MDgxMjM3M30.Lxsv1l1_mfUjE1155alL3htsYRjcWCBDehhR1h02UKE')
                .send(craeteAdminRole)                                            
                .expect(HttpStatus.INTERNAL_SERVER_ERROR);
        });

        it('Должен запретить доступ, так как только администратор может доабвлять новые роли', () => {
            return request(fileURL)
                .post('')
                .send(craeteAnyOtherRole)                                            
                .expect(HttpStatus.FORBIDDEN);
        });
    })
})