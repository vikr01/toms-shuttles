// @flow

import 'pretty-error/start';
import './checkEnv';
import axios from 'axios';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import assets from 'tbd-frontend-name';
import chalk from 'chalk';
import path from 'path';
import HttpStatus from 'http-status-codes';
import { forEach } from 'p-iteration';
import { MoreThan } from 'typeorm';
import frontendRoutes from 'tbd-frontend-name/src/routes';
import routes from '../routes';
import { User } from './entity/User';
import { Driver } from './entity/Driver';
import { CreditCard } from './entity/CreditCard';
import { Passenger } from './entity/Passenger';
import generateSignature from './hasher';

// this is where the app lifts
export default connection => {
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
      accountType,
      creditCard: null,
      driverInfo: null,
    });

    if (accountType === 'Driver') {
      const newDriver = Object.assign(new Driver(), {
        username,
        currentLatitude: 0,
        currentLongitude: 0,
        rating: 0,
        totalReviews: 0,
        active: 0,
        passengers: null,
      });

      try {
        await connection.getRepository(Driver).save(newDriver);
      } catch (err) {
        console.log(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }

      newUser.driverInfo = newDriver;
    }

    try {
      await connection.getRepository(User).save(newUser);
    } catch (err) {
      console.log(err);
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
    req.session.regenerate(err => {});
    req.session.username = user.username;
    req.session.save(err => {
      console.log('saved session');
    });

    console.log(`Welcome back, ${user.firstName}`);
    return res.status(HttpStatus.OK).send('Successfully logged in');
  });

  /**
   * Check if user is logged in
   */
  app.get(routes.LOGGED_IN, async (req, res, next) => {
    const user = await connection
      .getRepository(User)
      .findOne({ username: req.session.username });
    if (user) {
      return res.status(HttpStatus.OK).send(user.accountType);
    }
    return res.status(HttpStatus.NOT_FOUND).send('User is not logged in');
  });

  /**
   * This route handles displaying all user info
   */
  app.get(routes.USER, async (req, res, next) => {
    const name = req.session.username;

    let user;
    try {
      user = await connection.getRepository(User).findOne({
        select: [
          'firstName',
          'lastName',
          'username',
          'accountType',
          'creditCard',
          'driverInfo',
        ],
        relations: ['creditCard', 'driverInfo'],
        where: {
          username: name,
        },
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

    if (user) {
      const {
        username,
        firstName,
        lastName,
        accountType,
        creditCard,
        driverInfo,
      } = user;
      const cardNum = creditCard ? creditCard.cardNum : '';
      return res.status(HttpStatus.OK).json({
        username,
        firstName,
        lastName,
        accountType,
        creditCard: cardNum,
        driverInfo,
      });
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

  app.put(routes.DRIVERS, async (req, res, next) => {
    const { username } = req.session;
    let repo;
    let driver;

    try {
      repo = await connection.getRepository(Driver);
      driver = await repo.findOne({ username });
    } catch (error) {
      res.status(HttpStatus.IM_A_TEAPOT).send('Error accessing database');
    }

    if (!driver) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Invalid username:${username}`);
    }

    Object.entries(req.body).forEach(([key, value]) => {
      if (driver.hasOwnProperty(key)) {
        driver[key] = value;
      } else {
        console.warn(
          chalk.blue(
            `Discarding non-existent key, ${key}, for username: ${username}`
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
    try {
      const userInfo = await connection.getRepository(User).findOne({
        select: ['username', 'creditCard'],
        relations: ['creditCard'],
        where: {
          username: req.session.username,
        },
      });
      console.log(userInfo);
      if (!userInfo.creditCard) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: 'No credit card on file' });
      }
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
    const { lat, lng, destination, groupSize } = req.query;

    if (
      !correctLat(parseFloat(lat)) ||
      !correctLong(parseFloat(lng)) ||
      !groupSize
    ) {
      return res.status(HttpStatus.BAD_REQUEST).send('Invalid arguments');
    }

    // query only active drivers
    const drivers = await connection.getRepository(Driver).find({
      active: 1,
      numOfSeats: MoreThan(Number(groupSize) - 1),
    });
    let closestDriver = {};
    let leastTime = Number.POSITIVE_INFINITY;
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

    const newPassenger = Object.assign(new Passenger(), {
      username: req.session.username,
      groupSize,
    });

    // try {
    //   await connection.getRepository(Passenger).save(newPassenger);
    // } catch (err) {
    //   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    // }

    // if (closestDriver.passengers) closestDriver.passengers.push(newPassenger);
    // else closestDriver.passengers = [newPassenger];

    // // update driver's available seats
    // closestDriver.numOfSeats -= groupSize;

    // try {
    //   await connection.getRepository(Driver).save(closestDriver);
    // } catch (err) {
    //   return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    // }

    // // add user's driver to their session
    // req.session.driver = closestDriver;

    return res.status(HttpStatus.OK).json(closestDriver);
  });

  app.post(routes.ADDCREDITCARD, async (req, res, next) => {
    const { card } = req.body;
    const { username } = req.session;

    if (!card) {
      return res
        .statusCode(HttpStatus.BAD_REQUEST)
        .send('Expected creditCard param');
    }

    let user;
    try {
      user = await connection.getRepository(User).findOne({ username });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

    if (!user) {
      res.statusCode(HttpStatus.NOT_FOUND).send('Could not find user');
    }

    const newCard = Object.assign(new CreditCard(), {
      cardNum: card,
    });

    try {
      await connection.getRepository(CreditCard).save(newCard);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

    user.creditCard = newCard;

    try {
      await connection.getRepository(User).save(user);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

    return res.status(HttpStatus.OK).send();
  });

  // this sets the public directory to the frontend package's build directory
  app.use(express.static(assets));

  return app;
};
