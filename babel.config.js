/* eslint
  strict: 0, 
  import/no-commonjs: 0, 
  global-require: 0, 
  import/no-extraneous-dependencies: 0 
*/

'use strict';

// {
//   "presets": ["@babel/preset-env", "@babel/preset-flow", "@babel/preset-react"]
//   // "plugins": [
//   //   "dynamic-import-node"
//   // ]
// }

module.exports = api => {
  if (!api.env('test')) {
    return {};
  }

  return {
    presets: [
      [
        require('@babel/preset-env'),
        { targets: { node: 10 }, useBuiltIns: 'usage' },
      ],
      require('@babel/preset-flow'),
      [require('@babel/preset-react'), { development: true }],
    ],

    plugins: [require('babel-plugin-dynamic-import-node')],
  };
};
