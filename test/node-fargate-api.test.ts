import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as api from '../lib/node-fargate-api-stack';

test('Fargate service created', () => {
  const app = new cdk.App();

  const stack = new api.NodeFargateApiStack(app, 'test-stack', {
    env: { account: '0123456789', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::ECS::Service', {
    LaunchType: 'FARGATE',
    LoadBalancers: [
      {
        ContainerName: 'web',
        ContainerPort: 80
      }
    ]
  });
});

test('DynamoDB table created', () => {
  const app = new cdk.App();

  const stack = new api.NodeFargateApiStack(app, 'test-stack', {
    env: { account: '0123456789', region: 'us-east-1' }
  });

  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::DynamoDB::Table', {
    TableName: 'pizzas'
  });
});
