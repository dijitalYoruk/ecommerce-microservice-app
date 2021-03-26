import request from 'supertest';
import { app } from '../../app';
import User from '../../models/user'

it('POST:/api/auth/resetPassword --> Success', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { usernameOrEmail: 'testUser' }

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   let user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/forgotPassword').send(body2).expect(200);
   
   user = await User.findOne({})
   const body3 = {
      password: 'newPassword222',
      passwordConfirm: 'newPassword222',
      token: user?.passwordResetToken
   }

   await request(app).post('/api/auth/resetPassword').send(body3).expect(200);
});

it('POST:/api/auth/resetPassword --> Wrong Token', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { usernameOrEmail: 'testUser' }

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   let user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/forgotPassword').send(body2).expect(200);
   
   user = await User.findOne({})
   const body3 = {
      password: 'newPassword222',
      passwordConfirm: 'newPassword222',
      token: 'wrong token'
   }

   await request(app).post('/api/auth/resetPassword').send(body3).expect(400);
});

it('POST:/api/auth/resetPassword --> Missing Token', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { usernameOrEmail: 'testUser' }

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   let user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/forgotPassword').send(body2).expect(200);
   
   user = await User.findOne({})
   const body3 = {
      password: 'newPassword222',
      passwordConfirm: 'newPassword222',
   }

   await request(app).post('/api/auth/resetPassword').send(body3).expect(400);
});


it('POST:/api/auth/resetPassword --> Missing Password', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { usernameOrEmail: 'testUser' }

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   let user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/forgotPassword').send(body2).expect(200);
   
   user = await User.findOne({})
   const body3 = {
      passwordConfirm: 'newPassword222',
      token: user?.passwordResetToken
   }

   await request(app).post('/api/auth/resetPassword').send(body3).expect(400);
});

it('POST:/api/auth/resetPassword --> Password Mismatch', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = { usernameOrEmail: 'testUser' }

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   let user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/forgotPassword').send(body2).expect(200);
   
   user = await User.findOne({})
   const body3 = {
      password: 'newPassword222',
      passwordConfirm: 'newPassword222312',
      token: user?.passwordResetToken
   }

   await request(app).post('/api/auth/resetPassword').send(body3).expect(400);
});
