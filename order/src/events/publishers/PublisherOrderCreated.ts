import { client } from '../../services/NatsService'
import { NatsSubjects, BasePublisher, EventOrderCreated } from "@conqueror-ecommerce/common";

class PublisherOrderCreated extends BasePublisher<EventOrderCreated> {
  subject: NatsSubjects.OrderCreated = NatsSubjects.OrderCreated;
}

export default new PublisherOrderCreated(client);