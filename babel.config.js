/* eslint
  strict: 0, 
  import/no-commonjs: 0, 
  global-require: 0, 
  import/no-extraneous-dependencies: 0 
*/

const { workspaces = [] } = require('./package.json');

module.exports = {
  babelrcRoots: workspaces.packages || workspaces,
};
