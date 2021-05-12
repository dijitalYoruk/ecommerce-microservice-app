import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import Product from '../../models/Product';

const description = 'new description new description \
                     new description new description \
                     new description new description \
                     new description new description';

it('GET:/api/product/:id --> Unauthorized', async () => {
   const productId = new mongoose.Types.ObjectId().toHexString();

   await request(app)
      .get(`/api/product/${productId}`)
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

   let data = await Product.find({})
   const productId = data[0]._id;

   await request(app)
      .get(`/api/product/${productId}`)
      .set('Authorization', token)
      .expect(200);
});

it('GET:/api/product/:id --> Wrong Product', async () => {
   const productId = new mongoose.Types.ObjectId().toHexString();

   await request(app)
      .get(`/api/product/${productId}`)
      .set('Authorization', global.signin())
      .expect(404);
});
