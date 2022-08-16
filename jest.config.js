// eslint-disable-next-line
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['.d.ts', '.js'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 95,
      lines: 95,
      statements: 95 
    }
  }
};