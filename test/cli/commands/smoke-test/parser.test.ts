const mockResolve = jest.fn();
const mockReadFileSync = jest.fn();

jest.mock('path', () => {
  const original = jest.requireActual('path');
  return {
    resolve: mockResolve,
    realResolve: original.resolve
  };
});


jest.mock('fs', () => {
  const original = jest.requireActual('fs');
  return {
    readFileSync: mockReadFileSync,
    realRFS: original.readFileSync
  }
});

import {
  parseCdkDiff,
  parseTerraformDiff
} from '../../../../src/cli/commands/smoke-test/parser';
import { ChangeType, IacFormat } from '../../../../src/cli/types';

const fs = require('fs');
const path = require('path');
const mockCdkDiff = fs.realRFS(path.realResolve(__dirname, './test-data/simple-sqs-stack/MockCdkDiff.txt'));

const mockCdkTemplate = fs.realRFS(path.realResolve(__dirname, './test-data/simple-sqs-stack/MockCdkTemplate.json'));

 // TODO: update test data with a tf plan that performs a replacement to test "afterAction" branch
 const mockTfPlan = fs.realRFS(path.realResolve(__dirname, './test-data/simple-sqs-stack/MockTfPlan.json'));

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