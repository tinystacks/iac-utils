const mockResolve = jest.fn();
const mockReadFileSync = jest.fn();

jest.mock('path', () => ({
  resolve: mockResolve
}));

jest.mock('fs', () => ({
  readFileSync: mockReadFileSync
}));

import {
  parseCdkDiff,
  parseTerraformDiff
} from '../../../../src/cli/commands/smoke-test/parser';
import { ChangeType, IacFormat } from '../../../../src/cli/types';

const mockCdkDiff = `
Stack TestStack
Resources
[-] AWS::SQS::Queue SecondQueueD5D7042B destroy
[+] AWS::SQS::Queue ThirdQueue ThirdQueue074C5B0A 
[~] AWS::SQS::Queue FirstQueue FirstQueue19075403 
 └─ [~] VisibilityTimeout
     ├─ [-] 30
     └─ [+] 45
`;

const mockCdkTemplate = `{
  "Resources": {
   "FirstQueue19075403": {
    "Type": "AWS::SQS::Queue",
    "Properties": {
     "QueueName": "first-queue",
     "VisibilityTimeout": 45
    },
    "UpdateReplacePolicy": "Delete",
    "DeletionPolicy": "Delete",
    "Metadata": {
     "aws:cdk:path": "TestStack/FirstQueue/Resource"
    }
   },
   "ThirdQueue074C5B0A": {
    "Type": "AWS::SQS::Queue",
    "Properties": {
     "QueueName": "third-queue",
     "VisibilityTimeout": 30
    },
    "UpdateReplacePolicy": "Delete",
    "DeletionPolicy": "Delete",
    "Metadata": {
     "aws:cdk:path": "TestStack/ThirdQueue/Resource"
    }
   },
   "CDKMetadata": {
    "Type": "AWS::CDK::Metadata",
    "Properties": {
     "Analytics": "v2:deflate64:H4sIAAAAAAAA/zPSMzbXM1BMLC/WTU7J1s3JTNKrDi5JTM7WAQrFFxcW61UHlqaWpuo4p+WBGbUgVlBqcX5pUTJY1Dk/LyWzJDM/r1YnLz8lVS+rWL/M0EzPEGRsVnFmpm5RaV5JZm6qXhCEBgDXDwyzcgAAAA=="
    },
    "Metadata": {
     "aws:cdk:path": "TestStack/CDKMetadata/Default"
    },
    "Condition": "CDKMetadataAvailable"
   }
  },
  "Parameters": {
   "BootstrapVersion": {
    "Type": "AWS::SSM::Parameter::Value<String>",
    "Default": "/cdk-bootstrap/hnb659fds/version",
    "Description": "Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]"
   }
  }
 }`;

 // TODO: update test data with a tf plan that performs a replacement to test "afterAction" branch
 const mockTfPlan = `{"format_version":"1.1","terraform_version":"1.2.3","variables":{"queue_name":{"value":"smoke-test-sqs"},"visibility_timeout":{"value":45}},"planned_values":{"outputs":{"test_tf_sqs_arn":{"sensitive":false,"type":"string","value":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs"},"test_tf_sqs_url":{"sensitive":false,"type":"string","value":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs"}},"root_module":{"resources":[{"address":"aws_sqs_queue.test_tf_sqs","mode":"managed","type":"aws_sqs_queue","name":"test_tf_sqs","provider_name":"registry.terraform.io/hashicorp/aws","schema_version":0,"values":{"arn":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs","content_based_deduplication":false,"deduplication_scope":"","delay_seconds":0,"fifo_queue":false,"fifo_throughput_limit":"","id":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","kms_data_key_reuse_period_seconds":300,"kms_master_key_id":"","max_message_size":262144,"message_retention_seconds":345600,"name":"smoke-test-sqs","name_prefix":"","policy":"","receive_wait_time_seconds":0,"redrive_allow_policy":"","redrive_policy":"","sqs_managed_sse_enabled":true,"tags":{},"tags_all":{},"url":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","visibility_timeout_seconds":30},"sensitive_values":{"tags":{},"tags_all":{}}},{"address":"aws_sqs_queue.test_tf_sqs_3","mode":"managed","type":"aws_sqs_queue","name":"test_tf_sqs_3","provider_name":"registry.terraform.io/hashicorp/aws","schema_version":0,"values":{"content_based_deduplication":false,"delay_seconds":0,"fifo_queue":false,"kms_master_key_id":null,"max_message_size":262144,"message_retention_seconds":345600,"name":"smoke-test-sqs-3","receive_wait_time_seconds":0,"redrive_allow_policy":null,"redrive_policy":null,"tags":null,"visibility_timeout_seconds":45},"sensitive_values":{"tags_all":{}}}]}},"resource_drift":[{"address":"aws_sqs_queue.test_tf_sqs_2","mode":"managed","type":"aws_sqs_queue","name":"test_tf_sqs_2","provider_name":"registry.terraform.io/hashicorp/aws","change":{"actions":["update"],"before":{"arn":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs-2","content_based_deduplication":false,"deduplication_scope":"","delay_seconds":0,"fifo_queue":false,"fifo_throughput_limit":"","id":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs-2","kms_data_key_reuse_period_seconds":300,"kms_master_key_id":"","max_message_size":262144,"message_retention_seconds":345600,"name":"smoke-test-sqs-2","name_prefix":"","policy":"","receive_wait_time_seconds":0,"redrive_allow_policy":"","redrive_policy":"","sqs_managed_sse_enabled":true,"tags":null,"tags_all":{},"url":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs-2","visibility_timeout_seconds":45},"after":{"arn":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs-2","content_based_deduplication":false,"deduplication_scope":"","delay_seconds":0,"fifo_queue":false,"fifo_throughput_limit":"","id":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs-2","kms_data_key_reuse_period_seconds":300,"kms_master_key_id":"","max_message_size":262144,"message_retention_seconds":345600,"name":"smoke-test-sqs-2","name_prefix":"","policy":"","receive_wait_time_seconds":0,"redrive_allow_policy":"","redrive_policy":"","sqs_managed_sse_enabled":true,"tags":{},"tags_all":{},"url":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs-2","visibility_timeout_seconds":45},"after_unknown":{},"before_sensitive":{"tags_all":{}},"after_sensitive":{"tags":{},"tags_all":{}}}}],"resource_changes":[{"address":"aws_sqs_queue.test_tf_sqs","mode":"managed","type":"aws_sqs_queue","name":"test_tf_sqs","provider_name":"registry.terraform.io/hashicorp/aws","change":{"actions":["update"],"before":{"arn":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs","content_based_deduplication":false,"deduplication_scope":"","delay_seconds":0,"fifo_queue":false,"fifo_throughput_limit":"","id":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","kms_data_key_reuse_period_seconds":300,"kms_master_key_id":"","max_message_size":262144,"message_retention_seconds":345600,"name":"smoke-test-sqs","name_prefix":"","policy":"","receive_wait_time_seconds":0,"redrive_allow_policy":"","redrive_policy":"","sqs_managed_sse_enabled":true,"tags":{},"tags_all":{},"url":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","visibility_timeout_seconds":45},"after":{"arn":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs","content_based_deduplication":false,"deduplication_scope":"","delay_seconds":0,"fifo_queue":false,"fifo_throughput_limit":"","id":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","kms_data_key_reuse_period_seconds":300,"kms_master_key_id":"","max_message_size":262144,"message_retention_seconds":345600,"name":"smoke-test-sqs","name_prefix":"","policy":"","receive_wait_time_seconds":0,"redrive_allow_policy":"","redrive_policy":"","sqs_managed_sse_enabled":true,"tags":{},"tags_all":{},"url":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","visibility_timeout_seconds":30},"after_unknown":{},"before_sensitive":{"tags":{},"tags_all":{}},"after_sensitive":{"tags":{},"tags_all":{}}}},{"address":"aws_sqs_queue.test_tf_sqs_2","mode":"managed","type":"aws_sqs_queue","name":"test_tf_sqs_2","provider_name":"registry.terraform.io/hashicorp/aws","change":{"actions":["delete"],"before":{"arn":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs-2","content_based_deduplication":false,"deduplication_scope":"","delay_seconds":0,"fifo_queue":false,"fifo_throughput_limit":"","id":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs-2","kms_data_key_reuse_period_seconds":300,"kms_master_key_id":"","max_message_size":262144,"message_retention_seconds":345600,"name":"smoke-test-sqs-2","name_prefix":"","policy":"","receive_wait_time_seconds":0,"redrive_allow_policy":"","redrive_policy":"","sqs_managed_sse_enabled":true,"tags":{},"tags_all":{},"url":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs-2","visibility_timeout_seconds":45},"after":null,"after_unknown":{},"before_sensitive":{"tags":{},"tags_all":{}},"after_sensitive":false},"action_reason":"delete_because_no_resource_config"},{"address":"aws_sqs_queue.test_tf_sqs_3","mode":"managed","type":"aws_sqs_queue","name":"test_tf_sqs_3","provider_name":"registry.terraform.io/hashicorp/aws","change":{"actions":["create"],"before":null,"after":{"content_based_deduplication":false,"delay_seconds":0,"fifo_queue":false,"kms_master_key_id":null,"max_message_size":262144,"message_retention_seconds":345600,"name":"smoke-test-sqs-3","receive_wait_time_seconds":0,"redrive_allow_policy":null,"redrive_policy":null,"tags":null,"visibility_timeout_seconds":45},"after_unknown":{"arn":true,"deduplication_scope":true,"fifo_throughput_limit":true,"id":true,"kms_data_key_reuse_period_seconds":true,"name_prefix":true,"policy":true,"sqs_managed_sse_enabled":true,"tags_all":true,"url":true},"before_sensitive":false,"after_sensitive":{"tags_all":{}}}}],"output_changes":{"test_tf_sqs_arn":{"actions":["no-op"],"before":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs","after":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs","after_unknown":false,"before_sensitive":false,"after_sensitive":false},"test_tf_sqs_url":{"actions":["no-op"],"before":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","after":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","after_unknown":false,"before_sensitive":false,"after_sensitive":false}},"prior_state":{"format_version":"1.0","terraform_version":"1.2.3","values":{"outputs":{"test_tf_sqs_arn":{"sensitive":false,"value":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs","type":"string"},"test_tf_sqs_url":{"sensitive":false,"value":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","type":"string"}},"root_module":{"resources":[{"address":"aws_sqs_queue.test_tf_sqs","mode":"managed","type":"aws_sqs_queue","name":"test_tf_sqs","provider_name":"registry.terraform.io/hashicorp/aws","schema_version":0,"values":{"arn":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs","content_based_deduplication":false,"deduplication_scope":"","delay_seconds":0,"fifo_queue":false,"fifo_throughput_limit":"","id":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","kms_data_key_reuse_period_seconds":300,"kms_master_key_id":"","max_message_size":262144,"message_retention_seconds":345600,"name":"smoke-test-sqs","name_prefix":"","policy":"","receive_wait_time_seconds":0,"redrive_allow_policy":"","redrive_policy":"","sqs_managed_sse_enabled":true,"tags":{},"tags_all":{},"url":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs","visibility_timeout_seconds":45},"sensitive_values":{"tags":{},"tags_all":{}}},{"address":"aws_sqs_queue.test_tf_sqs_2","mode":"managed","type":"aws_sqs_queue","name":"test_tf_sqs_2","provider_name":"registry.terraform.io/hashicorp/aws","schema_version":0,"values":{"arn":"arn:aws:sqs:us-east-1:222140259348:smoke-test-sqs-2","content_based_deduplication":false,"deduplication_scope":"","delay_seconds":0,"fifo_queue":false,"fifo_throughput_limit":"","id":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs-2","kms_data_key_reuse_period_seconds":300,"kms_master_key_id":"","max_message_size":262144,"message_retention_seconds":345600,"name":"smoke-test-sqs-2","name_prefix":"","policy":"","receive_wait_time_seconds":0,"redrive_allow_policy":"","redrive_policy":"","sqs_managed_sse_enabled":true,"tags":{},"tags_all":{},"url":"https://sqs.us-east-1.amazonaws.com/222140259348/smoke-test-sqs-2","visibility_timeout_seconds":45},"sensitive_values":{"tags":{},"tags_all":{}}}]}}},"configuration":{"provider_config":{"aws":{"name":"aws","full_name":"registry.terraform.io/hashicorp/aws","version_constraint":"~\u003e 3.0"}},"root_module":{"outputs":{"test_tf_sqs_arn":{"expression":{"references":["aws_sqs_queue.test_tf_sqs.arn","aws_sqs_queue.test_tf_sqs"]}},"test_tf_sqs_url":{"expression":{"references":["aws_sqs_queue.test_tf_sqs.url","aws_sqs_queue.test_tf_sqs"]}}},"resources":[{"address":"aws_sqs_queue.test_tf_sqs","mode":"managed","type":"aws_sqs_queue","name":"test_tf_sqs","provider_config_key":"aws","expressions":{"name":{"references":["var.queue_name"]},"visibility_timeout_seconds":{"constant_value":30}},"schema_version":0},{"address":"aws_sqs_queue.test_tf_sqs_3","mode":"managed","type":"aws_sqs_queue","name":"test_tf_sqs_3","provider_config_key":"aws","expressions":{"name":{"references":["var.queue_name"]},"visibility_timeout_seconds":{"references":["var.visibility_timeout"]}},"schema_version":0}],"variables":{"queue_name":{"description":"The name for the queue that will be created in this stack"},"visibility_timeout":{"default":30,"description":"The visibility timeout for the queue in seconds"}}}}}
`;

