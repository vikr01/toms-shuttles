import { base as dbConfigBase } from 'tbd-backend-name/src/dbConfig';

export default {
  ...dbConfigBase,
  type: 'sqljs',
  synchronize: true,
};
