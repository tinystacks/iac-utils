enum Casing {
  KEBAB = 'KEBAB',
  TITLE = 'TITLE',
  SNAKE = 'SNAKE',
  CAMEL = 'CAMEL',
  CONSTANT = 'CONSTANT',
}

interface NameRestriction {
  characterLimit?: number;
  characterRestrictions?: RegExp;
}

export {
  Casing,
  NameRestriction
};