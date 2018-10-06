// @flow
import 'pretty-error/start';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
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

  // session initialization
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
    })
  );

  // middleware for session messages
  app.use((req, res, next) => {
    const { error: err, success: msg } = req.session;
    if (err) {
      res.locals.message = err;
      req.session.error = null;
    } else if (msg) {
      res.locals.message = msg;
      req.session.success = null;
    } else res.locals.message = '';
    next();
  });

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

  // on urls that need authentication, pass in this function i.e app.get('/', checkAuth, (req,res,next).....)
  function checkAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.session.error = 'Denied access';
      res.redirect(routes.LOGIN);
    }
  }

  /** This route will handle a signup request.
   * @returns an object with a HttpStatus code describing the outcome of the request.
   *          - BAD_REQUEST if username or password is not specified.
   *          - NOT_ACCEPTABLE if the username already exists in the database.
   *          - INTERNAL_SERVER_ERROR if unable to save user to database.
   *          - OK if all goes well and user is added to database.
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

  /**
   * This route handles authenticating a user
   * @returns an object with a HttpStatus code describing the outcome of the request.
   *          - BAD_REQUEST if username or password is not specified.
   *          - NOT_FOUND if username and password not found in database.
   *          - OK if user is authenticated.
   */
  app.post(routes.AUTH, async (req, res, next) => {
    const { username, password } = req.body;

    if (!password || !username) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Username and/or password not specified');
    }

    const signature = generateSignature(password);

    const user = await connection
      .getRepository(User)
      .findOne({ username, password: signature });
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send('Invalid username and/or password provided.');
    }

    // create a session for user on auth
    req.session.regenerate(() => {
      req.session.user = `${user.firstName} ${user.lastName}`;
    });

    console.log(`Welcome back, ${user.firstName}`);
    return res.status(HttpStatus.OK).send('Successfully logged in');
  });

  // wait until the app starts
  await promisify(app.listen).bind(app)(port);
  console.log('app started');
})();
