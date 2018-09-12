import 'pretty-error/start';
import 'dotenv/config';
import express from 'express';
import assets from 'tbd-frontend-name';
import { promisify } from 'util';
import chalk from 'chalk';

(async () => {
  const app = express();
  app.set('port', process.env.PORT);
  app.use(express.static(assets));

  await promisify(app.listen).bind(app)(app.get('port'));
})().catch(err => {
  console.error(chalk.red(err.stack));
  process.exit(1);
});
