import request from 'supertest';
import { app } from '../../../app';
import Product from '../../../models/Product';

const description = 'new description new description \
                     new description new description \
                     new description new description \
                     new description new description';

it('GET:/api/product/:id --> Unauthorized', async () => {
   await request(app)
      .get(`/api/product`)
      .expect(401);
});

it('GET:/api/product/:id --> Success', async () => {

   const token = global.signin()

   const body1 = {
      price: 500,
      description,
      quantity: 100,
      title: 'new title',
      isQuantityRestricted: true,
      placeholder: 'new placeholder',
   };

   await request(app)
      .post('/api/product')
      .set('Authorization', token)
      .send(body1)
      .expect(200);

   await request(app)
      .post('/api/product')
      .set('Authorization', token)
      .send(body1)
      .expect(200);

   let data = await Product.find({})
   expect(data.length).toEqual(2)

   const response = await request(app)
      .get(`/api/product`)
      .set('Authorization', global.signin())
      .expect(200);

   expect(response.body.data.products.docs.length).toEqual(2)
});