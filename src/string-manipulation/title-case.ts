import upperFirst from 'lodash.upperfirst';
import camelCase from 'lodash.camelcase';

function titleCase (input = '') {
  return upperFirst(camelCase(input));
}

export {
  titleCase
};