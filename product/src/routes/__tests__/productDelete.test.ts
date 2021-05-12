import request from 'supertest';
import { app } from '../../app';
import Product from '../../models/Product';
import { client } from '../../services/NatsService'

const description = 'new description new description \
                     new description new description \
                     new description new description \
                     new description new description';

it('DELETE:/api/product --> Unauthorized', async () => {
   await request(app)
      .delete('/api/product')
      .send({})
      .expect(401);   
});

it('DELETE:/api/product --> Success', async () => {
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

   const body2 = {
      productId: data[0]._id,
   };

   await request(app)
      .delete(`/api/product`)
      .set('Authorization', token)
      .send(body2)
      .expect(200);

   data = await Product.find({})
   expect(data.length).toEqual(0)
   expect(client.publish).toHaveBeenCalled()
});

it('DELETE:/api/product --> Wrong Author', async () => {

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
      .set('Authorization', global.signin())
      .send(body1)
      .expect(200);

   let data = await Product.find({})

   const body2 = {
      productId: data[0]._id,
   };

   await request(app)
      .delete(`/api/product`)
      .set('Authorization', global.signin())
      .send(body2)
      .expect(401);
});

it('DELETE:/api/product --> Missing ProductId', async () => {
   await request(app)
      .delete(`/api/product`)
      .set('Authorization', global.signin())
      .send({})
      .expect(400);
});