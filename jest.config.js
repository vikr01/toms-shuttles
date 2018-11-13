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
};
