import mongoose from 'mongoose';
import Product from '../../../models/Product';
import { client } from '../../../services/NatsService';
import { EventProductCreated } from '@conqueror-ecommerce/common';
import { ListenerProductCreated } from '../ListenerProductCreated';

it('ListenerProductCreated', async () => {
    // build event data
    const eventData: EventProductCreated['data'] = {
        price: 500,
        quantity: 100,
        title: 'product title 1',
        isQuantityRestricted: true,
        placeholder: 'placeholder1',
        id: mongoose.Types.ObjectId().toHexString()
    }

    // @ts-ignore
    const message: Message = { ack: jest.fn() }

    // check listener
    await new ListenerProductCreated(client).onMessage(eventData, message)
    expect(message.ack).toHaveBeenCalled()

    // retrieve updated products
    const products = await Product.find()
    expect(products.length).toEqual(1)
    const product = products[0]

    // check props
    expect(product.id).toEqual(eventData.id)
    expect(product.price).toEqual(eventData.price)
    expect(product.title).toEqual(eventData.title)
    expect(product.quantity).toEqual(eventData.quantity)
    expect(product.placeholder).toEqual(eventData.placeholder)
    expect(product.isQuantityRestricted).toEqual(eventData.isQuantityRestricted) 
})