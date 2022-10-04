/**
 * Takes a string and converts it to kebab-case
 * @param input - string
 * @returns string
 * @defaultValue ''
 */
function kebabCase (input = '') {
  const snakeReplaced = input.replace(/_/g, '-');
  const camelReplaced = snakeReplaced.replace(/([a-z0-9])([A-Z])/g, '$1-$2');
  const specialCharsReplaced = camelReplaced.replace(/[^a-zA-Z0-9]/g,'-');
  const characters = specialCharsReplaced.split('');
  const doubleHyphenFiltered = characters.reduce((accumultor: string, char: string, index: number) => {
    if (char === '-') {
      const previousIndex = index - 1;
      const previousChar = characters[previousIndex];
      if (previousChar && previousChar !== '-') {
        accumultor += char;
      }
    } else {
      accumultor += char;
    }
    return accumultor;
  }, '');
  return doubleHyphenFiltered.toLowerCase();
}

export {
  kebabCase
};