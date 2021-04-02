import request from 'supertest';
import { app } from '../../app';

it('GET:/api/product/:id --> Unauthorized', async () => {
   await request(app)
      .get(`/api/product`)
      .expect(401);   
});

it('GET:/api/product/:id --> Success', async () => {
   await request(app)
      .get(`/api/product`)
      .set('Authorization', global.signin())
      .expect(200);
});