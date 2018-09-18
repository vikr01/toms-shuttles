import 'pretty-error/start';
import 'dotenv/config';
import express from 'express';
import assets from 'tbd-frontend-name';
import { promisify } from 'util';
import allMiddleware from './middleware';

(async () => {
  const app = express();
  app.set('port', process.env.PORT);
  app.use(express.static(assets));

  allMiddleware.forEach(middleware => {});

  await promisify(app.listen).bind(app)(app.get('port'));
  console.log('app started');
})();

process.on('unhandledRejection', err => {
  throw err;
});
