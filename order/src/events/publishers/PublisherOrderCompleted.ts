import { client } from '../../services/NatsService'
import { NatsSubjects, BasePublisher, EventOrderCompleted } from "@conqueror-ecommerce/common";

class PublisherOrderCompleted extends BasePublisher<EventOrderCompleted> {
  subject: NatsSubjects.OrderCompleted = NatsSubjects.OrderCompleted;
}

export default new PublisherOrderCompleted(client);