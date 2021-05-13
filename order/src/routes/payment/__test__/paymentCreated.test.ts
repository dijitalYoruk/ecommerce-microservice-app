import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import stripe from '../../../services/Stripe';
import { PaymentDoc } from '../../../models/Payment';
import { client } from '../../../services/NatsService';
import { OrderStatus } from '@conqueror-ecommerce/common';

it('POST: /api/payment --> Unauthorized', async () => {
    await request(app).post(`/api/payment`).expect(401);
})

it('POST: /api/payment --> missing order id', async () => {
    await request(app)
        .post(`/api/payment`)
        .set('Authorization', global.signin())
        .send({ token: 'tok_visa' })
        .expect(400);
})

it('POST: /api/payment --> missing token', async () => {
    await request(app)
        .post(`/api/payment`)
        .set('Authorization', global.signin())
        .send({ orderId: 'orderId' })
        .expect(400);
})


it('POST: /api/payment --> expired order', async () => {

    const product = Product.build({
        price: 500,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 1',
        id: mongoose.Types.ObjectId().toHexString()
    });

    await product.save()

    const payload = {
        username: 'testUser',
        email: 'test@test.com',
        id: new mongoose.Types.ObjectId().toHexString(),
    };

    const token = global.signinCustom(payload)

    const order = Order.build({
        expiresAt: new Date(),
        customer: payload.id,
        status: OrderStatus.Expired,
        products: [{
            quantity: 1,
            unitSellPrice: 20,
            product: product.id,
        }]
    })

    await order.save()

    await request(app)
        .post(`/api/payment`)
        .set('Authorization', token)
        .send({ token: 'tok_visa', orderId: order.id })
        .expect(400);
})


it('POST: /api/payment --> cancelled order', async () => {

    const product = Product.build({
        price: 500,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 1',
        id: mongoose.Types.ObjectId().toHexString()
    });

    await product.save()

    const payload = {
        username: 'testUser',
        email: 'test@test.com',
        id: new mongoose.Types.ObjectId().toHexString(),
    };

    const token = global.signinCustom(payload)

    const order = Order.build({
        expiresAt: new Date(),
        customer: payload.id,
        status: OrderStatus.Cancelled,
        products: [{
            quantity: 1,
            unitSellPrice: 20,
            product: product.id,
        }]
    })

    await order.save()

    await request(app)
        .post(`/api/payment`)
        .set('Authorization', token)
        .send({ token: 'tok_visa', orderId: order.id })
        .expect(400);
})

it('POST: /api/payment --> completed order', async () => {

    const product = Product.build({
        price: 500,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 1',
        id: mongoose.Types.ObjectId().toHexString()
    });

    await product.save()

    const payload = {
        username: 'testUser',
        email: 'test@test.com',
        id: new mongoose.Types.ObjectId().toHexString(),
    };

    const token = global.signinCustom(payload)

    const order = Order.build({
        expiresAt: new Date(),
        customer: payload.id,
        status: OrderStatus.Completed,
        products: [{
            quantity: 1,
            unitSellPrice: 20,
            product: product.id,
        }]
    })

    order.payment = new mongoose.Types.ObjectId().toHexString()
    await order.save()

    await request(app)
        .post(`/api/payment`)
        .set('Authorization', token)
        .send({ token: 'tok_visa', orderId: order.id })
        .expect(400);
})


it('POST: /api/payment --> unauthorized order', async () => {

    const product = Product.build({
        price: 500,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 1',
        id: mongoose.Types.ObjectId().toHexString()
    });

    await product.save()

    const payload = {
        username: 'testUser',
        email: 'test@test.com',
        id: new mongoose.Types.ObjectId().toHexString(),
    };

    const order = Order.build({
        expiresAt: new Date(),
        customer: payload.id,
        status: OrderStatus.Cancelled,
        products: [{
            quantity: 1,
            unitSellPrice: 20,
            product: product.id,
        }]
    })

    await order.save()

    await request(app)
        .post(`/api/payment`)
        .set('Authorization', global.signin())
        .send({ token: 'tok_visa', orderId: order.id })
        .expect(401);
})


it('POST: /api/payment --> success', async () => {

    const product = Product.build({
        price: 500,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 1',
        id: mongoose.Types.ObjectId().toHexString()
    });

    await product.save()

    const payload = {
        username: 'testUser',
        email: 'test@test.com',
        id: new mongoose.Types.ObjectId().toHexString(),
    };

    const token = global.signinCustom(payload)

    const order = Order.build({
        expiresAt: new Date(),
        customer: payload.id,
        status: OrderStatus.Created,
        products: [{
            product: product.id,
            quantity: 1,
            unitSellPrice: 20
        }]
    })

    await order.save()

    await request(app)
        .post(`/api/payment`)
        .set('Authorization', token)
        .send({ token: 'tok_visa', orderId: order.id })
        .expect(200)

    const orderUpdated = await Order.findById(order.id).populate('payment')
    const payment = orderUpdated!.payment as PaymentDoc
    const charge = await stripe.charges.retrieve(payment.stripeId)

    expect(client.publish).toHaveBeenCalled()
    expect(charge.id).toEqual(payment.stripeId)
    expect(charge.amount).toEqual(payment.amount * 100)
})