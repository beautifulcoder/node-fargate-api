#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NodeFargateApiStack } from '../lib/node-fargate-api-stack';

const app = new cdk.App();
new NodeFargateApiStack(app, 'fargate-api-stack', {
  env: { account: '158801581508', region: 'us-east-1' }
});
