import chalk from 'chalk';
import { existsSync } from 'fs';
import isHeroku from 'is-heroku';
import path from 'path';

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

const NON_SQLITE_VARS = ['DB_HOST', 'DB_PASSWORD', 'DB_DATABASE'];

const requiredEnvVars = [
  'NODE_ENV',
  'DB_TYPE',
  ...(process.env.DB_TYPE !== 'sqlite' ? NON_SQLITE_VARS : []),
  'HASH_ALGO',
  'HASH_KEY',
  'DIGESTION_TYPE',
  'SESSION_SECRET',
  'API_KEY',
];

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
