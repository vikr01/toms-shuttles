import { config as loadEnv } from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

const pathToRootEnv = path.join(__dirname, '../../.env');
if (existsSync(pathToRootEnv)) {
  loadEnv({
    path: pathToRootEnv,
  });
}

loadEnv({
  path: require.resolve('../testenv'),
});
