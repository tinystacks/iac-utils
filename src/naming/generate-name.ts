import camelCase from 'lodash.camelcase';
import snakeCase from 'lodash.snakecase';
import isEmpty = require('lodash.isempty');
import uniq = require('lodash.uniq');
import { Casing, NameRestriction } from './types';
import { truncateWithSemiHash } from './truncate-w-hash';
import { titleCase, constantCase, kebabCase } from '../string-manipulation';

function doNothing (input: any) {
  return input;
}

const casingFunctions = {
  [Casing.KEBAB]: kebabCase,
  [Casing.TITLE]: titleCase,
  [Casing.SNAKE]: snakeCase,
  [Casing.CAMEL]: camelCase,
  [Casing.CONSTANT]: constantCase
};

function generateName (args: {
  identifiers: string[];
  separator?: string;
  nameRestriction?: NameRestriction;
  // eslint-disable-next-line @typescript-eslint/ban-types
  casing?: Casing
}): string {
  const {
    identifiers,
    separator = '-',
    nameRestriction,
    casing
  } = args;
  const casingFunction = casingFunctions[casing] || doNothing;
  const name = casingFunction(uniq(identifiers).filter(id => !isEmpty(id)).join(separator));

  if (nameRestriction) {
    const {
      characterRestrictions,
      characterLimit
    } = nameRestriction;
    return truncateWithSemiHash(name.replace(characterRestrictions, ''), characterLimit);
  }
  return name;
}

export {
  generateName
};