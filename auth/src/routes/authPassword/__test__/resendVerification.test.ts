import request from 'supertest';
import { app } from '../../../app';
import User from '../../../models/User'

it('POST:/api/auth/resendVerification --> Success', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { email: 'test@test.com' }

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   await request(app).post('/api/auth/resendVerification').send(body2).expect(200);
});

it('POST:/api/auth/resendVerification --> Missing Email', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   await request(app).post('/api/auth/resendVerification').send({}).expect(400);
});

it('POST:/api/auth/resendVerification --> Wrong Email', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { email: 'test321@test.com' }

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   await request(app).post('/api/auth/resendVerification').send(body2).expect(400);
});
