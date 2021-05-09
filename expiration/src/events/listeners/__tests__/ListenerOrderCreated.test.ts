import ListenerOrderCreated from '../ListenerOrderCreated';
import { expirationQueue } from '../../../queues/OrderExpirationQueue';
import { EventOrderCreated, OrderStatus } from '@conqueror-ecommerce/common';


it('ListenerOrderCreated', async () => {

    // build event data
    const expiresAt = new Date()
    expiresAt.setMinutes(new Date().getSeconds() + 10)

    const eventData: EventOrderCreated['data'] = {
        version: 1,
        id: 'dummy',
        customerId: 'dummy',
        status: OrderStatus.Created,
        expiresAt: expiresAt.toISOString(),
        products: [
            { id: 'product1.id', quantity: 3, unitSellPrice: 12 },
        ]
    }

    // @ts-ignore
    const message: Message = { ack: jest.fn() }

    // check listener
    await ListenerOrderCreated.onMessage(eventData, message)
    expect(message.ack).toHaveBeenCalled()

    // check event publishment
    expect(expirationQueue.add).toHaveBeenCalled()
})