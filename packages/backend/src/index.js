// @flow
import 'dotenv/config';
import chalk from 'chalk';
import { promisify } from 'util';
import { createConnection } from 'typeorm';
import { connectionOptions } from './db_connection';
import server from './server';

process.on('unhandledRejection', err => {
  throw err;
});

const port: number = process.env.PORT || 2000;

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

  const app = server(connection);
  // wait until the app starts
  await promisify(app.listen).bind(app)(port);
  console.log(`App started on port ${port}`);
})();
