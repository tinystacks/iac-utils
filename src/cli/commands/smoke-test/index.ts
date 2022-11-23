import { Options } from '../../types';

async function smokeTest (options: Options) {
  console.info('Hello world! smoke-test command called with options: ', JSON.stringify(options));
}

export {
  smokeTest
};