module.exports = {
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src/ride-hailing'],
  transform: {
    '\\.tsx?$': 'ts-jest',
  },
  testRegex: '(\\.(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
