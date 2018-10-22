import { User } from './entity/User';
import { Driver } from './entity/Driver';

export const connectionOptions = {
  type: 'mysql',
  port: 3306,
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Driver],
};

export default connectionOptions;
