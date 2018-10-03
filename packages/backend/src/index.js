// @flow
import 'pretty-error/start';
import 'dotenv/config';
import express from 'express';
import assets from 'tbd-frontend-name';
import chalk from 'chalk';
import crypto from 'crypto';
import path from 'path';
import HttpStatus from 'http-status-codes';
import { promisify } from 'util';
import { createConnection } from 'typeorm';
import frontendRoutes from 'tbd-frontend-name/src/routes';
import { connectionOptions } from './db_connection';
import routes from '../routes';

const port: number = process.env.PORT || 2000;

const generateSignature: Function = value =>
  crypto
    .createHash(process.env.HASH_ALGO, process.env.HASH_KEY)
    .update(value)
    .digest(process.env.DIGESTION_TYPE);

process.on('unhandledRejection', err => {
  throw err;
});

// this is where the app lifts
(async () => {
  const app = express();

  // this sets the public directory to the frontend package's build directory
  app.use(express.static(assets));

  app.get(routes.LOGIN, (req, res) => {
    res.redirect(path.join('/#/', frontendRoutes.LOGIN));
  });

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

  app.post(routes.SIGNUP, (req, res) => {
    const { username, firstName, lastName, password, accountType } = req.body;

    const signature = generateSignature(password);

    // if(/* check if user already exists */) {
    //   return res.status(HttpStatus.NOT_FOUND).send('Not found');
    // }

    // return res.json(
    //   /* send some kind of json result */
    // );
  });

  app.post(routes.AUTH, (req, res) => {
    const { username, password } = req.body;

    const signature = generateSignature(password);

    // if(/* check if user exists and credentials are correct */) {
    //   return res.status(HttpStatus.NOT_FOUND).send('Not found');
    // }

    // return res.json(
    //   /* send some kind of json result */
    // );
  });

  // set API routes here

  // wait until the app starts
  await promisify(app.listen).bind(app)(port);
  console.log('app started');
})();
