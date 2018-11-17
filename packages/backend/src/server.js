// @flow

import 'pretty-error/start';
import axios from 'axios';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import assets from 'tbd-frontend-name';
import chalk from 'chalk';
import path from 'path';
import HttpStatus from 'http-status-codes';
import frontendRoutes from 'tbd-frontend-name/src/routes';
import routes from '../routes';
import { User } from './entity/User';
import { Driver } from './entity/Driver';
import { CreditCard } from './entity/CreditCard';
import { Passenger } from './entity/Passenger';
import type { HashFn } from './createHashFn';

type params = {
  connection: {
    getRepository: Function,
  },
  secret: string,
  apiKey: string,
  hashFn: HashFn,
};

type SessionType = {
  resave: boolean,
  saveUninitialized: boolean,
  secret: string,
  cookie: {
    maxAge: number,
    secure?: boolean,
  },
};

// this is where the app lifts
export default ({ connection, secret, apiKey, hashFn }: params) => {
  const app = express();

  app.use(bodyParser.json({ type: 'application/json' }));
  // app.use(app.router);

  // session initialization
  const sess: SessionType = {
    resave: false,
    saveUninitialized: false,
    secret,
    cookie: {
      maxAge: 600,
    },
  };

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
  }
  app.use(session(sess));

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

  app.get(routes.LOGOUT, (req, res) => {
    try {
      req.session.destroy(error => {
        if (error) {
          console.log(chalk.red('Problem doing logout'));
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
        }
        res.status(HttpStatus.OK).send();
      });
    } catch (err) {
      console.log(err);
      res.status(HttpStatus.IM_A_TEAPOT).send(err);
    }
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

    console.log('username is ', username);

    if (!password || !username) {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }

    if (await connection.getRepository(User).findOne({ username })) {
      // User already exists
      return res.status(HttpStatus.NOT_ACCEPTABLE).send();
    }

    const signature = hashFn(password);

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
        destLat1: 0,
        destLng1: 0,
        destLat2: 0,
        destLng2: 0,
        destLat3: 0,
        destLng3: 0,
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

    const signature = hashFn(password);

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

    return res.status(HttpStatus.OK).send('Done');
  });

  app.get(routes.ALL_ACTIVE_DRIVERS, async (req, res, next) => {
    let drivers = {};
    try {
      drivers = await connection.getRepository(Driver).find({ active: 1 });
    } catch (error) {
      return res
        .status(HttpStatus.IM_A_TEAPOT)
        .send('Error accessing database');
    }

    if (drivers) {
      return res.status(HttpStatus.OK).json(drivers);
    }

    return res.status(HttpStatus.NOT_FOUND).send('No active drivers found');
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
    const { username } = req.body.username ? req.body : req.session;
    let repo;
    let driver;

    console.log('DRIVERS put username: ', username);

    try {
      repo = await connection.getRepository(Driver);
      driver = await repo.findOne({ username });
    } catch (error) {
      console.log(error);
      return res
        .status(HttpStatus.IM_A_TEAPOT)
        .send('Error accessing database');
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
      return res.status(HttpStatus.IM_A_TEAPOT).send('Error updating database');
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
        return res.status(HttpStatus.NOT_FOUND).send('No credit card on file');
      }
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }
    const { lat, lng, destLat, destLng, groupSize } = req.query;

    if (
      !correctLat(parseFloat(lat)) ||
      !correctLong(parseFloat(lng)) ||
      !correctLat(parseFloat(destLat)) ||
      !correctLong(parseFloat(destLng)) ||
      !groupSize
    ) {
      return res.status(HttpStatus.BAD_REQUEST).send('Invalid arguments');
    }

    const DELTA = 0.005;
    console.log('check if dest matches ', destLat, ' ', Number(destLat));
    // query only active drivers with seats and an open destination
    const drivers = await connection
      .getRepository(Driver)
      .query(
        `select * from driver where destLat1 Between ${parseFloat(destLat) -
          DELTA} and  ${parseFloat(destLat) +
          DELTA} or destLat1 = 0 and destLng1 Between ${parseFloat(destLng) -
          DELTA} and  ${parseFloat(destLng) +
          DELTA} or destLng1 = 0 and active = 1 and numOfSeats >= ${groupSize} and destLat3 = 0 and destLng3 = 0;`
      );
    let closestDriver = {};
    let leastTime = Number.POSITIVE_INFINITY;
    let existingDriver = false;
    console.log('list of potential drivers:');
    await Promise.all(
      drivers.map(async driver => {
        console.log(driver);
        const result = await axios.get(
          'https://maps.googleapis.com/maps/api/distancematrix/json',
          {
            params: {
              units: 'imperial',
              origins: `${driver.currentLatitude},${driver.currentLongitude}`,
              destinations: `${lat},${lng}`,
              key: apiKey,
            },
          }
        );
        try {
          const METERSINMILE = 1610;
          const SECSIN30MIN = 60 * 30;
          const time = result.data.rows[0].elements[0].duration.value;
          const distance = result.data.rows[0].elements[0].distance.value;
          existingDriver = true;
          console.log(
            `distance to ${
              driver.username
            } is ${distance} meters and time is ${time} seconds`
          );
          if (
            (time < leastTime && distance <= METERSINMILE * 3) ||
            (time <= leastTime &&
              time <= SECSIN30MIN &&
              driver.destLat1 === 0 &&
              driver.destLng1 === 0)
          ) {
            console.log(`Closest driver is now ${driver.username}`);
            leastTime = time;
            closestDriver = driver;
          }
        } catch (err) {
          console.log(chalk.red(`Discarding bad driver with error:${err}`));
        }
      })
    );

    if (Object.keys(closestDriver).length === 0) {
      if (existingDriver === true)
        return res.status(HttpStatus.NOT_FOUND).send('No closeby driver');
      return res.status(HttpStatus.NOT_FOUND).send('Could not find a driver');
    }

    const newPassenger = Object.assign(new Passenger(), {
      username: req.session.username,
      groupSize,
      driver: null,
    });

    try {
      await connection.getRepository(Passenger).save(newPassenger);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

    if (closestDriver.passengers) closestDriver.passengers.push(newPassenger);
    else closestDriver.passengers = [newPassenger];

    // update driver's available seats
    closestDriver.numOfSeats -= groupSize;

    // set their destination
    closestDriver.destLat1 = destLat;
    closestDriver.destLng1 = destLng;

    // either dest2 or 3 is available. Set the users location to the available one
    if (closestDriver.destLat2 === 0) {
      closestDriver.destLat2 = lat;
      closestDriver.destLng2 = lng;
    } else {
      closestDriver.destLat3 = lat;
      closestDriver.destLng3 = lng;
    }

    try {
      await connection.getRepository(Driver).save(closestDriver);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

    // add user's driver to their session
    req.session.driver = closestDriver;

    return res.status(HttpStatus.OK).json(closestDriver);
  });

  app.post(routes.ARRIVED, async (req, res, next) => {
    const { username } = req.session;

    let info;
    try {
      info = await connection.getRepository(Passenger).findOne({
        select: ['username', 'groupSize', 'driver'],
        relations: ['driver'],
        where: {
          username,
        },
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

    if (!info) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send('Unable to find driver info');
    }

    const { groupSize, driver } = info;

    console.log(groupSize);

    if (driver) {
      driver.numOfSeats += groupSize;

      if (driver.destLat1 !== 0) {
        driver.currentLatitude = driver.destLat1;
        driver.currentLongitude = driver.destLng1;
      }

      driver.destLat1 = 0;
      driver.destLng1 = 0;

      driver.destLat2 = 0;
      driver.destLng2 = 0;

      driver.destLat3 = 0;
      driver.destLng3 = 0;
    }

    try {
      await connection.getRepository(Driver).save(driver);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

    try {
      await connection.getRepository(Passenger).remove(info);
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
    }

    return res.status(HttpStatus.OK).send('Processed arrival');
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
      return res.statusCode(HttpStatus.NOT_FOUND).send('Could not find user');
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
