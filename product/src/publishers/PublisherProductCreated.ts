import NatsService from '../services/NatsService'
import { NatsSubjects, BasePublisher, EventProductCreated } from "@conqueror-ecommerce/common";

class PublisherProductCreated extends BasePublisher<EventProductCreated> {
  subject: NatsSubjects.ProductCreated = NatsSubjects.ProductCreated;
}

export default new PublisherProductCreated(NatsService.client!);