import { base as dbConfigBase } from 'toms-shuttles-backend/src/dbConfig';

export default {
  ...dbConfigBase,
  type: 'sqljs',
  synchronize: true,
};
