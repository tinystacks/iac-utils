import {
  red,
  magenta,
  yellow,
  blue,
  gray
} from 'colors';

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

export {
  error,
  debug,
  warn,
  info,
  log,
  hint
};