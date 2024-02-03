import Fastify from 'fastify';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient();

export const fastify = Fastify({
  logger: false
});

fastify.get('/pizzas/:id', async (request, reply) => {
  const { id } = request.params as any;

  const res = await client.send(new GetItemCommand({
    TableName: 'pizzas',
    Key: { id: { N: id } }
  }));

  const item = res.Item;

  if (item === undefined) {
    reply.callNotFound();

    return;
  }

  const pizza = unmarshall(item);
  const { ingredients } = pizza;

  await reply
    .status(200)
    .send({ ...pizza, ingredients: [...ingredients] });
});

fastify.put('/pizzas/:id', async (request, reply) => {
  const { id } = request.params as any;
  const { name, ingredients } = request.body as any;

  const pizza = {
    id: { N: id },
    name: { S: name },
    ingredients: { SS: ingredients }
  };

  await client.send(new PutItemCommand({
    TableName: 'pizzas',
    Item: pizza
  }));

  await reply
    .status(200)
    .send({ id, name, ingredients });
});

fastify.get('/health', async (request, reply) => {
  await reply.status(200).send();
});

const { ADDRESS = 'localhost', PORT = 3000 } = process.env;

const start = async (): Promise<void> => {
  try {
    await fastify.listen({ port: Number(PORT), host: ADDRESS });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

if (process.env.JEST_WORKER_ID === undefined) {
  void start();
}
