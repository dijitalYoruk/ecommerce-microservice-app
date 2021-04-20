import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import Order from '../../models/Order';
import Product from '../../models/Product';
import { client } from '../../services/NatsService';

const description = 'new description new description \
                     new description new description \
                     new description new description \
                     new description new description';


const sendRequest = async (body: any, status: number) => {
   await request(app)
      .post('/api/order')
      .set('Authorization', global.signin())
      .send(body)
      .expect(status);    
}

it('POST:/api/order --> Unauthorized', async () => {
    await request(app).post(`/api/order`).expect(401);   
});

it('POST:/api/order --> Products not found', async () => {
    const productIds = [
        mongoose.Types.ObjectId(),
        mongoose.Types.ObjectId(),
    ]

    await sendRequest({ productIds }, 400) 
});

it('POST:/api/product --> Missing ProductIds', async () => {
    await sendRequest({}, 400) 
});


it('POST:/api/order --> Creates an order for multiple product.', async () => {
    const authorId = mongoose.Types.ObjectId().toHexString()

    const product1 = Product.build({
        authorId,
        price: 500,
        description,
        title: 'product title 1',
        placeholder: 'new placeholder 1'
    });

    const product2 = Product.build({
        authorId,
        price: 500,
        description,
        title: 'product title 2',
        placeholder: 'new placeholder 2'
    });

    await product1.save();
    await product2.save();
    
    const productIds = [
        product1.id,
        product2.id
    ]

    await sendRequest({productIds}, 200) 
    expect(client.publish).toHaveBeenCalled()

    const data = await Order.find({})
    expect(data.length).toEqual(1)
    const order = data[0]
    expect(order.products.length).toEqual(2)
    expect(client.publish).toHaveBeenCalled()
});


it('POST:/api/order --> Creates an order for a single product.', async () => {
    const authorId = mongoose.Types.ObjectId().toHexString()

    const product1 = Product.build({
        authorId,
        price: 500,
        description,
        title: 'product title 1',
        placeholder: 'new placeholder 1'
    });

    await product1.save();
    
    const productIds = [ product1.id ]
    await sendRequest({productIds}, 200) 
    const data = await Order.find({})
    expect(data.length).toEqual(1)
    const order = data[0]
    expect(order.products.length).toEqual(1)
    expect(client.publish).toHaveBeenCalled()
});