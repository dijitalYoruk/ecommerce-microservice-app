import request from 'supertest';
import { app } from '../../app';

const sendRequest = async (creds, expectedStatus: number) => {
   return await request(app).post('/api/auth/signUp').send(creds).expect(expectedStatus);
};

it('POST:/api/auth/signUp --> Success', async () => {
   const creds = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   await sendRequest(creds, 200);
});

it('POST:/api/auth/signUp --> Duplicate Email', async () => {
   const creds1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const creds2 = {
      email: 'test@test.com',
      username: 'testUserUpdated',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   await sendRequest(creds1, 200);
   await sendRequest(creds2, 400);
});

it('POST:/api/auth/signUp --> Duplicate Username', async () => {
   const creds1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const creds2 = {
      email: 'test1@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   await sendRequest(creds1, 200);
   await sendRequest(creds2, 400);
});

it('POST:/api/auth/signUp --> Missing Email', async () => {
   const creds = {
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   await sendRequest(creds, 400);
});

it('POST:/api/auth/signUp --> Invalid Email', async () => {
   const creds = {
      email: 'dasdsadsad',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   await sendRequest(creds, 400);
});

it('POST:/api/auth/signUp --> Missing Username', async () => {
   const creds = {
      email: 'test@test.com',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   await sendRequest(creds, 400);
});

it('POST:/api/auth/signUp --> Invalid Password', async () => {
   const creds = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'p',
      passwordConfirm: 'p',
   };

   await sendRequest(creds, 400);
});

it('POST:/api/auth/signUp --> Password Mismatch', async () => {
   const creds = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password121231',
   };

   await sendRequest(creds, 400);
});
