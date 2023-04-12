import * as request from 'supertest';

describe('TextBlock', () => {
    const fileURL = `http://localhost:5000/file`;

    describe('/file (DELETE)', () => {
        it('Должен вернуть количество неиспользумех файлов (0 или более)', () => {
            return request(fileURL)
                .delete('/clear')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AbWFpbC5ydSIsInJvbGVzIjpbeyJyb2xlSWQiOjEsInJvbGVOYW1lIjoiYWRtaW4iLCJkZXNjcmlwdGlvbiI6ItCQ0LTQvNC40L3QuNGB0YLRgNCw0YLQvtGAIiwiVXNlclJvbGUiOnsidXNlcklkIjoxLCJyb2xlSWQiOjF9fV0sImlhdCI6MTY4MDgxMjM3M30.Lxsv1l1_mfUjE1155alL3htsYRjcWCBDehhR1h02UKE')
                .expect((response: request.Response) => {
                    const affectedRows = +response.text;
                    
                    expect(affectedRows).toBeGreaterThanOrEqual(0);
                });
        });
    })
})