import { Message } from 'node-nats-streaming'
import { client } from '../../services/NatsService'
import { QUEUE_GROUP_NAME } from './QueueGroupName'
import { NatsSubjects, BaseListener, EventOrderCreated } from '@conqueror-ecommerce/common'
import { expirationQueue } from '../../queues/OrderExpirationQueue'


export class ListenerOrderCreated extends BaseListener<EventOrderCreated> {
    queueGroupName = QUEUE_GROUP_NAME
    subject: NatsSubjects.OrderCreated = NatsSubjects.OrderCreated

    async onMessage(data: EventOrderCreated['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log('Waiting this many milliseconds to process the job:', delay);
        expirationQueue.add({ orderId: data.id }, { delay })
        msg.ack()
    }
}


export default new ListenerOrderCreated(client)