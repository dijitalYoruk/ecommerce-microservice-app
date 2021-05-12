import request from 'supertest';
import { app } from '../../app';
import User from '../../models/User'

it('POST:/api/auth/forgotPassword --> Success', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { usernameOrEmail: 'testUser' }
   const body3 = { usernameOrEmail: 'test@test.com' }

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   const user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/forgotPassword').send(body2).expect(200);
   await request(app).post('/api/auth/forgotPassword').send(body3).expect(200);
});

it('POST:/api/auth/forgotPassword --> Not Verified', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { usernameOrEmail: 'testUser' }
   const body3 = { usernameOrEmail: 'test@test.com' }

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   await request(app).post('/api/auth/forgotPassword').send(body2).expect(401);
   await request(app).post('/api/auth/forgotPassword').send(body3).expect(401);
});

it('POST:/api/auth/forgotPassword --> Wrong Username or Email.', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { usernameOrEmail: 'testUser2213' }
   const body3 = { usernameOrEmail: 'test312@test.com' }

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   const user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/forgotPassword').send(body2).expect(400);
   await request(app).post('/api/auth/forgotPassword').send(body3).expect(400);
});


it('POST:/api/auth/forgotPassword --> Missing Username or Email.', async () => {
   await request(app).post('/api/auth/forgotPassword').send({}).expect(400);
});


