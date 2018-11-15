// @flow
import 'dotenv/config';
import './envVars/check';
import chalk from 'chalk';
import { promisify } from 'util';
import { createConnection } from 'typeorm';
import connectionOptions from './dbConfig';
import server from './server';
import { apiKey, hashFn, port, secret } from './envVars/parse';

process.on('unhandledRejection', (err: Error) => {
  throw err;
});

(async () => {
  // creates a connection to the database specified in connectionOptions
  let connection;
  try {
    connection = await createConnection(connectionOptions);
  } catch (err) {
    console.error(
      chalk.blue(
        'Unable to establish a connection to the database. Did you make sure to set the correct environment variables?'
      )
    );
    throw err;
  }

  const app = server({
    connection,
    hashFn,
    apiKey,
    secret,
  });

  // wait until the app starts
  await promisify(app.listen).bind(app)(port);
  console.log(`App started on port ${port}`);
})();
