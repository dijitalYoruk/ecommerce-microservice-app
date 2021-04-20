import { client } from '../../services/NatsService'
import { NatsSubjects, BasePublisher, EventOrderCancelled } from "@conqueror-ecommerce/common";

class PublisherOrderCancelled extends BasePublisher<EventOrderCancelled> {
  subject: NatsSubjects.OrderCancelled = NatsSubjects.OrderCancelled;
}

export default new PublisherOrderCancelled(client);