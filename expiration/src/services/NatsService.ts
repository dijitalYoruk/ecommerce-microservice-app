import Keys from '../util/keys';
import nats from 'node-nats-streaming';
import { ListenerOrderCreated } from '../events/listeners/ListenerOrderCreated'

const client = nats.connect(
   Keys.NATS_CLUSTER_ID!, 
   Keys.NATS_CLIENT_ID!, 
   { url: Keys.NATS_URL });

client.on('connect', () => { 
   console.log('NATS connection successful.') 
   new ListenerOrderCreated(client).listen()
});

client.on('error', err => console.log(`NATS connection error: ${err}`));

client.on('close', () => {
   console.log('Client closing...');
   process.exit();
});

process.on('SIGINT', () => client.close());
process.on('SIGTERM', () => client.close());

export { client };