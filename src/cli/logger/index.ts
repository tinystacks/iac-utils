import {
  red,
  magenta,
  yellow,
  blue,
  gray,
  green
} from 'colors';
import { CliError } from '../errors';

function error (message: string) {
  console.error(red(`Error: ${message}`));
}

function debug (message: string) {
  console.debug(yellow(`Debug: ${message}`));
}

function warn (message: string) {
  console.warn(yellow(`Warning: ${message}`));
}

function info (message: string) {
  console.info(blue(`Info: ${message}`));
}

function log (message: string) {
  console.log(gray(message));
}

function hint (message: string) {
  console.log(magenta(`Hint: ${message}`));
}

function success (message: string) {
  console.log(green(`Success: ${message}`));
}

function verbose (message: string | Error | any) {
  if (process.env.VERBOSE === 'true') {
    console.log(gray(message));
  }
}

function cliError (err: Error | unknown) {
  const e = err as Error;
  if (e.name === CliError.name) {
    const customError = e as CliError;
    error(`${customError.message}${customError.reason ? `\n\t${customError.reason}` : ''}`);
    if (customError.hints) {
      customError.hints.forEach(hintString => hint(hintString));
    }
  } else {
    error('An unexpected error occurred!');
    console.error(error);
  }
}

export {
  error,
  debug,
  warn,
  info,
  log,
  hint,
  success,
  verbose,
  cliError
};