 module.exports = {
  verbose: true,
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
      '\\.tsx?$': 'ts-jest',
      "^.+\\.jsx?$": "babel-jest",
  },
  testRegex: '(\\.(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
