import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import Product from '../../../models/Product';
import { client } from '../../../services/NatsService';

const description = 'new description new description \
                     new description new description \
                     new description new description \
                     new description new description';

it('PATCH:/api/product --> Unauthorized', async () => {
   await request(app)
      .patch('/api/product/adsgdhjsagdjhsad')
      .send({})
      .expect(401);   
});

it('PATCH:/api/product --> Success', async () => {
   const token = global.signinAsAdmin()

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

   const body2 = {
      price: 200,
      description,
      quantity: 150,
      title: 'updated title',
      isQuantityRestricted: true,
      placeholder: 'updated placeholder',
   };

   let data = await Product.find({})
   expect(data.length).toEqual(1)
   let product = data[0]

   await request(app)
      .patch(`/api/product/${product.id}`)
      .set('Authorization', token)
      .send(body2)
      .expect(200);

   data = await Product.find({})
   expect(data.length).toEqual(1)
   product = data[0]

   expect(client.publish).toHaveBeenCalled()
   expect(product.price).toEqual(body2.price)
   expect(product.title).toEqual(body2.title)
   expect(product.quantity).toEqual(body2.quantity)
   expect(product.placeholder).toEqual(body2.placeholder)
   expect(product.description).toEqual(body2.description)
});


it('PATCH:/api/product --> Unrestrict Quantity Count', async () => {
   const token = global.signinAsAdmin()

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

   const body2 = {
      price: 500,
      description,
      quantity: 150,
      title: 'updated title',
      isQuantityRestricted: true,
      placeholder: 'updated placeholder',
   };

   let data = await Product.find({})
   expect(data.length).toEqual(1)
   let product = data[0]

   await request(app)
      .patch(`/api/product/${product.id}`)
      .set('Authorization', token)
      .send(body2)
      .expect(200);

   data = await Product.find({})
   expect(data.length).toEqual(1)
   product = data[0]
   
   expect(client.publish).toHaveBeenCalled()
   expect(product.price).toEqual(body2.price)
   expect(product.title).toEqual(body2.title)
   expect(product.quantity).toEqual(body2.quantity)
   expect(product.placeholder).toEqual(body2.placeholder)
   expect(product.description).toEqual(body2.description)
});


it('PATCH:/api/product --> Update only price.', async () => {
   const token = global.signinAsAdmin()

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
   };

   await request(app)
      .patch(`/api/product/${data[0]._id}`)
      .set('Authorization', token)
      .send(body2)
      .expect(200);

   data = await Product.find({})
   expect(data.length).toEqual(1)
   const product = data[0]
   expect(product.quantity).toEqual(undefined)
   expect(product.isQuantityRestricted).toEqual(body2.isQuantityRestricted)
});


it('PATCH:/api/product --> Wrong Author', async () => {

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
      .set('Authorization', global.signinAsAdmin())
      .send(body1)
      .expect(200);

   let data = await Product.find({})

   const body2 = {
      price: 200,
      description,
      quantity: 100,
      title: 'updated title',
      isQuantityRestricted: true,
      placeholder: 'updated placeholder',
   };

   await request(app)
      .patch(`/api/product/${data[0]._id}`)
      .set('Authorization', global.signinAsAdmin())
      .send(body2)
      .expect(401);
});

it('PATCH:/api/product --> Wrong Price', async () => {
   const body2 = { price: -200 };
   const productId = new mongoose.Types.ObjectId().toHexString()

   await request(app)
      .patch(`/api/product/${productId}`)
      .set('Authorization', global.signinAsAdmin())
      .send(body2)
      .expect(400);
});

it('PATCH:/api/product --> Wrong Description', async () => {
   const body2 = { description: '' };
   const productId = new mongoose.Types.ObjectId().toHexString()

   await request(app)
      .patch(`/api/product/${productId}`)
      .set('Authorization', global.signinAsAdmin())
      .send(body2)
      .expect(400);
});

it('PATCH:/api/product --> Wrong Placeholder', async () => {
   const body2 = { placeholder: '' };
   const productId = new mongoose.Types.ObjectId().toHexString();

   await request(app)
      .patch(`/api/product/${productId}`)
      .set('Authorization', global.signinAsAdmin())
      .send(body2)
      .expect(400);
});