import request from 'supertest';
import { app } from '../../../app';
import User from '../../../models/User'

const registerAndSignIn = async() => {
   const body1 = {
      email: 'test@test.com',
      username: 'testUser',
      password: 'password1212',
      passwordConfirm: 'password1212',
   };

   const body2 = {
      usernameOrEmail: 'test@test.com',
      password: 'password1212'
   }

   await request(app)
            .post('/api/auth/signUp')
            .send(body1)
            .expect(200);
   
   const user = await User.findOne({})
   
   await request(app)
            .post('/api/auth/verify')
            .send({token: user?.verificationToken})
            .expect(200);
   
   const response = await request(app)
            .post('/api/auth/signIn')
            .send(body2)
            .expect(200);

   return response.body.data.token
}


it('GET:/api/auth/currentUser --> Success', async () => {
   const token = await registerAndSignIn()
   await request(app)
            .get('/api/auth/currentUser')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
});

it('GET:/api/auth/currentUser --> Missing Token', async () => { 
   await request(app)
            .get('/api/auth/currentUser')
            .expect(401);
});

it('GET:/api/auth/currentUser --> Wrong Token', async () => {  
   await request(app)
            .get('/api/auth/currentUser')
            .set('Authorization', `Bearer Wrong`)
            .expect(401);
});