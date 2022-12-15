import * as logger from '../../logger';
import { exec, ExecOptions, ExecException } from 'child_process';
import { getOrdinalSuffix } from '..';
import { OsOutput } from '../../types';

function handleError (error: Error | unknown, reject: (reason?: any) => void, command: string, opts?: ExecOptions, retry?: boolean, maxRetries?: number, retryCount?: number) {
  console.error(`Failed to execute command "${command}"`, error);
  const nextRetry = retryCount + 1;
  if (retry && nextRetry <= maxRetries) {
    console.log(`Retrying command "${command}" for the ${nextRetry}${getOrdinalSuffix(nextRetry)} time.`);
    return runCommand(command, opts, retry, maxRetries, nextRetry);
  }
  return reject(error);
}

async function runCommand (command: string, opts?: ExecOptions, retry = false, maxRetries = 0, retryCount = 0): Promise<OsOutput> {
  return new Promise((resolve, reject) => {
    try {
      // we "return await" here so that errors can be handled within this function to execute retry logic
      if (opts) {
        opts.env = { ...process.env, ...(opts.env || {}) };
      }
      const standardOut: string[] = [];
      const standardError: string[] = [];
      let exitCode: number;
      
      logger.log(command);
      const childProcess = exec(command, opts, (error: ExecException, _stdout: string, _stderr: string) => {
        if (error) return handleError(error, reject, command, opts, retry, maxRetries, retryCount);
      });

      childProcess.stdout.on('data', (data) => {
        console.log(data);
        standardOut.push(data);
      });
      
      childProcess.stderr.on('data', (data) => {
        console.error(data);
        standardError.push(data);
      });

      process.stdin.pipe(childProcess.stdin);

      childProcess.on('error', (error: Error) => {
        return handleError(error, reject, command, opts, retry, maxRetries, retryCount);
      });
      
      childProcess.on('exit', (code: number, signal: string) => {
        if (signal) console.log(`Exited due to signal: ${signal}`);
        exitCode = code;
        return resolve({
          stdout: standardOut.join('\n'),
          stderr: standardError.join('\n'),
          exitCode
        });
      });
    } catch (error) {
      return handleError(error, reject, command, opts, retry, maxRetries, retryCount);
    }
  });
}

// export const createExecOptions = function (workingDirectory: string, creds?: Credentials, region?: string) {
//   const environmentVariables = {
//     AWS_ACCESS_KEY_ID: creds?.AccessKeyId,
//     AWS_SECRET_ACCESS_KEY: creds?.SecretAccessKey,
//     AWS_SESSION_TOKEN: creds?.SessionToken,
//     AWS_DEFAULT_REGION: region
//   };

//   const execOpts = {
//     cwd: workingDirectory,
//     env: environmentVariables
//   };
//   return execOpts;
// }

export {
  runCommand
};