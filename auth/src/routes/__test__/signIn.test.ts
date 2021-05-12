import request from 'supertest';
import { app } from '../../app';
import User from '../../models/User'

it('POST:/api/auth/signIn --> Account not exists.', async () => {
   const creds = {
      email: 'test@test.com',
      password: 'password1212',
   };

   await request(app).post('/api/auth/signIn').send(creds).expect(400);
});

it('POST:/api/auth/signIn --> Missing Email.', async () => {
   const creds = {
      password: 'password1212',
   };

   await request(app).post('/api/auth/signIn').send(creds).expect(400);
});

it('POST:/api/auth/signIn --> Missing Password.', async () => {
   const creds = {
      usernameOrEmail: 'test@test.com',
   };

   await request(app).post('/api/auth/signIn').send(creds).expect(400);
});

it('POST:/api/auth/signIn --> Wrong Email', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = {
      usernameOrEmail: 'test21@test.com',
      password: 'password1212',
   };

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   const user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/signIn').send(body2).expect(401);   
});

it('POST:/api/auth/signIn --> Wrong Username', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = {
      usernameOrEmail: 'testUser312',
      password: 'password1212',
   };

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   const user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/signIn').send(body2).expect(401);
});

it('POST:/api/auth/signIn --> Wrong Password', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = {
      usernameOrEmail: 'testUser',
      password: 'password12788',
   };

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   const user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/signIn').send(body2).expect(401);
});
 
it('POST:/api/auth/signIn --> Success', async () => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = {
      usernameOrEmail: 'testUser',
      password: 'password1212',
   };

   await request(app).post('/api/auth/signUp').send(body1).expect(200);
   const user = await User.findOne({})
   await request(app).post('/api/auth/verify').send({token: user?.verificationToken}).expect(200);
   await request(app).post('/api/auth/signIn').send(body2).expect(200);
});