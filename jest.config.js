module.exports = {
  rootDir: __dirname,

  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/.*',
    '!**/.*/**',
    '!*.config.js',
    '!packages/*/*.config.js',
    '!**/webpack.config.*',
    '!packages/*/dist/**',
    '!packages/*/scripts/**',
    '!coverage/**',
  ],

  coverageDirectory: './coverage/',

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': require.resolve(
      './testing/mocks/fileMock'
    ),
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },

  moduleFileExtensions: ['js', 'jsx', 'json'],
};
