import { exists } from 'fs';
import { ncp } from 'ncp';
import path from 'path';
import { promisify } from 'util';

const pathToEnvExample = path.join(__dirname, '../.env.example');
const pathToEnv = path.join(pathToEnvExample, '../.env');

(async () => {
  const pathExists = await promisify(exists)(pathToEnvExample);
  if (pathExists) {
    await promisify(ncp)(pathToEnvExample, pathToEnv, {
      clobber: false,
    });
  }
})();
