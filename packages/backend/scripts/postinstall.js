// @flow
import { exists } from 'fs';
import { ncp } from 'ncp';
import path from 'path';
import { promisify } from 'util';

const pathToDotEnvExample: string = path.join(__dirname, '../.env.example');
const pathToDotEnv: string = path.join(pathToDotEnvExample, '../.env');

(async () => {
  const pathExists: boolean = await promisify(exists)(pathToDotEnv);
  if (pathExists) {
    await promisify(ncp)(pathToDotEnvExample, pathToDotEnv, {
      clobber: false,
    });
  }
})();
