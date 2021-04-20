import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import Order from '../../models/Order';
import Product from '../../models/Product';

const description = 'new description new description new description new description \
                     new description new description new description new description';

it('GET:/api/order --> Unauthorized', async () => {
   await request(app).get(`/api/order`).expect(401);   
});

it('GET:/api/order --> Retrieve Orders.', async () => {
   const token = global.signin()
   const authorId = mongoose.Types.ObjectId().toHexString()

   const product1 = Product.build({
       authorId,
       price: 500,
       description,
       title: 'product title 1',
       placeholder: 'new placeholder 1'
   });

   await product1.save();
   const productIds = [product1.id]

   await request(app)
      .post('/api/order')
      .set('Authorization', token)
      .send({productIds})
      .expect(200);    

    await request(app)
      .post('/api/order')
      .set('Authorization', token)
      .send({productIds})
      .expect(200);   
      
    await request(app)
      .post('/api/order')
      .set('Authorization', global.signin())
      .send({productIds})
      .expect(200);   

    const data = await Order.find({})
    expect(data.length).toEqual(3)

    const { body } = await request(app)
      .get(`/api/order`)
      .set('Authorization', token)
      .expect(200)

    expect(body.data.orders.length).toEqual(2)
});