describe('parser', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });

  it('parseCdkDiff', () => {
    mockReadFileSync.mockReturnValueOnce(mockCdkDiff);
    mockReadFileSync.mockReturnValueOnce(mockCdkTemplate);

    const result = parseCdkDiff('mock-file');

    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(3);

    expect(result[0]).toHaveProperty('stackName', 'TestStack');
    expect(result[0]).toHaveProperty('format', IacFormat.awsCdk);
    expect(result[0]).toHaveProperty('resourceType', 'AWS::SQS::Queue');
    expect(result[0]).toHaveProperty('changeType', ChangeType.DELETE);
    expect(result[0]).toHaveProperty('resourceRecord');
    
    expect(result[1]).toHaveProperty('stackName', 'TestStack');
    expect(result[1]).toHaveProperty('format', IacFormat.awsCdk);
    expect(result[1]).toHaveProperty('resourceType', 'AWS::SQS::Queue');
    expect(result[1]).toHaveProperty('changeType', ChangeType.CREATE);
    expect(result[1]).toHaveProperty('resourceRecord');
    
    expect(result[2]).toHaveProperty('stackName', 'TestStack');
    expect(result[2]).toHaveProperty('format', IacFormat.awsCdk);
    expect(result[2]).toHaveProperty('resourceType', 'AWS::SQS::Queue');
    expect(result[2]).toHaveProperty('changeType', ChangeType.UPDATE);
    expect(result[2]).toHaveProperty('resourceRecord');
  });
  it('parseTerraformDiff', () => {
    mockReadFileSync.mockReturnValueOnce(mockTfPlan);

    const result = parseTerraformDiff('mock-file');

    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(3);
    
    expect(result[0]).toHaveProperty('format', IacFormat.tf);
    expect(result[0]).toHaveProperty('resourceType', 'aws_sqs_queue');
    expect(result[0]).toHaveProperty('changeType', ChangeType.UPDATE);
    expect(result[0]).toHaveProperty('resourceRecord');

    expect(result[1]).toHaveProperty('format', IacFormat.tf);
    expect(result[1]).toHaveProperty('resourceType', 'aws_sqs_queue');
    expect(result[1]).toHaveProperty('changeType', ChangeType.DELETE);
    expect(result[1]).toHaveProperty('resourceRecord');
    
    expect(result[2]).toHaveProperty('format', IacFormat.tf);
    expect(result[2]).toHaveProperty('resourceType', 'aws_sqs_queue');
    expect(result[2]).toHaveProperty('changeType', ChangeType.CREATE);
    expect(result[2]).toHaveProperty('resourceRecord');
  });
});