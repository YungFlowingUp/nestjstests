import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import * as crypto from 'crypto';

describe('TextBlock', () => {
    const textBlockURL = `http://localhost:5000/text-block`;

    const randomString = ((size: number) => crypto.randomBytes(Math.floor(size/2)).toString('hex'))

    const textBlockPostValue = {
        "uniqueName": "tb1",
        "title": randomString(8),
        "text": randomString(8),
        "group": "gr1",    
        "fileId": null
    };

    const textBlockId = 1;

    describe('/text-block (POST)', () => {
        it('Должен вернуть ошибку, если текстовый блок с таким уникальным именем уже существует', () => {
            return request(textBlockURL)
                .post('')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbWFpbC5ydSIsInJvbGVzIjpbeyJyb2xlSWQiOjEsInJvbGVOYW1lIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiVXNlclJvbGUiOnsidXNlcklkIjoxLCJyb2xlSWQiOjF9fV0sImlhdCI6MTY4MDgxMjM3M30.Lxsv1l1_mfUjE1155alL3htsYRjcWCBDehhR1h02UKE')
                .send(textBlockPostValue)
                .expect(HttpStatus.INTERNAL_SERVER_ERROR);
        });

        it('Должен вернуть ошибку, так как добавлять блок может только администратор', () => {
            return request(textBlockURL)
                .post('')
                .send(textBlockPostValue)
                .expect(HttpStatus.FORBIDDEN);
        });
    });

    describe('/text-block (PATCH)', () => {
        it('Должен удалить ссылку на файл из блока, возвращая измененый блок', () => {
            return request(textBlockURL)
                .patch(`/file/${textBlockId}`)
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbWFpbC5ydSIsInJvbGVzIjpbeyJyb2xlSWQiOjEsInJvbGVOYW1lIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiVXNlclJvbGUiOnsidXNlcklkIjoxLCJyb2xlSWQiOjF9fV0sImlhdCI6MTY4MDgxMjM3M30.Lxsv1l1_mfUjE1155alL3htsYRjcWCBDehhR1h02UKE')
                .expect((response: request.Response) => {                   
                    const arr = response.body;
                    const deletedRows = arr[0];
                    const updatedTextBlock = arr[1][0]; 
                    
                    expect(deletedRows).toBe(1),                  
                    expect(updatedTextBlock.fileId).toBeNull();                 
                });               
        });
    })
})