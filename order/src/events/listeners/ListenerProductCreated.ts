import Product from '../../models/Product'
import { Message } from 'node-nats-streaming'
import { client } from '../../services/NatsService'
import { QUEUE_GROUP_NAME } from './QueueGroupName'
import { NatsSubjects, BaseListener, EventProductCreated } from '@conqueror-ecommerce/common'


export class ListenerProductCreated extends BaseListener<EventProductCreated> {
    queueGroupName = QUEUE_GROUP_NAME
    subject: NatsSubjects.ProductCreated = NatsSubjects.ProductCreated

    async onMessage(data: EventProductCreated['data'], msg: Message) {
        const { productId, title, price, quantity, 
            placeholder, isQuantityRestricted } = data
        
        const product = Product.build({ 
            id: productId, title, price, quantity, 
            placeholder, isQuantityRestricted 
        })

        await product.save()
        msg.ack()
    }
}