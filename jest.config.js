/* eslint
  strict: 0, 
  import/no-commonjs: 0, 
  global-require: 0, 
  import/no-extraneous-dependencies: 0 
*/

module.exports = {
  rootDir: __dirname,
  moduleFileExtensions: ['js', 'jsx', 'json'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
};
