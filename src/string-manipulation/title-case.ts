import upperFirst from 'lodash.upperfirst';
import camelCase from 'lodash.camelcase';

/**
 * Takes a string and converts it to TitleCase
 * @param input - string
 * @returns string
 * @defaultValue ''
 */
function titleCase (input = '') {
  return upperFirst(camelCase(input));
}

export {
  titleCase
};