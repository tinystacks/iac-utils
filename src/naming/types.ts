// eslint-disable-next-line no-shadow
enum Casing {
  KEBAB = 'KEBAB',
  TITLE = 'TITLE',
  SNAKE = 'SNAKE',
  CAMEL = 'CAMEL',
  CONSTANT = 'CONSTANT',
}

interface NameRestriction {
  minimumLength?: number;
  characterLimit?: number;
  characterRestrictions?: RegExp;
  allowedCharacterTypes?: string;
}

export {
  Casing,
  NameRestriction
};