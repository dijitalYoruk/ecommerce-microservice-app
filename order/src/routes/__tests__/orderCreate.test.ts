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
      .expect(status)
}

it('POST:/api/order --> Unauthorized', async () => {
    await request(app).post(`/api/order`).expect(401);   
});

it('POST:/api/product --> Missing ProductIds', async () => {
    const productQuantities = [5, 8]
    await sendRequest({ productQuantities }, 400) 
});

it('POST:/api/product --> Missing Product Quantities', async () => {
    const productIds = [mongoose.Types.ObjectId(), mongoose.Types.ObjectId()]
    await sendRequest({ productIds }, 400) 
});

it('POST:/api/product --> Missing ProductIds and Product Quantities', async () => {
    await sendRequest({}, 400) 
});

it('POST:/api/order --> Product quantity not defined for each product', async () => {
    let productQuantities = [5]
    const productIds = [mongoose.Types.ObjectId(), mongoose.Types.ObjectId()]
    await sendRequest({ productIds, productQuantities }, 400) 
    productQuantities = [5, 8, 10]
    await sendRequest({ productIds, productQuantities }, 400) 
});

it('POST:/api/order --> Products not found', async () => {
    const productQuantities = [5, 8]
    const productIds = [mongoose.Types.ObjectId(), mongoose.Types.ObjectId()]
    await sendRequest({ productIds, productQuantities }, 400) 
});

it('POST:/api/order --> Creates an order for multiple product.', async () => {
    const product1 = Product.build({
        price: 500,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 1',
        id: mongoose.Types.ObjectId().toHexString()
    });

    const product2 = Product.build({
        price: 500,
        quantity: 50,
        title: 'product title 2',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 2',
        id: mongoose.Types.ObjectId().toHexString()
    });

    await product1.save();
    await product2.save();

    const productQuantities = [5, 8]
    const productIds = [product1.id, product2.id]
    await sendRequest({ productIds, productQuantities }, 200) 

    const data = await Order.find({})
    expect(data.length).toEqual(1)
    const order = data[0]
    expect(order.products.length).toEqual(2)
    expect(client.publish).toHaveBeenCalled()
});

it('POST:/api/order --> Quantity not enough', async () => {
    const product1 = Product.build({
        price: 500,
        quantity: 1,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 1',
        id: mongoose.Types.ObjectId().toHexString()
    });

    const product2 = Product.build({
        price: 500,
        quantity: 5,
        title: 'product title 2',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 2',
        id: mongoose.Types.ObjectId().toHexString()
    });

    await product1.save();
    await product2.save();

    const productQuantities = [5, 8]
    const productIds = [product1.id, product2.id]
    await sendRequest({ productIds, productQuantities }, 400) 
    
    const data = await Order.find({})
    expect(data.length).toEqual(0)
    expect(client.publish).not.toHaveBeenCalled()
});

it('POST:/api/order --> No Quantity Restriction', async () => {
    const product1 = Product.build({
        price: 500,
        quantity: 1,
        title: 'product title 1',
        isQuantityRestricted: false,
        placeholder: 'new placeholder 1',
        id: mongoose.Types.ObjectId().toHexString()
    });

    const product2 = Product.build({
        price: 500,
        quantity: 5,
        title: 'product title 2',
        isQuantityRestricted: false,
        placeholder: 'new placeholder 2',
        id: mongoose.Types.ObjectId().toHexString()
    });

    await product1.save();
    await product2.save();
    
    const productQuantities = [5, 8]
    const productIds = [product1.id, product2.id]
    await sendRequest({ productIds, productQuantities }, 200) 

    const data = await Order.find({})
    expect(data.length).toEqual(1)
    const order = data[0]
    expect(order.products.length).toEqual(2)
    expect(client.publish).toHaveBeenCalled()
});

it('POST:/api/order --> Creates an order for a single product.', async () => {    
    const product1 = Product.build({
        price: 500,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 1',
        id: mongoose.Types.ObjectId().toHexString()
    });

    await product1.save();

    const productQuantities = [5]
    const productIds = [ product1.id ]
    await sendRequest({productIds, productQuantities}, 200) 

    const data = await Order.find({})
    expect(data.length).toEqual(1)
    const order = data[0]
    expect(order.products.length).toEqual(1)
    expect(client.publish).toHaveBeenCalled()
});