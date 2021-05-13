import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import Order from '../../../models/Order';
import Product from '../../../models/Product';


it('GET:/api/order --> Unauthorized', async () => {
   await request(app).get(`/api/order`).expect(401);   
});

it('GET:/api/order --> Retrieve Orders.', async () => {
   const product1 = Product.build({
      price: 500,
      quantity: 100,
      title: 'product title 1',
      isQuantityRestricted: true,
      placeholder: 'new placeholder 1',
      id: mongoose.Types.ObjectId().toHexString()
  });

   await product1.save();
   const productQuantities = [10];
   const productIds = [product1.id];
   const token = global.signinAsCustomer();

   await request(app)
      .post('/api/order')
      .set('Authorization', token)
      .send({productIds, productQuantities})
      .expect(200);    

    await request(app)
      .post('/api/order')
      .set('Authorization', token)
      .send({productIds, productQuantities})
      .expect(200);   
      
    await request(app)
      .post('/api/order')
      .set('Authorization', global.signinAsCustomer())
      .send({productIds, productQuantities})
      .expect(200);   

    const data = await Order.find({})
    expect(data.length).toEqual(3)

    const { body } = await request(app)
      .get(`/api/order`)
      .set('Authorization', token)
      .expect(200)

    expect(body.data.orders.length).toEqual(2)
});