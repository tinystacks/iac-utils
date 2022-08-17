import { generateName } from './generate-name';
import { Casing } from './types';

/**
 * Takes 1 or more string identifiers and returns a string in our standard construct id format.
 * @param identifiers - ...string
 * @returns constructId - string
 */
function constructId (...identifiers: string[]): string {
  return generateName({
    identifiers,
    casing: Casing.TITLE
  });
}

export {
  constructId
};