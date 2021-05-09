import Product from '../../models/Product'
import { Message } from 'node-nats-streaming'
import { client } from '../../services/NatsService'
import { QUEUE_GROUP_NAME } from './QueueGroupName'
import { NatsSubjects, BaseListener, EventOrderExpired, OrderStatus } from '@conqueror-ecommerce/common'
import Order from '../../models/Order'
import PublisherOrderCancelled from '../publishers/PublisherOrderCancelled'


export class ListenerOrderExpired extends BaseListener<EventOrderExpired> {
    queueGroupName = QUEUE_GROUP_NAME
    subject: NatsSubjects.OrderExpired = NatsSubjects.OrderExpired

    async onMessage(data: EventOrderExpired['data'], msg: Message) {
        
        const order = await Order.findById(data.id)
        
        if (!order) {
            throw new Error('Order not Found.');
        }

        if ([OrderStatus.Complete, OrderStatus.Cancelled].includes(order.status)) {
            msg.ack()
        }

        order.set({ status: OrderStatus.Expired })
        await order.save()

        const products = order.products.map(orderProduct => {
            return { 
               id: orderProduct.product.id, 
               quantity: orderProduct.quantity, 
               unitSellPrice: orderProduct.unitSellPrice 
            } 
        })

        await PublisherOrderCancelled.publish({
            products,
            id: order.id,
            status: order.status,
            version: order.version,
            customerId: order.customer,
            expiresAt: order.expiresAt.toISOString(), 
        })

        msg.ack()
    }
}


export default new ListenerOrderExpired(client)