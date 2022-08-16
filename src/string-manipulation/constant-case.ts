import snakeCase from 'lodash.snakecase';

function constantCase (input = '') {
  return snakeCase(input).toUpperCase();
}

export {
  constantCase
};