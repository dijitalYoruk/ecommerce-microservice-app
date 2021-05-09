import { client } from '../../services/NatsService'
import { NatsSubjects, BasePublisher, EventOrderExpired } from "@conqueror-ecommerce/common";

class PublisherOrderExpired extends BasePublisher<EventOrderExpired> {
  subject: NatsSubjects.OrderExpired = NatsSubjects.OrderExpired;
}

export default new PublisherOrderExpired(client);