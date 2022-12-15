import {
  fromNodeProviderChain,
  fromEnv
} from '@aws-sdk/credential-providers';

async function getCredentials () {
  const envCreds = await fromEnv()();
  const nodeChainCreds = await fromNodeProviderChain()();
  return envCreds || nodeChainCreds;
}

export {
  getCredentials
};