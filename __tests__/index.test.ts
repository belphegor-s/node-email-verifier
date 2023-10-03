import supertest from "supertest";
import app from "../src/index";

describe('Email Verifier', () => {
    const email = 'howdy@ayushsharma.me';
    const emails = ['howdy@ayushsharma.me', 'ayush2162002@gmail.com', 'apricus007@duck.com'];
    const domain = email.split('@')[1];
    
    describe('verify single email', () => {
        it('should correctly verify a single email', async () => {
            await supertest(app).get(`/api/v1/verify/${email}`).expect(200);
        }, 1000 * 60 * 5); // 5 minutes timesout
    });

    describe('verify bulk emails', () => {
        it('should correctly verify bulk emails', async () => {
            await supertest(app).post(`/api/v1/verify-bulk`).send({ emails }).set('Content-Type', 'application/json').set('Accept', 'application/json').expect(200);
        }, 1000 * 60 * 10); // 10 minutes timesout
    });

    describe('get MX Records', () => {
        it('should correctly fetch MX Records', async () => {
            await supertest(app).get(`/api/v1/get-mx-records/${domain}`).expect(200);
        }, 1000 * 60 * 5); // 5 minutes timesout
    });
});