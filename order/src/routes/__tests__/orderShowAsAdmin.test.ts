import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import Order from '../../models/Order';
import Product from '../../models/Product';
import { OrderStatus } from '@conqueror-ecommerce/common';

const description = 'new description new description \
                     new description new description \
                     new description new description \
                     new description new description';

it('GET:/api/order/asAdmin --> Unauthorized', async () => {
   await request(app).get(`/api/order`).expect(401);
});

it('GET:/api/order/asAdmin --> Retrieve Orders As Admin.', async () => {
   const product1 = Product.build({
      price: 500,
      description,
      quantity: 100,
      title: 'product title 1',
      isQuantityRestricted: true,
      placeholder: 'new placeholder 1',
      authorId: mongoose.Types.ObjectId().toHexString()
   });

   await product1.save();
   const productQuantities = [10];
   const productIds = [product1.id]
   const token = global.signin()

   await request(app)
      .post('/api/order')
      .set('Authorization', token)
      .send({ productIds, productQuantities })
      .expect(200);

   await request(app)
      .post('/api/order')
      .set('Authorization', token)
      .send({ productIds, productQuantities })
      .expect(200);

   await request(app)
      .post('/api/order')
      .set('Authorization', global.signin())
      .send({ productIds, productQuantities })
      .expect(200);

   const data = await Order.find({})
   expect(data.length).toEqual(3)

   const { body } = await request(app)
      .get(`/api/order/asAdmin`)
      .query({ status: OrderStatus.Created })
      .set('Authorization', token)
      .expect(200);

   expect(body.data.orders.docs.length).toEqual(3)
});