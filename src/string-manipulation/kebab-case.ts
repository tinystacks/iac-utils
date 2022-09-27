/**
 * Takes a string and converts it to kebab-case
 * @param input - string
 * @returns string
 * @defaultValue ''
 */
function kebabCase (input = '') {
  const snakeReplaced = input.replace(/_/g, '-');
  const camelReplaced = snakeReplaced.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  return camelReplaced.toLowerCase();
}

export {
  kebabCase
};