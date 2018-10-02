import 'pretty-error/start';
import 'dotenv/config';
import express from 'express';
import assets from 'tbd-frontend-name';
import { promisify } from 'util';
import { createConnection } from 'typeorm';
import { connectionOptions } from './db_connection';

const port = process.env.PORT || 2000;

process.on('unhandledRejection', err => {
  throw err;
});

// this is where the app lifts
(async () => {
  const app = express();

  // this sets the public directory to the frontend package's build directory
  app.use(express.static(assets));

  // creates a connection to the database specified in connectionOptions
  const connection = await createConnection(connectionOptions);

  // set API routes here

  // wait until the app starts
  await promisify(app.listen).bind(app)(port);
  console.log('app started');
})();
