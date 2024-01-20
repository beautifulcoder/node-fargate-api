import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as logs from 'aws-cdk-lib/aws-logs';

export class NodeFargateApiStack extends cdk.Stack {
  constructor (scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcId: 'vpc-0b4709032ac69c809'
    });

    const cluster = new ecs.Cluster(this, 'cluster', {
      vpc
    });

    const repository = ecr.Repository.fromRepositoryName(
      this,
      'repository',
      'pizza-fargate-api');

    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'api', {
      cluster,
      cpu: 256,
      desiredCount: 1,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
        containerPort: 80,
        logDriver: new ecs.AwsLogDriver({
          streamPrefix: 'api',
          logRetention: logs.RetentionDays.THREE_DAYS
        })
      },
      memoryLimitMiB: 512,
      publicLoadBalancer: true
    });

    service.targetGroup.configureHealthCheck({ path: '/health' });

    const table = new dynamodb.Table(this, 'table', {
      tableName: 'pizzas',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.NUMBER
      }
    });

    service.taskDefinition.taskRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['dynamodb:*'],
      resources: [table.tableArn]
    }));
  }
}
