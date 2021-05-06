import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import Product from '../../models/product';
import { client } from '../../services/NatsService';

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
      price: 200,
      description,
      quantity: 150,
      productId: data[0]._id,
      title: 'updated title',
      isQuantityRestricted: true,
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
   expect(client.publish).toHaveBeenCalled()
   expect(product.price).toEqual(body2.price)
   expect(product.title).toEqual(body2.title)
   expect(product.quantity).toEqual(body2.quantity)
   expect(product.placeholder).toEqual(body2.placeholder)
   expect(product.description).toEqual(body2.description)
});


it('PUT:/api/product --> Unrestrict Quantity Count', async () => {
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
      price: 500,
      description,
      quantity: 150,
      productId: data[0]._id,
      title: 'updated title',
      isQuantityRestricted: true,
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
   expect(client.publish).toHaveBeenCalled()
   expect(product.price).toEqual(body2.price)
   expect(product.title).toEqual(body2.title)
   expect(product.quantity).toEqual(body2.quantity)
   expect(product.placeholder).toEqual(body2.placeholder)
   expect(product.description).toEqual(body2.description)
});


it('PUT:/api/product --> Update only price.', async () => {
   const token = global.signin()

   const body = {
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
      .send(body)
      .expect(200);

   let data = await Product.find({})

   const body2 = {
      isQuantityRestricted: false,
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
   expect(product.quantity).toEqual(undefined)
   expect(product.isQuantityRestricted).toEqual(body2.isQuantityRestricted)
});


it('PUT:/api/product --> Wrong Author', async () => {

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
      price: 200,
      description,
      quantity: 100,
      title: 'updated title',
      productId: data[0]._id,
      isQuantityRestricted: true,
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
      productId: new mongoose.Types.ObjectId().toHexString(),
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
      productId: new mongoose.Types.ObjectId().toHexString(),
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
      productId: new mongoose.Types.ObjectId().toHexString(),
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