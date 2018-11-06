const JsonStripComments = require('strip-json-comments');
const { readFileSync } = require('fs');
const path = require('path');

const pathToPathsJson = path.join(__dirname, './paths.json');

module.exports = JSON.parse(
  JsonStripComments(String(readFileSync(pathToPathsJson)))
);
