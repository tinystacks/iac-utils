enum IacFormat {
  tf = 'tf',
  awsCdk = 'aws-cdk'
}

enum ChangeType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  NO_CHANGES = 'NO_CHANGES',
  UNKNOWN = 'UNKNOWN'
}

interface OsOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
}

interface SmokeTestOptions {
  format?: IacFormat
}

interface Json {
  [key: string]: any
}

interface ResourceRecord {
  address: string;
  type: string;
  tfProviderName?: string;
  properties: Json;
}

interface ResourceDiffRecord {
  stackName?: string;
  format: IacFormat;
  resourceType: string;
  changeType: ChangeType;
  resourceRecord: ResourceRecord;
}

interface CdkDiff {
  changeTypeSymbol?: string;
  resourceType?: string;
  cdkPath: string;
  logicalId: string;
}

interface DiffSection {
  sectionName: string,
  diffLines: string[]
}

export {
  IacFormat,
  OsOutput,
  SmokeTestOptions,
  ChangeType,
  Json,
  ResourceRecord,
  ResourceDiffRecord,
  CdkDiff,
  DiffSection
};