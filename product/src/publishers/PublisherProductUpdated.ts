import { client } from '../services/NatsService'
import { NatsSubjects, BasePublisher, EventProductUpdated } from "@conqueror-ecommerce/common";

class PublisherProductUpdated extends BasePublisher<EventProductUpdated> {
  subject: NatsSubjects.ProductUpdated = NatsSubjects.ProductUpdated;
}

export default new PublisherProductUpdated(client);