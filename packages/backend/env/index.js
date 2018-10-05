const path = require('path');
const { existsSync, readFileSync } = require('fs');
const dotenv = require('dotenv');

const pathToDotEnv = path.join(__dirname, '../.env');

let port;

if (existsSync(pathToDotEnv)) {
  const dotEnvContents = readFileSync(pathToDotEnv);
  const config = dotenv.parse(dotEnvContents);
  port = config.PORT;
}

module.exports = {
  port,
};
