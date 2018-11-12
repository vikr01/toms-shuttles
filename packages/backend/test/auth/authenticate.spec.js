import '../helpers/loadTestEnv';
import { createConnection } from 'typeorm';
import request from 'supertest';
import HttpStatus from 'http-status-codes';
import connectionOptions from '../helpers/dbConfig';
import server from '../../src/server';
import routes from '../../routes';
import { apiKey, hashFn } from '../../src/envVars/parse';

const secret = 'temp-session-secret';

let connection;
let app;

beforeAll(async () => {
  connection = await createConnection(connectionOptions);
  app = server({
    apiKey,
    connection,
    hashFn,
    secret,
  });
});

describe('database', () => {
  test('is connected', () => {
    expect(connection.isConnected).toBe(true);
  });
});

describe('forced authentication works', () => {
  describe('with the api', () => {
    test('logged in', async () => {
      const response = await request(app).get(routes.LOGGED_IN);
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.text).toEqual('User is not logged in');
    });
  });
});
