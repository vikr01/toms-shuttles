// @flow
import 'pretty-error/start';
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
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
import { User } from './entity/User';

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
  app.use(bodyParser.json({ type: 'application/json' }));
  // app.use(app.router);

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

  /** This route will handle a signup request.
   * @returns an object with a HttpStatus code describing the outcome of the request.
   *          - BAD_REQUEST if username or password is not specified.
   *          - NOT_ACCEPTABLE if the username already exists in the database.
   *          - INTERNAL_SERVER_ERROR if unable to save user to database.
   *          - OK if all goes well and user is added to databse.
   * */
  app.post(routes.SIGNUP, async (req, res, next) => {
    const { username, firstName, lastName, password, accountType } = req.body;

    if (!password || !username) {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }

    if (await connection.getRepository(User).findOne({ username })) {
      // User already exists
      return res.status(HttpStatus.NOT_ACCEPTABLE).send();
    }

    const signature = generateSignature(password);

    const newUser = Object.assign(new User(), {
      password: signature,
      username,
      firstName,
      lastName,
      // accountType
    });

    try {
      await connection.getRepository(User).save(newUser);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

    console.log(`Welcome, ${firstName}`);

    return res.status(HttpStatus.OK).send();
  });

  app.post(routes.AUTH, (req, res, next) => {
    // console.log(req.body);
    const { username, password } = req.body;

    if (!password || !username) {
      return res.status(HttpStatus.NOT_FOUND).send('Not found');
    }

    const signature = generateSignature(password);

    if (
      connection.getRepository(User).findOne({ username, password: signature })
    ) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send('Invalid username and/or password provided.');
    }
    console.log(`Welcome back, ${username}`);
    return res.status(HttpStatus.OK).send('Successfully logged in');

    // if(/* check if user exists and credentials are correct */) {
    //   return res.status(HttpStatus.NOT_FOUND).send('Not found');
    // }

    // return res.json(
    //   /* send some kind of json result */
    // );
    // return next(); // remove this once you've set the res.json
  });

  // set API routes here

  // wait until the app starts
  await promisify(app.listen).bind(app)(port);
  console.log('app started');
})();
