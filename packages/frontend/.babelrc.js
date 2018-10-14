const devEnvs = ['development', 'test'];

const devPlugins = [];

const prodPlugins = [
  [
    require('babel-plugin-transform-react-remove-prop-types'),
    { removeImport: true },
  ],
  require('@babel/plugin-transform-react-constant-elements'),
  require('@babel/plugin-transform-react-inline-elements'),
];

module.exports = api => {
  const isDevEnv = api.env(devEnvs);
  const isTestEnv = api.env('test');

  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          useBuiltIns: 'usage',
          ...(isTestEnv ? { targets: { node: 10 } } : {}),
          debug: api.cache.using(() => process.env.DEBUG === 'true'),
        },
      ],
      require('@babel/preset-flow'),
      [require('@babel/preset-react'), { development: isDevEnv }],
    ],

    plugins: [
      ...(isDevEnv ? devPlugins : prodPlugins),
      isTestEnv
        ? require('babel-plugin-dynamic-import-node')
        : require('@babel/plugin-syntax-dynamic-import'),
      [require('@babel/plugin-proposal-class-properties'), { loose: true }],
      [
        require('@babel/plugin-transform-runtime'),
        { helpers: false, regenerator: true },
      ],
    ],
  };
};
