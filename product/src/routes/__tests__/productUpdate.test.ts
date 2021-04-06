import request from 'supertest';
import { app } from '../../app';
import {Types} from 'mongoose';
import Product from '../../models/product';
import NatsService from '../../services/NatsService';

const description = 'new description new description \
                     new description new description \
                     new description new description \
                     new description new description';

it('PUT:/api/product --> Unauthorized', async () => {
   await request(app)
      .put('/api/product')
      .send({})
      .expect(401);   
});

it('PUT:/api/product --> Success', async () => {
   const token = global.signin()

   const body1 = {
      price: 500,
      description,
      title: 'new title',
      placeholder: 'new placeholder',
   };

   await request(app)
      .post('/api/product')
      .set('Authorization', token)
      .send(body1)
      .expect(200);

   let data = await Product.find({})

   const body2 = {
      price: 200,
      description,
      productId: data[0]._id,
      title: 'updated title',
      placeholder: 'updated placeholder',
   };

   await request(app)
      .put(`/api/product`)
      .set('Authorization', token)
      .send(body2)
      .expect(200);

   data = await Product.find({})
   expect(data.length).toEqual(1)
   const product = data[0]
   expect(product.price).toEqual(body2.price)
   expect(product.title).toEqual(body2.title)
   expect(product.placeholder).toEqual(body2.placeholder)
   expect(product.description).toEqual(body2.description)
   expect(NatsService.client?.publish).toHaveBeenCalled()
});


it('PUT:/api/product --> Update only title.', async () => {
   const token = global.signin()

   const body1 = {
      price: 500,
      description,
      title: 'new title',
      placeholder: 'new placeholder',
   };

   await request(app)
      .post('/api/product')
      .set('Authorization', token)
      .send(body1)
      .expect(200);

   let data = await Product.find({})

   const body2 = {
      title: 'updated title',
      productId: data[0]._id
   };

   await request(app)
      .put(`/api/product`)
      .set('Authorization', token)
      .send(body2)
      .expect(200);

   data = await Product.find({})
   expect(data.length).toEqual(1)
   const product = data[0]
   expect(product.title).toEqual(body2.title)
});


it('PUT:/api/product --> Update only placeholder.', async () => {

   const token = global.signin()

   const body1 = {
      price: 500,
      description,
      title: 'new title',
      placeholder: 'new placeholder',
   };

   await request(app)
      .post('/api/product')
      .set('Authorization', token)
      .send(body1)
      .expect(200);

   let data = await Product.find({})

   const body2 = {
      placeholder: 'updated placeholder',
      productId: data[0]._id
   };

   await request(app)
      .put(`/api/product`)
      .set('Authorization', token)
      .send(body2)
      .expect(200);

   data = await Product.find({})
   expect(data.length).toEqual(1)
   const product = data[0]
   expect(product.placeholder).toEqual(body2.placeholder)
});

it('PUT:/api/product --> Update only price.', async () => {

   const token = global.signin()

   const body1 = {
      price: 500,
      description,
      title: 'new title',
      placeholder: 'new placeholder',
   };

   await request(app)
      .post('/api/product')
      .set('Authorization', token)
      .send(body1)
      .expect(200);

   let data = await Product.find({})

   const body2 = {
      price: 100,
      productId: data[0]._id
   };

   await request(app)
      .put(`/api/product`)
      .set('Authorization', token)
      .send(body2)
      .expect(200);

   data = await Product.find({})
   expect(data.length).toEqual(1)
   const product = data[0]
   expect(product.price).toEqual(body2.price)
});


it('PUT:/api/product --> Wrong Author', async () => {

   const body1 = {
      price: 500,
      description,
      title: 'new title',
      placeholder: 'new placeholder',
   };

   await request(app)
      .post('/api/product')
      .set('Authorization', global.signin())
      .send(body1)
      .expect(200);

   let data = await Product.find({})

   const body2 = {
      price: 200,
      description,
      title: 'updated title',
      productId: data[0]._id,
      placeholder: 'updated placeholder',
   };

   await request(app)
      .put(`/api/product`)
      .set('Authorization', global.signin())
      .send(body2)
      .expect(401);
});

it('PUT:/api/product --> Wrong Price', async () => {
   const body2 = {
      price: -200,
      productId: new Types.ObjectId().toHexString(),
   };

   await request(app)
      .put(`/api/product`)
      .set('Authorization', global.signin())
      .send(body2)
      .expect(400);
});

it('PUT:/api/product --> Wrong Description', async () => {
   const body2 = {
      description: '',
      productId: new Types.ObjectId().toHexString(),
   };

   await request(app)
      .put(`/api/product`)
      .set('Authorization', global.signin())
      .send(body2)
      .expect(400);
});

it('PUT:/api/product --> Wrong Placeholder', async () => {
   const body2 = {
      placeholder: '',
      productId: new Types.ObjectId().toHexString(),
   };

   await request(app)
      .put(`/api/product`)
      .set('Authorization', global.signin())
      .send(body2)
      .expect(400);
});


it('PUT:/api/product --> Missing ProductId', async () => {
   const body2 = {
      placeholder: 'updated placeholder',
   };

   await request(app)
      .put(`/api/product`)
      .set('Authorization', global.signin())
      .send(body2)
      .expect(400);
});