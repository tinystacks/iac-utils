import snakeCase from 'lodash.snakecase';

/**
 * Takes a string and converts it to CONSTANT_CASE
 * @param input - string
 * @returns string
 * @defaultValue ''
 */
function constantCase (input = '') {
  return snakeCase(input).toUpperCase();
}

export {
  constantCase
};