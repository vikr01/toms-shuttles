import '../helpers/loadTestEnv';
import { createConnection } from 'typeorm';
import request from 'supertest';
import HttpStatus from 'http-status-codes';
import { connectionOptions } from '../../src/db_connection';
import server from '../../src/server';
import routes from '../../routes';

let connection;
let app;

console.log('sqlite3 exists ', require('sqlite3'));
console.log('typeorm exists ', require('typeorm'));

beforeAll(async () => {
  connection = await createConnection(connectionOptions);
  app = server(connection);
});

describe('forced authentication', () => {
  describe('with the api', () => {
    test(routes.LOGGED_IN, async () => {
      const response = await request(app).get(routes.LOGGED_IN);
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.text).toEqual('User is not logged in');
    });
  });
});
