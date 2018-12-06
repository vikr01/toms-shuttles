// @flow
import 'dotenv/config';
import './envVars/check';
import chalk from 'chalk';
import { createServer } from 'http';
import { promisify } from 'util';
import { createConnection } from 'typeorm';
import socketio from 'socket.io';
import connectionOptions from './dbConfig';
import createApp from './server';
import { apiKey, hashFn, port, secret } from './envVars/parse';

process.on('unhandledRejection', err => {
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

  const io = socketio();

  const app = createApp({
    connection,
    hashFn,
    apiKey,
    secret,
    io,
  });

  // wait until the app starts
  const server = createServer(app);
  io.attach(server);

  await promisify(server.listen).bind(server)(port);
  console.log(`App started on port ${port}`);
})();
