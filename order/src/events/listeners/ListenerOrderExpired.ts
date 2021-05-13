import Order from '../../models/Order'
import { Message } from 'node-nats-streaming'
import { QUEUE_GROUP_NAME } from './QueueGroupName'
import PublisherOrderCancelled from '../publishers/PublisherOrderCancelled'
import { NatsSubjects, BaseListener, EventOrderExpired, OrderStatus } from '@conqueror-ecommerce/common'


export class ListenerOrderExpired extends BaseListener<EventOrderExpired> {
    queueGroupName = QUEUE_GROUP_NAME
    subject: NatsSubjects.OrderExpired = NatsSubjects.OrderExpired

    async onMessage(data: EventOrderExpired['data'], msg: Message) {
        
        const order = await Order.findById(data.id)
        
        if (!order) {
            throw new Error('Order not Found.');
        }

        if ([OrderStatus.Completed, OrderStatus.Cancelled].includes(order.status)) {
            msg.ack()
        }

        order.set({ status: OrderStatus.Expired })
        await order.save()

        const products = order.products.map(orderProduct => {
            return { 
               id: orderProduct.product as string, 
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