import { User } from './entity/User';
import { Driver } from './entity/Driver';
import { Passenger } from './entity/Passenger';
import { CreditCard } from './entity/CreditCard';

let dbCredentials;

if (process.env.DB_TYPE === 'mysql') {
  dbCredentials = {
    type: 'mysql',
    port: 3306,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  };
} else if (process.env.DB_TYPE === 'sqlite') {
  dbCredentials = {
    type: 'sqlite',
    database: 'database.sqlite',
  };
}

if (!dbCredentials) {
  throw new Error('You must set the DB_TYPE environment variable');
}

export const connectionOptions = {
  ...dbCredentials,
  synchronize: true,
  logging: false,
  entities: [User, Driver, Passenger, CreditCard],
};

export default connectionOptions;
