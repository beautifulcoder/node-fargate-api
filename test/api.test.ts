import { fastify } from '../app/api';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const send = jest.fn();
DynamoDBClient.prototype.send = send;

beforeEach(() => {
  send.mockReset();
});

test('GET returns 200', async () => {
  send.mockReturnValue(Promise.resolve({
    Item: {
      id: { N: '1' },
      name: { S: 'test-pizza' },
      ingredients: { SS: ['cheese'] }
    }
  }));

  const response = await fastify.inject({ method: 'GET', url: '/pizzas/1' });

  expect(response.statusCode).toBe(200);
});

test('GET returns 404', async () => {
  send.mockReturnValue(Promise.resolve({}));

  const response = await fastify.inject({ method: 'GET', url: '/pizzas/1' });

  expect(response.statusCode).toBe(404);
});

test('PUT returns 200', async () => {
  const response = await fastify.inject({
    method: 'PUT',
    url: '/pizzas/1',
    body: { name: 'test-pizza', ingredients: ['cheese'] }
  });

  expect(response.statusCode).toBe(200);
});
