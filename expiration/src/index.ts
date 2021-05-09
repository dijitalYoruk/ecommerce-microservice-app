import './services/NatsService'; // NATS Config
import ListenerOrderCreated from './events/listeners/ListenerOrderCreated'

ListenerOrderCreated.listen()