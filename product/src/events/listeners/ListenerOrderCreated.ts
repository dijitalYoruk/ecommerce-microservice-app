import { Message } from 'node-nats-streaming'
import { QUEUE_GROUP_NAME } from './QueueGroupName'
import Product, { ProductDoc } from '../../models/Product'
import PublisherProductUpdated from '../publishers/PublisherProductUpdated'
import { NatsSubjects, BaseListener, EventOrderCreated } from '@conqueror-ecommerce/common'


export class ListenerOrderCreated extends BaseListener<EventOrderCreated> {
    queueGroupName = QUEUE_GROUP_NAME
    subject: NatsSubjects.OrderCreated = NatsSubjects.OrderCreated

    async onMessage(data: EventOrderCreated['data'], msg: Message) {
        // retrieve products
        const productIds = data.products.map(product => product.id)
        const productQuantities = data.products.map(product => product.quantity)
        const products: ProductDoc[] = await Product.find({ _id: { $in: productIds } })

        // update products quantities
        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i]
            const allocatedQuantity = productQuantities[i]
            const product = products.find(product => product.id === productId)
            if (!product || !product.isQuantityRestricted) continue

            // update quantity
            product.quantity! -= allocatedQuantity
            await product.save()

            // publish update event
            const { id, title, price, placeholder, version, quantity, isQuantityRestricted } = product
            await PublisherProductUpdated.publish({ id, title, price, placeholder, version, quantity, isQuantityRestricted })
        }

        msg.ack()
    }
}
