import mongoose from 'mongoose';
import Product from '../../../models/product';
import { client } from '../../../services/NatsService';
import ListenerOrderCancelled from '../ListenerOrderCancelled';
import { EventOrderCreated, OrderStatus } from '@conqueror-ecommerce/common';

const description = 'new description new description \
                     new description new description \
                     new description new description \
                     new description new description';

it('ListenerOrderCreated', async () => {

    // build products
    let product1 = Product.build({
        price: 500,
        description,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: false,
        placeholder: 'new placeholder 1',
        authorId: mongoose.Types.ObjectId().toHexString()
    })

    let product2 = Product.build({
        price: 500,
        description,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 1',
        authorId: mongoose.Types.ObjectId().toHexString()
    })

    let product3 = Product.build({
        price: 500,
        description,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'new placeholder 1',
        authorId: mongoose.Types.ObjectId().toHexString()
    })

    await product1.save()
    await product2.save()
    await product3.save()

    // build event data
    const eventData: EventOrderCreated['data'] = {
        version: 1,
        expiresAt: 'dummy',
        customerId: 'dummy',
        status: OrderStatus.Created,
        id: mongoose.Types.ObjectId().toHexString(),
        products: [
            { id: product1.id, quantity: 3, unitSellPrice: 12 },
            { id: product2.id, quantity: 5, unitSellPrice: 30 },
            { id: product3.id, quantity: 1, unitSellPrice: 50 },
        ]
    }

    // @ts-ignore
    const message: Message = { ack: jest.fn() }

    // check listener
    await ListenerOrderCancelled.onMessage(eventData, message)
    expect(message.ack).toHaveBeenCalled()

    // retrieve updated products
    const productUpdated1 = await Product.findById(product1.id)
    const productUpdated2 = await Product.findById(product2.id)
    const productUpdated3 = await Product.findById(product3.id)

    // check quantity
    expect(productUpdated1?.quantity).toEqual(undefined)
    expect(productUpdated2?.quantity).toEqual(product2.quantity! + eventData.products[1].quantity)
    expect(productUpdated3?.quantity).toEqual(product3.quantity! + eventData.products[2].quantity)

    // check event publishment
    expect(client.publish).toHaveBeenCalled()
})