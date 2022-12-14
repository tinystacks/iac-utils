import { exec, ExecOptions, ExecException } from 'child_process';
import { getOrdinalSuffix } from '..';
import { OsOutput } from '../../types';


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
      
      const childProcess = exec(command, opts, (error: ExecException, stdout: string, stderr: string) => {
        if (error) throw error;
        if (stdout) {
          console.log(stdout);
          standardOut.push(stdout);
        }
        if (stderr) {
          console.error(stderr);
          standardError.push(stderr);
        }
      });

      childProcess.stdout.on('data', (data) => {
        console.log(data);
        standardOut.push(data);
      });
      
      childProcess.stderr.on('data', (data) => {
        console.log(data);
        standardError.push(data);
      });

      childProcess.on('error', (error: Error) => {
        throw error;
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
      console.error(`Failed to execute command "${command}"`, error);
      const nextRetry = retryCount + 1;
      if (retry && nextRetry <= maxRetries) {
        console.log(`Retrying command "${command}" for the ${nextRetry}${getOrdinalSuffix(nextRetry)} time.`);
        return runCommand(command, opts, retry, maxRetries, nextRetry);
      }
      return reject(error);
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