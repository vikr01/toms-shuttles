import chalk from 'chalk';
import { existsSync } from 'fs';
import isHeroku from 'is-heroku';
import path from 'path';
import { required as requiredEnvVars } from './list';

const pathToEnvFile = path.join(__dirname, '../.env');

if (isHeroku) {
  console.log('This is a heroku environment');
}

if (isHeroku && existsSync(pathToEnvFile)) {
  console.warn(
    chalk.yellow(
      "You're using dotenv in a deployed environment, this could cause unexpected behavior."
    )
  );
}

const unsetEnvVars = requiredEnvVars.filter(
  envVar => process.env[envVar] === undefined
);

if (unsetEnvVars.length > 0) {
  throw new Error(
    `You're missing some required environment variables: ${unsetEnvVars.join(
      ', '
    )}`
  );
}
