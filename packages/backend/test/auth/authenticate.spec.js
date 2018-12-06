import '../helpers/loadTestEnv';
import { createConnection } from 'typeorm';
import request from 'supertest';
import HttpStatus from 'http-status-codes';
import server from 'toms-shuttles-backend/src/server';
import routes from 'toms-shuttles-backend/lib/routes';
import { apiKey, hashFn } from 'toms-shuttles-backend/src/envVars/parse';
import socketio from 'socket.io';
import connectionOptions from '../helpers/dbConfig';

const secret = 'temp-session-secret';

let connection;
let app;
const io = socketio();

beforeAll(async () => {
  connection = await createConnection(connectionOptions);
  app = server({
    apiKey,
    connection,
    hashFn,
    secret,
    io,
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
