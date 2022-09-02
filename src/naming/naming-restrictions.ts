import { NameRestriction } from './types';

const alphaNumericAndHyphen = new RegExp(/[^a-zA-Z0-9-]+/, 'g');
const alphaNumericOnly = new RegExp(/[^a-zA-Z0-9]+/, 'g');

const resourceNameRules: {
  [provider: string]: {
    [resourceType: string]: NameRestriction
  }
} = {
  AWS: {
    s3BucketName: {
    // source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
      characterLimit: 63,
      characterRestrictions: alphaNumericAndHyphen
    },
    iamRoleName: {
      characterLimit: 64,
      characterRestrictions: alphaNumericAndHyphen
    },
    lambdaFunctionName: {
      characterLimit: 64,
      characterRestrictions: alphaNumericAndHyphen
    },
    secretName: {
      characterLimit: 512,
      characterRestrictions: alphaNumericAndHyphen
    },
    cloudFormationLogicalId: {
      characterLimit: 255,
      characterRestrictions: alphaNumericOnly
    },
    apigName: {
      characterLimit: 255,
      characterRestrictions: alphaNumericAndHyphen
    },
    codebuildProjectName: {
      characterLimit: 255,
      characterRestrictions: alphaNumericAndHyphen
    },
    logGroupName: {
      characterLimit: 512,
      characterRestrictions: alphaNumericAndHyphen
    }
  }
};

export {
  alphaNumericAndHyphen,
  alphaNumericOnly,
  resourceNameRules
};