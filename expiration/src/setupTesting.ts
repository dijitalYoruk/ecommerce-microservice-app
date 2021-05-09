import jwt from 'jsonwebtoken';

jest.mock('./services/NatsService', () => jest.requireActual('./__mocks__/NatsService'))
jest.mock('./queues/OrderExpirationQueue', () => jest.requireActual('./__mocks__/OrderExpirationQueue'))