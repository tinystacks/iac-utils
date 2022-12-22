// eslint-disable-next-line no-shadow
enum IacFormat {
  tf = 'tf',
  awsCdk = 'aws-cdk'
}

// eslint-disable-next-line no-shadow
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
  format?: IacFormat;
  requirePrivateSubnet?: boolean;
  configFile?: string;
}

interface Json {
  [key: string]: any
}

interface TfReference {
  property: string;
  reference: string;
}

interface ResourceRecord {
  address: string;
  index?: string;
  type: string;
  logicalId: string;
  tfProviderName?: string;
  tfReferences?: TfReference[]
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
  TfReference,
  ResourceRecord,
  ResourceDiffRecord,
  CdkDiff,
  DiffSection
};