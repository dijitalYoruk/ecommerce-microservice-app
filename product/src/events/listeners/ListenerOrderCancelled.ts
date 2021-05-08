import { Message } from 'node-nats-streaming'
import { client } from '../../services/NatsService'
import { QUEUE_GROUP_NAME } from './QueueGroupName'
import Product, { ProductDoc } from '../../models/product'
import PublisherProductUpdated from '../publishers/PublisherProductUpdated'
import { NatsSubjects, BaseListener, EventOrderCancelled } from '@conqueror-ecommerce/common'


export class ListenerOrderCancelled extends BaseListener<EventOrderCancelled> {
    queueGroupName = QUEUE_GROUP_NAME
    subject: NatsSubjects.OrderCancelled = NatsSubjects.OrderCancelled

    async onMessage(data: EventOrderCancelled['data'], msg: Message) {
        // retrieve products
        const productIds = data.products.map(product => product.id)
        const productQuantities = data.products.map(product => product.quantity)
        const products: ProductDoc[] = await Product.find({ _id: { $in: productIds } })

        // update products 
        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i]
            const orderQuantity = productQuantities[i]
            const product = products.find(product => product.id === productId)
            if (!product || !product.isQuantityRestricted) continue

            // update quantity
            product.quantity! += orderQuantity
            await product.save()
        
            // publish update event
            const { id, title, placeholder, version, price, quantity, isQuantityRestricted } = product
            await PublisherProductUpdated.publish({ id, title, placeholder, price, quantity, version, isQuantityRestricted })
        }

        msg.ack()
    }
}

export default new ListenerOrderCancelled(client)