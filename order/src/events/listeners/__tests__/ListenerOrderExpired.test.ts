import mongoose from 'mongoose';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { client } from '../../../services/NatsService';
import ListenerOrderExpired from '../ListenerOrderExpired';
import { OrderStatus, EventOrderExpired } from '@conqueror-ecommerce/common';

it('ListenerProductExpired', async () => {

    const product = Product.build({
        price: 500,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'placeholder1',
        id: mongoose.Types.ObjectId().toHexString()
    })

    await product.save()

    const order = Order.build({
        expiresAt: new Date(),
        customer: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        products: [{
            product,
            quantity: 2, 
            unitSellPrice: product.price
        }]
    })

    await order.save()

    // build event data
    const eventData: EventOrderExpired['data'] = { id: order.id }

    // @ts-ignore
    const message: Message = { ack: jest.fn() }

    // check listener
    await ListenerOrderExpired.onMessage(eventData, message)
    expect(message.ack).toHaveBeenCalled()

    // retrieve updated order
    const orderUpdated = await Order.findById(order.id)

    // check props
    expect(orderUpdated!.status).toEqual(OrderStatus.Expired) 
    expect(client.publish).toHaveBeenCalled()
})