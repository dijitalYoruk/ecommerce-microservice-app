import { Message } from 'node-nats-streaming'
import { QUEUE_GROUP_NAME } from './QueueGroupName'
import { expirationQueue } from '../../queues/OrderExpirationQueue'
import { NatsSubjects, BaseListener, EventOrderCreated } from '@conqueror-ecommerce/common'


export class ListenerOrderCreated extends BaseListener<EventOrderCreated> {
    queueGroupName = QUEUE_GROUP_NAME
    subject: NatsSubjects.OrderCreated = NatsSubjects.OrderCreated

    async onMessage(data: EventOrderCreated['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log('Waiting this many milliseconds to process the job:', delay);
        expirationQueue.add({ orderId: data.order }, { delay })
        msg.ack()
    }
}