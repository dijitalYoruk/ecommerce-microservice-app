  
import Queue from 'bull';
import keys from '../util/keys';
import PublisherOrderExpired from '../events/publishers/PublisherOrderExpired'

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: { host: keys.REDIS_HOST },
});

expirationQueue.process(async (job) => {
    const { orderId } = job.data
    PublisherOrderExpired.publish({ order: orderId });
});

export { expirationQueue };