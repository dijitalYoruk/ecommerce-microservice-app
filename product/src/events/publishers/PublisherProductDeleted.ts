import { client } from '../../services/NatsService'
import { NatsSubjects, BasePublisher, EventProductDeleted } from "@conqueror-ecommerce/common";

class PublisherProductDeleted extends BasePublisher<EventProductDeleted> {
  subject: NatsSubjects.ProductDeleted = NatsSubjects.ProductDeleted;
}

export default new PublisherProductDeleted(client);