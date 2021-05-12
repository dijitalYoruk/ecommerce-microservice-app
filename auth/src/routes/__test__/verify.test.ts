import request from 'supertest';
import { app } from '../../app';
import User from '../../models/User'

it('POST:/api/auth/verify --> Success', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   const user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
});

it('POST:/api/auth/verify --> Missing Token', async () => {
   await request(app).post('/api/auth/verify').send({}).expect(400);
});

it('POST:/api/auth/verify --> Wrong Token', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { token: 'Wrong Token' }
   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   await request(app).post('/api/auth/verify').send(body2).expect(401);
});