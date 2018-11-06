// @flow

import 'pretty-error/start';
import 'dotenv/config';
import './checkEnv';
import axios from 'axios';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import assets from 'tbd-frontend-name';
import chalk from 'chalk';
import crypto from 'crypto';
import path from 'path';
import HttpStatus from 'http-status-codes';
import { promisify } from 'util';
import { forEach } from 'p-iteration';
import { createConnection } from 'typeorm';
import frontendRoutes from 'tbd-frontend-name/src/routes';
import { connectionOptions } from './db_connection';
import routes from '../routes';
import { User } from './entity/User';
import { Driver } from './entity/Driver';

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

  /**
   * This route handles displaying all user info
   */
  app.get(routes.USER, async (req, res, next) => {
    const response = await connection.getRepository(User).find({});
    response.forEach(user => {
      delete user.password;
    });
    res.status(HttpStatus.OK).json(response);
  });

  /**
   * This route handles finding user information
   * - NOT_FOUND if username not found in database.
   * - OK if user is found in the database.
   */
  app.get(routes.SINGLE_USER, async (req, res, next) => {
    const { username: name } = req.params;

    const user = await connection
      .getRepository(User)
      .findOne({ username: name });

    if (user) {
      const { username, firstName, lastName } = user;
      return res.status(HttpStatus.OK).json({ username, firstName, lastName });
    }

    return res.status(HttpStatus.NOT_FOUND).send('Invalid username');
  });

  app.post(routes.DRIVERS, async (req, res, next) => {
    const driverBody = req.body;

    const newDriver = Object.assign(new User(), driverBody);

    await connection.getRepository(Driver).save(newDriver);

    res.status(HttpStatus.OK).send('Done');
  });

  app.get(routes.DRIVER, async (req, res, next) => {
    const { username: name } = req.params;

    let driver;
    try {
      driver = await connection
        .getRepository(Driver)
        .findOne({ username: name });
    } catch (error) {
      return res
        .status(HttpStatus.IM_A_TEAPOT)
        .send('Error accessing database');
    }

    if (driver) {
      return res.status(HttpStatus.OK).json(driver);
    }

    return res.status(HttpStatus.NOT_FOUND).send('Invalid username');
  });

  app.put(routes.DRIVER, async (req, res, next) => {
    const { username: name } = req.params;
    let repo;
    let driver;

    try {
      repo = await connection.getRepository(Driver);
      driver = await repo.findOne({ username: name });
    } catch (error) {
      res.status(HttpStatus.IM_A_TEAPOT).send('Error accessing database');
    }

    if (!driver) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Invalid username:${name}`);
    }

    Object.entries(req.body).forEach(([key, value]) => {
      if (driver.hasOwnProperty(key)) {
        driver[key] = value;
      } else {
        console.warn(
          chalk.blue(
            `Discarding non-existent key, ${key}, for username: ${name}`
          )
        );
      }
    });

    try {
      await repo.save(driver);
    } catch (error) {
      res.status(HttpStatus.IM_A_TEAPOT).send('Error updating database');
    }

    return res.status(HttpStatus.OK).json(driver);
  });

  function correctLat(latitude) {
    return latitude <= 90 && latitude >= -90;
  }

  function correctLong(longitude) {
    return longitude <= 180 && longitude >= -180;
  }

  app.get(routes.CLOSEST_DRIVER, async (req, res, next) => {
    const { lat, lng, destination } = req.query;

    if (!correctLat(parseFloat(lat)) || !correctLong(parseFloat(lng))) {
      return res.status(HttpStatus.BAD_REQUEST).send('Invalid arguments');
    }

    // query only active drivers
    const drivers = await connection.getRepository(Driver).find({ active: 1 });
    let closestDriver = {};
    let leastTime = 10000000;
    await forEach(drivers, async driver => {
      const result = await axios.get(
        'https://maps.googleapis.com/maps/api/distancematrix/json',
        {
          params: {
            units: 'imperial',
            origins: `${driver.currentLatitude},${driver.currentLongitude}`,
            destinations: `${lat},${lng}`,
            key: process.env.API_KEY,
          },
        }
      );
      const duration = result.data.rows[0].elements[0].duration.value;
      if (duration < leastTime) {
        leastTime = duration;
        closestDriver = driver;
      }
    });

    if (Object.keys(closestDriver).length === 0) {
      return res.status(HttpStatus.NOT_FOUND).send('Could not find a driver');
    }

    // add name of driver in response only if already authenticated
    closestDriver.name = req.session.user;

    return res.status(HttpStatus.OK).json(closestDriver);
  });

  // this sets the public directory to the frontend package's build directory
  app.use(express.static(assets));

  // wait until the app starts
  await promisify(app.listen).bind(app)(port);
  console.log(`App started on port ${port}`);
})();
