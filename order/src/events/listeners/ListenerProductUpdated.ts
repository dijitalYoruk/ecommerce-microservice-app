import Product from '../../models/Product'
import { Message } from 'node-nats-streaming'
import { QUEUE_GROUP_NAME } from './QueueGroupName'
import { NatsSubjects, BaseListener, EventProductUpdated } from '@conqueror-ecommerce/common'


export class ListenerProductUpdated extends BaseListener<EventProductUpdated> {
    queueGroupName = QUEUE_GROUP_NAME
    subject: NatsSubjects.ProductUpdated = NatsSubjects.ProductUpdated

    async onMessage(data: EventProductUpdated['data'], msg: Message) {
        const product = await Product.findByEvent(data)

        if (!product) { // product not found
            throw new Error('Product Not Found')
        }

        // update product
        const { title, price, quantity, placeholder, isQuantityRestricted } = data
        product.set({ title, price, quantity, placeholder, isQuantityRestricted })
        await product.save()
        msg.ack()
    }
}