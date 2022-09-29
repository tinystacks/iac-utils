import { NameRestriction } from './types';

const alphaNumericAndHyphen = /[^a-zA-Z0-9-]+/;
const alphaNumericAndHyphenAllowedCharacterTypes = 'alphanumeric characters and hyphens';
const alphaNumericOnly = /[^a-zA-Z0-9]+/;
const alphaNumericOnlyAllowedCharacters = 'alphanumeric characters';

const resourceNameRules: {
  [provider: string]: {
    [resourceType: string]: NameRestriction
  }
} = {
  AWS: {
    s3BucketName: {
    // source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
      characterLimit: 63,
      characterRestrictions: alphaNumericAndHyphen,
      allowedCharacterTypes: alphaNumericAndHyphenAllowedCharacterTypes
    },
    iamRoleName: {
      characterLimit: 64,
      characterRestrictions: alphaNumericAndHyphen,
      allowedCharacterTypes: alphaNumericAndHyphenAllowedCharacterTypes
    },
    lambdaFunctionName: {
      characterLimit: 64,
      characterRestrictions: alphaNumericAndHyphen,
      allowedCharacterTypes: alphaNumericAndHyphenAllowedCharacterTypes
    },
    secretName: {
      characterLimit: 512,
      characterRestrictions: alphaNumericAndHyphen,
      allowedCharacterTypes: alphaNumericAndHyphenAllowedCharacterTypes
    },
    cloudFormationLogicalId: {
      characterLimit: 255,
      characterRestrictions: alphaNumericOnly,
      allowedCharacterTypes: alphaNumericOnlyAllowedCharacters
    },
    apigName: {
      characterLimit: 255,
      characterRestrictions: alphaNumericAndHyphen,
      allowedCharacterTypes: alphaNumericAndHyphenAllowedCharacterTypes
    },
    codebuildProjectName: {
      characterLimit: 255,
      characterRestrictions: alphaNumericAndHyphen,
      allowedCharacterTypes: alphaNumericAndHyphenAllowedCharacterTypes
    },
    logGroupName: {
      characterLimit: 512,
      characterRestrictions: alphaNumericAndHyphen,
      allowedCharacterTypes: alphaNumericAndHyphenAllowedCharacterTypes
    }
  },
  TinyStacks: {
    iacStackName: {
      characterLimit: 64,
      characterRestrictions: alphaNumericAndHyphen,
      allowedCharacterTypes: alphaNumericAndHyphenAllowedCharacterTypes
    }
  }
};

export {
  alphaNumericAndHyphen,
  alphaNumericAndHyphenAllowedCharacterTypes,
  alphaNumericOnly,
  alphaNumericOnlyAllowedCharacters,
  resourceNameRules
};